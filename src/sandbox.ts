/**
 * 多实例沙箱
 */

const elementPrototype = ['appendChild', 'removeChild', 'querySelector', 'querySelectorAll'] as const;
const documentFragmentPrototype = ['getElementById'] as const;
const documentPrototype = ['querySelector', 'querySelectorAll'] as const;
const windowPrototype = ['addEventListener', 'removeEventListener'] as const;
const unscopables = ['Object', 'Reflect', 'Array', 'Function', 'Boolean', 'Symbol', 'Error', 'Promise', 'ResizeObserver', 'history'] as const;

const changeFakeWindowPropertype = (fakeWindow: Window) => {
  // 解决主子应用 window 间差异性问题
  unscopables.map((key: any) => {
    Object.defineProperty(fakeWindow, key, {
      get: function () {
        return window[key];
      }
    });
  })

  // 重写部分 dom 操作方法，解决组件中在 body 挂载/操作 dom 的问题
  elementPrototype.map((key: string) => {
    // @ts-ignore
    fakeWindow.Element.prototype[key] = function (...args: [node: any]) {
      if (this.tagName === 'BODY') {
        // @ts-ignore
        return Element.prototype[key].apply(fakeWindow.body, args);
      }
      // @ts-ignore
      return Element.prototype[key].apply(this, args);
    };
  })

  documentFragmentPrototype.map((key: string) => {
    // @ts-ignore
    fakeWindow.Document.prototype[key] = function (...args: [any]) {
      // @ts-ignore
      if (this instanceof fakeWindow.Document) {
        // @ts-ignore
        return DocumentFragment.prototype[key].apply(fakeWindow.body, args)
      }
      // @ts-ignore
      return Document.prototype[key].apply(this, args)
    }
  })

  documentPrototype.map((key: string) => {
    // @ts-ignore
    fakeWindow.Document.prototype[key] = function (...args: [any]) {
      // @ts-ignore
      if (this instanceof fakeWindow.Document) {
        // @ts-ignore
        return Document.prototype[key].apply(document, args)
      }
      // @ts-ignore
      return Document.prototype[key].apply(this, args)
    }
  })

  windowPrototype.map((key: string) => {
    // @ts-ignore
    fakeWindow.Window.prototype[key] = function (...args: any) {
      // @ts-ignore
      return Window.prototype[key].apply(window, args)
    }
  })
}

const createFakeWindow = (name: string) => {
  // 创建 window
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none';
  iframe.id = name;
  document.body.appendChild(iframe);

  const fakeWindow = iframe.contentWindow
  if (fakeWindow) {
    changeFakeWindowPropertype(fakeWindow)
  }

  return {
    fakeWindow
  }
}


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

    const { fakeWindow } = createFakeWindow(name)

    if (!fakeWindow) {
      return
    }

    const proxy = new Proxy(fakeWindow, {
      set: (target, key: PropertyKey, value) => {
        if (this.sandboxRunning) {
          // @ts-ignore
          if (fakeWindow[key]) {
            // @ts-ignore
            context[key] = value;
          }

          // @ts-ignore
          target[key] = value;
        }

        return true;
      },
      get: (target, key: PropertyKey) => {
        // 优先使用共享对象
        if (key === Symbol.unscopables) return unscopables;


        // @ts-ignore
        if (fakeWindow[key]) {
          // @ts-ignore
          return fakeWindow[key]
        }

        // @ts-ignore
        return target[key];
      },
    })
    this.proxy = proxy;
  }
}
