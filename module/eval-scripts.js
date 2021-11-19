/**
 * 改变作用域链 执行子组件 js
 * @param code
 * @returns
 */
export const createEvalScripts = (codes) => {
    return new Function(`
      return function(window){
        with(window) {
          ${codes.join('\n')}
        }
      }
    `)();
};
