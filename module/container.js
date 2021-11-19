import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState, useRef, } from 'react';
import root from 'react-shadow';
import retargetEvents from 'react-shadow-dom-retarget-events';
// utils
import { load, blockRender } from './load';
// styles
import './index.less';
// stores
import { globalState } from './index';
export const TenonContainer = (props) => {
    const { block, style, data, history, mode = 'production' } = props;
    const shadowDom = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const asyncBlock = mode === 'development' && block.import && typeof block.import === 'string';
    /**
     * 更新加载状态
     */
    const updateLoaded = useCallback(() => {
        setLoaded(true);
    }, [setLoaded]);
    useEffect(() => {
        load({
            config: {
                ...block,
            },
            callback: updateLoaded,
            root: () => {
                var _a;
                return (_a = shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current) === null || _a === void 0 ? void 0 : _a.shadowRoot;
            },
        });
    }, []);
    useEffect(() => {
        if (shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current) {
            retargetEvents(shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current);
        }
    }, [shadowDom]);
    /**
     * 资源渲染
     */
    const componentRender = useCallback((blockItem, _props) => {
        var _a;
        const RenderFn = blockItem.import && typeof blockItem.import === 'string'
            ? blockRender(blockItem.key)
            : blockItem.import;
        return blockItem.import && typeof blockItem.import === 'string' ? (RenderFn((_a = shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current) === null || _a === void 0 ? void 0 : _a.shadowRoot.querySelectorAll('.render-root')[0], {
            history: history,
            ..._props,
            onGlobalStateChange: globalState.onChange,
            setGlobalState: globalState.set,
            getGlobalState: globalState.get,
        })) : (_jsx(RenderFn, Object.assign({ history: history }, _props, { onGlobalStateChange: globalState.onChange, setGlobalState: globalState.set, getGlobalState: globalState.get }), void 0));
    }, [history, shadowDom]);
    return (_jsxs("div", Object.assign({ className: `block-container ${asyncBlock ? 'async-block' : ''}`, style: {
            minHeight: !loaded ? '200px' : 'initial',
            ...style,
        } }, { children: [asyncBlock ? (_jsxs("div", Object.assign({ className: "devtool-block-info" }, { children: [block.name, " - ", block.domain, " / ", block.import] }), void 0)) : null, !loaded ? (_jsx("div", Object.assign({ className: "spin spin-spinning" }, { children: _jsxs("span", Object.assign({ className: "spin-dot spin-dot-spin" }, { children: [_jsx("i", { className: "spin-dot-item" }, void 0), _jsx("i", { className: "spin-dot-item" }, void 0), _jsx("i", { className: "spin-dot-item" }, void 0), _jsx("i", { className: "spin-dot-item" }, void 0)] }), void 0) }), void 0)) : null, block.import && typeof block.import === 'string' ? (_jsx(root.div, Object.assign({ delegatesFocus: true, ref: shadowDom }, { children: _jsx("div", { children: _jsx("div", Object.assign({ className: "render-root" }, { children: loaded
                            ? componentRender(block, {
                                ...data,
                            })
                            : null }), void 0) }, void 0) }), void 0)) : (_jsx("div", Object.assign({ className: "render-root" }, { children: loaded
                    ? componentRender(block, {
                        ...data,
                    })
                    : null }), void 0))] }), void 0));
};
