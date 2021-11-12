"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenonContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_shadow_1 = __importDefault(require("react-shadow"));
const react_shadow_dom_retarget_events_1 = __importDefault(require("react-shadow-dom-retarget-events"));
// utils
const load_1 = require("./load");
// styles
require("./index.less");
// stores
const index_1 = require("./index");
const TenonContainer = (props) => {
    const { block, style, data, history, mode = 'production' } = props;
    const shadowDom = (0, react_1.useRef)(null);
    const asyncBlock = mode === 'development' && block.import && typeof block.import === 'string';
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    /**
     * 更新加载状态
     */
    const updateLoaded = (0, react_1.useCallback)(() => {
        setLoaded(true);
    }, [setLoaded]);
    (0, react_1.useEffect)(() => {
        (0, load_1.load)({
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
    (0, react_1.useEffect)(() => {
        if (shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current) {
            (0, react_shadow_dom_retarget_events_1.default)(shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current);
        }
    }, [shadowDom]);
    /**
     * 资源渲染
     */
    const componentRender = (0, react_1.useCallback)((blockItem, _props) => {
        var _a;
        const RenderFn = blockItem.import && typeof blockItem.import === 'string'
            ? (0, load_1.blockRender)(blockItem.key)
            : blockItem.import;
        return blockItem.import && typeof blockItem.import === 'string' ? (RenderFn((_a = shadowDom === null || shadowDom === void 0 ? void 0 : shadowDom.current) === null || _a === void 0 ? void 0 : _a.shadowRoot.querySelectorAll('.render-root')[0], {
            history: history,
            ..._props,
            onGlobalStateChange: index_1.globalState.onChange,
            setGlobalState: index_1.globalState.set,
            getGlobalState: index_1.globalState.get,
        })) : ((0, jsx_runtime_1.jsx)(RenderFn, Object.assign({ history: history }, _props, { onGlobalStateChange: index_1.globalState.onChange, setGlobalState: index_1.globalState.set, getGlobalState: index_1.globalState.get }), void 0));
    }, [history, shadowDom]);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: `block-container ${asyncBlock ? 'async-blcok' : ''}`, style: {
            ...style,
        } }, { children: [asyncBlock ? ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "devtool-block-info" }, { children: [block.name, " - ", block.domain, (0, jsx_runtime_1.jsx)("br", {}, void 0), block.import] }), void 0)) : null, !loaded ? ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "spin spin-spinning" }, { children: (0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "spin-dot spin-dot-spin" }, { children: [(0, jsx_runtime_1.jsx)("i", { className: "spin-dot-item" }, void 0), (0, jsx_runtime_1.jsx)("i", { className: "spin-dot-item" }, void 0), (0, jsx_runtime_1.jsx)("i", { className: "spin-dot-item" }, void 0), (0, jsx_runtime_1.jsx)("i", { className: "spin-dot-item" }, void 0)] }), void 0) }), void 0)) : null, block.import && typeof block.import === 'string' ? ((0, jsx_runtime_1.jsx)(react_shadow_1.default.div, Object.assign({ delegatesFocus: true, ref: shadowDom }, { children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "render-root" }, { children: loaded
                            ? componentRender(block, {
                                ...data,
                            })
                            : null }), void 0) }, void 0) }), void 0)) : ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: "render-root" }, { children: loaded
                    ? componentRender(block, {
                        ...data,
                    })
                    : null }), void 0))] }), void 0));
};
exports.TenonContainer = TenonContainer;
