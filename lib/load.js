"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mount = exports.load = exports.blockRender = void 0;
const axios_1 = __importDefault(require("axios"));
const sandbox_1 = require("./sandbox");
const eval_scripts_1 = require("./eval-scripts");
const tenonMap = {}; // summao 存储空间
const blockSandboxMapping = {}; // 组件和沙箱 mapping
// 返回组件渲染方法
const blockRender = (key) => {
    var _a;
    const library = blockSandboxMapping[key];
    const sandboxWindow = (_a = tenonMap[library].sandbox) === null || _a === void 0 ? void 0 : _a.proxy;
    return sandboxWindow && sandboxWindow[library][key] ? sandboxWindow[library][key] : () => null;
};
exports.blockRender = blockRender;
const tasks = {}; // 异步任务
/**
 * 读取入口文件获取配置
 * @param param0
 */
const load = async ({ config, callback, root, }) => {
    var _a, _b;
    if (typeof config.import === 'string') {
        if (!document.getElementById('iframeContainer')) {
            const iframeContainer = document.createElement('div');
            iframeContainer.id = 'iframeContainer';
            iframeContainer.style.display = 'none';
            document.body.appendChild(iframeContainer);
        }
        if (!tasks[config.import]) {
            tasks[config.import] = [];
            const res = await axios_1.default.get(config.import);
            (0, exports.mount)({
                item: {
                    ...res.data,
                    key: config.key,
                    path: config.import,
                    root,
                },
            });
        }
        // 限制了同一页面只能加载一次相同组件
        if (!((_a = tasks[config.import]) === null || _a === void 0 ? void 0 : _a.find(block => block.key === config.key))) {
            // 添加任务
            (_b = tasks[config.import]) === null || _b === void 0 ? void 0 : _b.push({
                key: config.key,
                callback,
                root,
            });
        }
    }
    else {
        callback(config.key);
    }
};
exports.load = load;
const ElementPrototype = {
    appendChild: Element.prototype.appendChild,
    removeChild: Element.prototype.removeChild,
};
/**
 * 加载模块资源
 * @param item
 * @param callback
 */
const mount = async ({ item, }) => {
    var _a;
    tenonMap[item.library] = tenonMap[item.library] || {};
    const { js, css } = item;
    const resourcePromise = [];
    // 避免重复加载
    if (!tenonMap[item.library].run) {
        js.map((jsItem) => {
            resourcePromise.push(axios_1.default.get(jsItem, {
                fileType: 'js',
            }));
        });
    }
    // 避免重复加载
    if (!tenonMap[item.library].styles) {
        css.map((cssItem) => {
            resourcePromise.push(axios_1.default.get(cssItem, {
                fileType: 'css',
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
    tenonMap[item.library].run = tenonMap[item.library].run || (0, eval_scripts_1.createEvalScripts)(jsFiles);
    tenonMap[item.library].styles = tenonMap[item.library].styles || cssFiles;
    // 相同 library 复用已有沙箱
    if (!tenonMap[item.library].sandbox) {
        // 创建 window
        const _window = document.createElement('iframe');
        _window.id = item.library;
        document.getElementById('iframeContainer').appendChild(_window);
        const context = {
            window: _window.contentWindow,
            location,
            history,
            document: _window.contentWindow.document,
        };
        tenonMap[item.library].sandbox = new sandbox_1.MultipleProxySandbox(item.library, context);
        tenonMap[item.library].sandbox.active();
        const proxyWindow = tenonMap[item.library].sandbox.proxy;
        proxyWindow.body = item.root();
        // 重写部分 dom 操作方法，解决组件中在 body 挂载/操作 dom 的问题
        Object.keys(ElementPrototype).forEach(key => {
            proxyWindow.window.Element.prototype[key] = function (...args) {
                if (this.tagName === 'BODY') {
                    return ElementPrototype[key].apply(proxyWindow.body, args);
                }
                return ElementPrototype[key].apply(this, args);
            };
        });
    }
    const proxyWindow = tenonMap[item.library].sandbox.proxy;
    const { window, document: proxyDocument } = proxyWindow;
    tenonMap[item.library].run({
        window,
        document: proxyDocument,
        proxyWindow,
    });
    // shadow dom 中插入组件样式
    (_a = tasks[item.path]) === null || _a === void 0 ? void 0 : _a.map(task => {
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
exports.mount = mount;
