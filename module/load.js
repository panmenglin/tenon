import axios from 'axios';
import { MultipleProxySandbox } from './sandbox';
import { createEvalScripts } from './eval-scripts';
const tenonMap = {}; // summao 存储空间
const blockSandboxMapping = {}; // 组件和沙箱 mapping
const entryMap = {};
// 返回组件渲染方法
export const blockRender = (key) => {
    var _a;
    const library = blockSandboxMapping[key];
    const sandboxWindow = (_a = tenonMap[library].sandbox) === null || _a === void 0 ? void 0 : _a.proxy.window;
    return sandboxWindow && sandboxWindow[library][key] ? sandboxWindow[library][key] : () => null;
};
const tasks = {}; // 异步任务
/**
 * 读取入口文件获取配置
 * @param param0
 */
export const load = async ({ config, callback, root, }) => {
    var _a;
    if (typeof config.import === 'string') {
        if (!document.getElementById('iframeContainer')) {
            const iframeContainer = document.createElement('div');
            iframeContainer.id = 'iframeContainer';
            iframeContainer.style.display = 'none';
            document.body.appendChild(iframeContainer);
        }
        if (!tasks[config.import]) {
            tasks[config.import] = [];
            const res = entryMap[config.import] || await axios.get(config.import);
            entryMap[config.import] = res;
            mount({
                item: {
                    ...res.data,
                    key: config.key,
                    path: config.import,
                    root,
                },
            });
        }
        (_a = tasks[config.import]) === null || _a === void 0 ? void 0 : _a.push({
            key: config.key,
            callback,
            root,
        });
    }
    else {
        callback(config.key);
    }
};
const ElementPrototype = ['appendChild', 'removeChild'];
const DocumentFragmentPrototype = ['getElementById'];
const Unscopables = ['Object', 'Reflect', 'Array', 'Function', 'Boolean', 'Symbol', 'Error', 'Promise'];
/**
 * 加载模块资源
 * @param item
 * @param callback
 */
export const mount = async ({ item, }) => {
    var _a;
    tenonMap[item.library] = tenonMap[item.library] || {};
    const { js, css, externals = { js: [], css: [] } } = item;
    const resourcePromise = [];
    // 避免重复加载
    if (!tenonMap[item.library].run) {
        const jsList = ((externals === null || externals === void 0 ? void 0 : externals.js) || []).concat(js);
        jsList.map((jsItem) => {
            resourcePromise.push(axios.get(jsItem, {
                fileType: 'js',
                baseURL: item.publicPath,
            }));
        });
    }
    // 避免重复加载
    if (!tenonMap[item.library].styles) {
        const cssList = ((externals === null || externals === void 0 ? void 0 : externals.css) || []).concat(css);
        cssList.map((cssItem) => {
            resourcePromise.push(axios.get(cssItem, {
                fileType: 'css',
                baseURL: item.publicPath,
            }));
        });
    }
    const resource = await Promise.all(resourcePromise);
    const jsFiles = [];
    const cssFiles = [];
    resource.map(async (file) => {
        if (file.config.fileType === 'js') {
            jsFiles.push(file.data);
        }
        else if (file.config.fileType === 'css') {
            cssFiles.push(file.data);
        }
    });
    // 相同 library 复用已有沙箱
    if (!tenonMap[item.library].sandbox) {
        // 创建 window
        const _window = document.createElement('iframe');
        _window.id = item.library;
        document.getElementById('iframeContainer').appendChild(_window);
        const context = {
            window: _window.contentWindow,
        };
        tenonMap[item.library].sandbox = new MultipleProxySandbox(item.library, context);
        tenonMap[item.library].sandbox.active();
        const proxyWindow = tenonMap[item.library].sandbox.proxy;
        proxyWindow.body = item.root();
        Unscopables.map((key) => {
            proxyWindow.window[key] = window[key];
        });
        // 重写部分 dom 操作方法，解决组件中在 body 挂载/操作 dom 的问题
        ElementPrototype.map((key) => {
            proxyWindow.window.Element.prototype[key] = function (...args) {
                if (this.tagName === 'BODY') {
                    // @ts-ignore
                    return Element.prototype[key].apply(proxyWindow.body, args);
                }
                // @ts-ignore
                return Element.prototype[key].apply(this, args);
            };
        });
        DocumentFragmentPrototype.map((key) => {
            proxyWindow.window.Document.prototype.getElementById = function (...args) {
                if (this instanceof proxyWindow.window.Document) {
                    // @ts-ignore
                    return DocumentFragment.prototype[key].apply(proxyWindow.body, args);
                }
                // @ts-ignore
                return Document.prototype[key].apply(this, args);
            };
        });
    }
    const proxyWindow = tenonMap[item.library].sandbox.proxy;
    tenonMap[item.library].run = tenonMap[item.library].run || createEvalScripts(jsFiles).bind(proxyWindow.window);
    tenonMap[item.library].styles = tenonMap[item.library].styles || cssFiles;
    try {
        tenonMap[item.library].run(proxyWindow.window, proxyWindow.window.document);
    }
    catch (error) {
        console.error(error);
    }
    // shadow dom 中插入组件样式
    (_a = tasks[item.path]) === null || _a === void 0 ? void 0 : _a.map(task => {
        // style 方式插入样式 避免 css 异步加载导致样式问题
        tenonMap[item.library].styles.map((styleCode) => {
            const styleDom = document.createElement('style');
            styleDom.appendChild(document.createTextNode(styleCode));
            task.root().appendChild(styleDom);
        });
        blockSandboxMapping[task.key] = item.library;
        task.callback(task.key);
    });
    setTimeout(() => {
        tasks[item.path] = undefined;
    });
};
