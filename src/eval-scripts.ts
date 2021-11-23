/**
 * 改变作用域链 执行子组件 js
 * @param code
 * @returns
 */
export const createEvalScripts = (codes: string[]): any => {
  return new Function(
    `
      return function({window, document, history, location}){
        with(window) {
          ${codes.join('\n').replaceAll('window.location', 'parent.location')}
        }
      }
    `,
  )();
};