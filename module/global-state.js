import { cloneDeep } from 'lodash';
let globalState = {};
const deps = {};
/**
 * deps[id].changeKeys 或 changeKeys 不存在，则直接触发监听 callback
 * 本次变化中匹配到 deps[id].changeKeys 的值，则触发监听 callback
 * 本次变化未匹配到 deps[id].changeKeys 的值，则不触发监听 callback
 * @param state
 * @param prevState
 * @param changeKeys
 */
function emitGlobal(state, prevState, changeKeys) {
    Object.keys(deps).forEach((id) => {
        if (deps[id].callback instanceof Function) {
            const isChange = deps[id].changeKeys && changeKeys ? deps[id].changeKeys.length + changeKeys.length !== new Set([...deps[id].changeKeys, ...changeKeys]).size : true;
            if (isChange) {
                deps[id].callback(cloneDeep(state), cloneDeep(prevState));
            }
        }
    });
}
export function initGlobalState(state = {}) {
    if (state === globalState) {
        console.warn('state has not changed！');
    }
    else {
        const prevGlobalState = cloneDeep(globalState);
        globalState = cloneDeep(state);
        emitGlobal(globalState, prevGlobalState);
    }
    return getMicroAppStateActions(`global-${+new Date()}`);
}
export function getMicroAppStateActions(id) {
    return {
        /**
         * onGlobalStateChange 全局依赖监听
         * @param callback
         * @param fireImmediately
         */
        onChange(callback, changeKeys, fireImmediately) {
            if (!(callback instanceof Function)) {
                console.error('callback must be function!');
                return;
            }
            if (deps[id]) {
                console.warn(`'${id}' global listener already exists before this, new listener will overwrite it.`);
            }
            deps[id] = {
                changeKeys,
                callback,
            };
            if (fireImmediately) {
                const cloneState = cloneDeep(globalState);
                callback(cloneState, cloneState);
            }
        },
        /**
         * setGlobalState 更新 store 数据
         * @param state
         */
        set(state = {}) {
            if (state === globalState) {
                console.warn('state has not changed！');
                return false;
            }
            const changeKeys = [];
            const prevGlobalState = cloneDeep(globalState);
            globalState = cloneDeep(Object.keys(state).reduce((_globalState, changeKey) => {
                changeKeys.push(changeKey);
                return Object.assign(_globalState, { [changeKey]: state[changeKey] });
            }, globalState));
            if (changeKeys.length === 0) {
                console.warn('state has not changed！');
                return false;
            }
            emitGlobal(globalState, prevGlobalState, changeKeys);
            return true;
        },
        get() {
            return globalState;
        },
        // 注销该应用下的依赖
        offChange() {
            delete deps[id];
            return true;
        },
    };
}
