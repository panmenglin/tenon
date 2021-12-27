import { uniq, getTargetValue } from './utils';

type SymbolTarget = 'target' | 'globalContext';
type FakeWindow = Window & Record<PropertyKey, any>;
type FakeDocument = Document & Record<PropertyKey, any>;

const unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true,
  isNaN: true,
  Infinity: true,
  Reflect: true,
  Float64Array: true,
  Function: true,
  Map: true,
  NaN: true,
  Promise: true,
  Proxy: true,
  Set: true,
  parseInt: true,
  requestAnimationFrame: true,
};

// angular zone.js will overwrite Object.defineProperty
const rawObjectDefineProperty = Object.defineProperty;

const whiteList: any = [];

/**
 * 创建虚拟 Document
 * @param name
 * @param globalContext
 * @returns
 */
const createFakeDocument = (name: string, documentContext: FakeDocument) => {

  const fakeDocument = Object.assign(documentContext, {
    style: {}
  })

  const proxy: any = new Proxy(fakeDocument, {
    get: (target: any, key: keyof Document) => {

      if (target[key]) {
        if (typeof target[key] === 'function') {
          return function (...args: [any]) {
            if (key === 'querySelector') {
              if (args[0] === 'head' || args[0] === 'body') {
                args = ['.render-root']
              }
            }
            return target[key].apply(target, args)
          }
        } else {
          return target[key]
        }
      }

      if (!target[key] && document[key]) {
        if (typeof document[key] === 'function') {
          return function (...args: [any]) {
            const documentFunction: any = document[key]
            return documentFunction.apply(document, args)
          }
        } else {
          if (key === 'body') {
            return target
          }
          return document[key]
        }
      }
    },
  })

  return {
    fakeDocument: proxy
  }
}

/**
 * 创建虚拟 Window
 * @param name
 * @param globalContext
 * @returns
 */
const createFakeWindow = (name: string, globalContext: Window) => {

  const propertiesWithGetter = new Map<PropertyKey, boolean>();

  const fakeWindow = {} as FakeWindow;

  // 复制 window 中 configurable: false 的属性
  Object.getOwnPropertyNames(globalContext)
    .filter((key) => {
      const descriptor = Object.getOwnPropertyDescriptor(globalContext, key);
      return !descriptor?.configurable;
    })
    .forEach((key) => {

      const descriptor = Object.getOwnPropertyDescriptor(globalContext, key);

      if (descriptor) {
        const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');

        // 设置 top/parent/self/window configurable: true
        if (
          key === 'top' ||
          key === 'parent' ||
          key === 'self' ||
          key === 'window'
        ) {
          descriptor.configurable = true;

          // 设置 writable 解决浏览器兼容性问题，例如 safari/firefox 没有 writable 属性
          if (!hasGetter) {
            descriptor.writable = true;
          }
        }

        if (hasGetter) propertiesWithGetter.set(key, true);

        // 冻结 descriptor 避免被 angular zone.js 修改
        rawObjectDefineProperty(fakeWindow, key, Object.freeze(descriptor));
      }
    });

  return {
    fakeWindow,
    propertiesWithGetter
  }
}

/**
 * 多实例沙箱
 */
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

    const globalContext = context.window;
    const documentContext = context.document

    const { fakeWindow, propertiesWithGetter } = createFakeWindow(name, globalContext)
    const { fakeDocument } = createFakeDocument(name, documentContext);

    const hasOwnProperty = (key: PropertyKey) => fakeWindow.hasOwnProperty(key) || globalContext.hasOwnProperty(key);
    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();

    if (!fakeWindow) {
      return
    }

    const proxy: any = new Proxy(fakeWindow, {
      set: (target, key: PropertyKey, value) => {
        if (this.sandboxRunning) {
          if (!target.hasOwnProperty(key) && globalContext.hasOwnProperty(key)) {
            const descriptor = Object.getOwnPropertyDescriptor(globalContext, key);
            const { writable, configurable, enumerable } = descriptor!;
            if (writable) {
              Object.defineProperty(target, key, {
                configurable,
                enumerable,
                writable,
                value,
              });
            }
          } else {
            // @ts-ignore
            target[key] = value;
          }

          // 白名单可跳过
          if (whiteList.indexOf(key) !== -1) {
            // @ts-ignore
            globalContext[key] = value;
          }

          return true;
        }

        return true;
      },
      get: (target, key: PropertyKey) => {

        if (key === Symbol.unscopables) return unscopables;
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (key === 'window' || key === 'self') {
          return proxy;
        }

        // hijack globalWindow accessing with globalThis keyword
        if (key === 'globalThis') {
          return proxy;
        }

        if (
          key === 'top' ||
          key === 'parent' ||
          (process.env.NODE_ENV === 'test' && (key === 'mockTop' || key === 'mockSafariTop'))
        ) {
          // if your master app in an iframe context, allow these props escape the sandbox
          if (globalContext === globalContext.parent) {
            return proxy;
          }
          return (globalContext as any)[key];
        }

        // proxy.hasOwnProperty would invoke getter firstly, then its value represented as globalContext.hasOwnProperty
        if (key === 'hasOwnProperty') {
          return hasOwnProperty;
        }

        if (key === 'document') {
          return fakeDocument;
        }

        if (key === 'eval') {
          return eval;
        }

        const value = propertiesWithGetter.has(key)
          ? (globalContext as any)[key]
          : key in target
            ? (target as any)[key]
            : (globalContext as any)[key];

        const boundTarget = globalContext
        return getTargetValue(boundTarget, value);
      },
      // trap to support iterator with sandbox
      ownKeys(target: FakeWindow): ArrayLike<string | symbol> {
        return uniq(Reflect.ownKeys(globalContext).concat(Reflect.ownKeys(target)));
      },

      defineProperty(target: Window, p: PropertyKey, attributes: PropertyDescriptor): boolean {
        const from = descriptorTargetMap.get(p);
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */
        switch (from) {
          case 'globalContext':
            return Reflect.defineProperty(globalContext, p, attributes);
          default:
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      deleteProperty: (target: FakeWindow, p: string | number | symbol): boolean => {
        if (target.hasOwnProperty(p)) {
          delete target[p];
          return true;
        }

        return true;
      },
      // makes sure `window instanceof Window` returns truthy in micro app
      getPrototypeOf() {
        return Reflect.getPrototypeOf(globalContext);
      },
    })
    this.proxy = proxy;
  }
}
