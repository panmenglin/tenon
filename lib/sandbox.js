"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleProxySandbox = void 0;
/**
 * 多实例沙箱
 */
class MultipleProxySandbox {
    /**
     * 构造函数
     * @param {*} name 沙箱名称
     * @param {*} context 共享的上下文
     * @returns
     */
    constructor(name, context = {}) {
        this.sandboxRunning = false;
        this.name = name;
        this.proxy = null;
        const fakeWindow = Object.create({});
        const proxy = new Proxy(fakeWindow, {
            set: (target, key, value) => {
                if (this.sandboxRunning) {
                    if (Object.keys(context).includes(key)) {
                        context[key] = value;
                    }
                    target[key] = value;
                }
                return true;
            },
            get: (target, key) => {
                // 优先使用共享对象
                if (Object.keys(context).includes(key)) {
                    return context[key];
                }
                return target[key];
            },
        });
        this.proxy = proxy;
    }
    active() {
        this.sandboxRunning = true;
    }
    inactive() {
        this.sandboxRunning = false;
    }
}
exports.MultipleProxySandbox = MultipleProxySandbox;
