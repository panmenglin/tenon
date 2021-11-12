"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMicroAppStateActions = exports.initGlobalState = void 0;
const lodash_1 = require("lodash");
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
                deps[id].callback((0, lodash_1.cloneDeep)(state), (0, lodash_1.cloneDeep)(prevState));
            }
        }
    });
}
function initGlobalState(state = {}) {
    if (state === globalState) {
        console.warn('state has not changed！');
    }
    else {
        const prevGlobalState = (0, lodash_1.cloneDeep)(globalState);
        globalState = (0, lodash_1.cloneDeep)(state);
        emitGlobal(globalState, prevGlobalState);
    }
    return getMicroAppStateActions(`global-${+new Date()}`);
}
exports.initGlobalState = initGlobalState;
function getMicroAppStateActions(id) {
    return {
        /**
         * onGlobalStateChange 全局依赖监听
         *
         * 收集 setState 时所需要触发的依赖
         *
         * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
         *
         * 这么设计是为了减少全局监听滥用导致的内存爆炸
         *
         * 依赖数据结构为：
         * {
         *   {id}: callback
         * }
         *
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
                const cloneState = (0, lodash_1.cloneDeep)(globalState);
                callback(cloneState, cloneState);
            }
        },
        /**
         * setGlobalState 更新 store 数据
         *
         * 1. 更新 state
         * 2. 修改 store 并触发全局监听
         *
         * @param state
         */
        set(state = {}) {
            if (state === globalState) {
                console.warn('state has not changed！');
                return false;
            }
            const changeKeys = [];
            const prevGlobalState = (0, lodash_1.cloneDeep)(globalState);
            globalState = (0, lodash_1.cloneDeep)(Object.keys(state).reduce((_globalState, changeKey) => {
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
exports.getMicroAppStateActions = getMicroAppStateActions;
