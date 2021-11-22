import axios from 'axios';
import { MultipleProxySandbox } from './sandbox';
import { createEvalScripts } from './eval-scripts';

declare module "axios" {
  export interface AxiosRequestConfig {
    fileType?: string;
  }
}

export type Resource = {
  blocks: string[];
  js: string[];
  css: string[];
  library: string;
  key: string;
  path: string;
  root: () => ShadowRoot;
  publicPath: string;
  externals: {
    js: string[];
    css: string[];
  }
}

export type EntryConfig = {
  key: string;
  import: string;
}

type EntryConfigParams = {
  config: {
    key: string;
    import: string;
  };
  callback: (key?: string) => void;
  root: () => ShadowRoot;
}

const tenonMap: Record<string, any> = {} as const; // summao 存储空间
const blockSandboxMapping: Record<string, any> = {} as const; // 组件和沙箱 mapping
const entryMap: Record<string, any> = {} as const;

// 返回组件渲染方法
export const blockRender = (key: string): (() => HTMLElement) => {
  const library = blockSandboxMapping[key]
  const sandboxWindow = tenonMap[library].sandbox?.proxy.window;

  return sandboxWindow && sandboxWindow[library][key] ? sandboxWindow[library][key] : () => null
}


const tasks: Record<string, {
  key: string;
  callback: (key?: string) => void;
  root: () => ShadowRoot;
}[] | undefined> = {} as const; // 异步任务

/**
 * 读取入口文件获取配置
 * @param param0
 */
export const load = async ({
  config,
  callback,
  root,
}: EntryConfigParams): Promise<void> => {

  if (typeof config.import === 'string') {
    if (!document.getElementById('iframeContainer')) {
      const iframeContainer = document.createElement('div')
      iframeContainer.id = 'iframeContainer'
      iframeContainer.style.display = 'none'
      document.body.appendChild(iframeContainer)
    }

    if (!tasks[config.import]) {
      tasks[config.import] = []

      const res: {
        data: Resource
      } = entryMap[config.import] || await axios.get(config.import);

      entryMap[config.import] = res;

      mount({
        item: {
          ...res.data,
          key: config.key,
          path: config.import,
          root,
        },
      })
    }

    tasks[config.import]?.push({
      key: config.key,
      callback,
      root,
    })

  } else {
    callback(config.key);
  }
}

const ElementPrototype = ['appendChild', 'removeChild'];
const DocumentFragmentPrototype = ['getElementById'];
const Unscopables = ['Object', 'Reflect', 'Array', 'Function', 'Boolean', 'Symbol', 'Error', 'Promise', 'ResizeObserver'];

/**
 * 加载模块资源
 * @param item
 * @param callback
 */
export const mount = async ({
  item,
}: { item: Resource }): Promise<void> => {

  tenonMap[item.library] = tenonMap[item.library] || {}

  const { js, css, externals = { js: [], css: [] } } = item;
  const resourcePromise: Promise<any>[] = [];

  // 避免重复加载
  if (!tenonMap[item.library].run) {
    const jsList = (externals?.js || []).concat(js);
    jsList.map((jsItem: string) => {
      resourcePromise.push(
        axios.get(jsItem, {
          fileType: 'js',
          baseURL: item.publicPath,
        }),
      );
    });
  }

  // 避免重复加载
  if (!tenonMap[item.library].styles) {
    const cssList = (externals?.css || []).concat(css);
    cssList.map((cssItem: string) => {
      resourcePromise.push(
        axios.get(cssItem, {
          fileType: 'css',
          baseURL: item.publicPath,
        }),
      );
    });
  }

  const resource = await Promise.all(resourcePromise);

  const jsFiles: string[] = [];
  const cssFiles: string[] = [];
  resource.map(async (file) => {
    if (file.config.fileType === 'js') {
      jsFiles.push(file.data)
    } else if (file.config.fileType === 'css') {
      cssFiles.push(file.data)
    }
  });

  // 相同 library 复用已有沙箱
  if (!tenonMap[item.library].sandbox) {

    // 创建 window
    const _window = document.createElement('iframe')
    _window.id = item.library
    document.getElementById('iframeContainer')!.appendChild(_window);

    const context = {
      window: _window.contentWindow,
    };

    tenonMap[item.library].sandbox = new MultipleProxySandbox(
      item.library,
      context,
    );
    tenonMap[item.library].sandbox.active();

    const proxyWindow = tenonMap[item.library].sandbox.proxy;
    proxyWindow.body = item.root()

    Unscopables.map((key: any) => {
      proxyWindow.window[key] = window[key]
    })

    // 重写部分 dom 操作方法，解决组件中在 body 挂载/操作 dom 的问题
    ElementPrototype.map((key: string) => {
      proxyWindow.window.Element.prototype[key] = function (...args: [node: any]) {
        if (this.tagName === 'BODY') {
          // @ts-ignore
          return Element.prototype[key].apply(proxyWindow.body, args);
        }
        // @ts-ignore
        return Element.prototype[key].apply(this, args);
      };
    })

    DocumentFragmentPrototype.map((key: string) => {
      proxyWindow.window.Document.prototype.getElementById = function (...args: [any]) {
        if (this instanceof proxyWindow.window.Document) {
          // @ts-ignore
          return DocumentFragment.prototype[key].apply(proxyWindow.body, args)
        }
        // @ts-ignore
        return Document.prototype[key].apply(this, args)
      }
    })

    proxyWindow.window.Window.prototype.addEventListener = function (...args: any) {
      return Window.prototype.addEventListener.apply(window, args)
    }

    proxyWindow.window.Window.prototype.removeEventListener = function (...args: any) {
      return Window.prototype.removeEventListener.apply(window, args)
    }

    // proxyWindow.window.ResizeObserver = undefined
    // proxyWindow.window.MutationObserver = undefined
  }

  const proxyWindow = tenonMap[item.library].sandbox.proxy;

  tenonMap[item.library].run = tenonMap[item.library].run || createEvalScripts(jsFiles).bind(proxyWindow.window);
  tenonMap[item.library].styles = tenonMap[item.library].styles || cssFiles

  try {
    tenonMap[item.library].run(
      proxyWindow.window,
      proxyWindow.window.document,
    );
  } catch (error) {
    console.error(error)
  }

  // shadow dom 中插入组件样式
  tasks[item.path]?.map(task => {
    // style 方式插入样式 避免 css 异步加载导致样式问题
    tenonMap[item.library].styles.map((styleCode: string) => {
      const styleDom = document.createElement('style');
      styleDom.appendChild(document.createTextNode(styleCode));
      task.root().appendChild(styleDom);
    })

    blockSandboxMapping[task.key] = item.library
    task.callback(task.key);
  })

  setTimeout(() => {
    tasks[item.path] = undefined;
  })
};
