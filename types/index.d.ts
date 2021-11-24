/// <reference types="react" />
import { TenonContainer } from './container';
import type { TenonBlock } from './type';
declare const globalState: import("./global-state").MicroAppStateActions;
export { TenonContainer, TenonBlock, globalState };
declare const _default: {
    TenonContainer: (props: {
        block: TenonBlock;
        style?: import("react").CSSProperties | undefined;
        data?: Record<string, string> | undefined;
        mode?: "development" | "production" | undefined;
    }) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
    globalState: import("./global-state").MicroAppStateActions;
};
export default _default;
