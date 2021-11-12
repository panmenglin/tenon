/**
 * 改变作用域链 执行子组件 js
 * @param code
 * @returns
 */
export const createEvalScripts = (codes: string[]): any => {
  return new Function(
    `
      return function({window, location, history, document, proxyWindow}){
        with(proxyWindow) {
          ${codes.join('\n')}
        }
      }
    `,
  )();
};