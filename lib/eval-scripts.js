"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvalScripts = void 0;
/**
 * 改变作用域链 执行子组件 js
 * @param code
 * @returns
 */
const createEvalScripts = (codes) => {
    return new Function(`
      return function({window, location, history, document, proxyWindow}){
        with(proxyWindow) {
          ${codes.join('\n')}
        }
      }
    `)();
};
exports.createEvalScripts = createEvalScripts;
