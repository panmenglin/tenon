/**
 * 多实例沙箱
 */

// const CannotBeCalled: string[] = [
//   'ArrayBuffer',
//   'FormData',
//   'DataView',
//   'FileReader',
//   'Float32Array',
//   'Float64Array',
//   'Audio',
//   'Image',
//   'Option',
//   'Int16Array',
//   'Int32Array',
//   'Int8Array',
//   'MessageChannel',
//   'MutationObserver',
//   'SharedWorker',
//   'Uint16Array',
//   'Uint32Array',
//   'Uint8Array',
//   'WebKitCSSMatrix',
//   'WebKitPoint',
//   'WebSocket',
//   'Worker',
//   'XMLHttpRequest',
//   'XSLTProcessor',
// ];

// const SandboxKeys: string[] = [
//   '__mobxGlobals',
//   '__mobxInstanceCount',
// ]

export class MultipleProxySandbox {

  sandboxRunning = false
  name
  proxy

  active(): void {
    this.sandboxRunning = true;
  }
  inactive(): void {
    this.sandboxRunning = false;
  }

  /**
   * 构造函数
   * @param {*} name 沙箱名称
   * @param {*} context 共享的上下文
   * @returns
   */
  constructor(name: string, context: Record<string, any> = {}) {

    this.name = name;
    this.proxy = null;
    const fakeWindow = Object.create({});

    const proxy = new Proxy(fakeWindow, {
      set: (target, key: string, value) => {
        if (this.sandboxRunning) {
          if (Object.keys(context).includes(key)) {
            context[key] = value;
          }
          target[key] = value;
        }

        return true;
      },
      get: (target, key: string) => {
        // 优先使用共享对象
        if (Object.keys(context).includes(key)) {
          return context[key];
        }

        // if (context?.window[key] && !target[key] && !SandboxKeys.includes(key)) {
        //   if (typeof context.window[key] === 'function' && !CannotBeCalled.includes(key)) {
        //     return function (...args) {
        //       return context.window[key].apply(window, args)
        //     }
        //   }

        //   return context.window[key]
        // }

        return target[key];
      },
    })
    this.proxy = proxy;
  }
}
