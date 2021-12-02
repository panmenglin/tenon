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
  root: () => Promise<ShadowRoot>;
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
  root: () => Promise<ShadowRoot>;
}

const tenonMap: Record<string, any> = {} as const; // summao 存储空间
const blockSandboxMapping: Record<string, any> = {} as const; // 组件和沙箱 mapping
const entryMap: Record<string, any> = {} as const;

// 返回组件渲染方法
export const blockLifeCycle = (key: string): {
  mount: (el: HTMLElement, props: Record<string, any>) => HTMLElement,
  unmount: (el: HTMLElement) => void,
} => {
  const library = blockSandboxMapping[key]
  const sandboxWindow = tenonMap[library].sandbox?.proxy.window;

  return sandboxWindow && sandboxWindow[library][key] ? {
    mount: sandboxWindow[library][key].mount,
    unmount: sandboxWindow[library][key].unmount,
  } : {
    mount: () => null,
    unmount: () => null,
  }
}


const tasks: Record<string, {
  key: string;
  callback: (key?: string) => void;
  root: () => Promise<ShadowRoot>;
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

/**
 * 加载模块资源
 * @param item
 * @param callback
 */
const mount = async ({
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
  const cssFiles: Map<string, string> = new Map();
  resource.map(async (file) => {
    if (file.config.fileType === 'js') {
      jsFiles.push(file.data)
    } else if (file.config.fileType === 'css') {
      cssFiles.set(file.config.url, file.data)
    }
  });

  // 相同 library 复用已有沙箱
  if (!tenonMap[item.library].sandbox) {

    tenonMap[item.library].sandbox = new MultipleProxySandbox(
      item.library,
    );
    tenonMap[item.library].sandbox.active();

  }

  const proxyWindow = tenonMap[item.library].sandbox.proxy;
  proxyWindow.body = await item.root()

  tenonMap[item.library].run = tenonMap[item.library].run || createEvalScripts(jsFiles).bind(proxyWindow.window);
  tenonMap[item.library].styles = tenonMap[item.library].styles || cssFiles

  try {
    tenonMap[item.library].run({
      window: proxyWindow.window,
    });
  } catch (error) {
    console.error(error)
  }

  // shadow dom 中插入组件样式
  tasks[item.path]?.map(async task => {
    // style 方式插入样式 避免 css 异步加载导致样式问题
    const rootDom = await task.root();

    if (rootDom) {
      tenonMap[item.library].styles.forEach((value: string, key: string) => {
        const styleId = key.replace(/[^a-zA-Z\d]/g, '');
        // 避免更新时重复添加
        if (rootDom.querySelector(`#${styleId}`)) {
          return
        }

        const styleDom = document.createElement('style');
        styleDom.id = styleId;
        styleDom.appendChild(document.createTextNode(value));
        rootDom.appendChild(styleDom);
      })
    }

    blockSandboxMapping[task.key] = item.library
    task.callback(task.key);
  })

  setTimeout(() => {
    tasks[item.path] = undefined;
  })
};
