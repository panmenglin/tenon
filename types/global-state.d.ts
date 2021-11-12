export declare type OnGlobalStateChange = {
    changeKeys: string[];
    callback: (state: Record<string, any>, prevState: Record<string, any>) => void;
};
export declare type OnGlobalStateChangeCallback = (state: Record<string, any>, prevState: Record<string, any>) => void;
export declare type MicroAppStateActions = {
    onChange: (callback: OnGlobalStateChangeCallback, changeKeys: string[], fireImmediately?: boolean) => void;
    set: (state: Record<string, any>) => boolean;
    get: () => Record<string, any>;
    offChange: () => boolean;
};
export declare function initGlobalState(state?: Record<string, any>): MicroAppStateActions;
export declare function getMicroAppStateActions(id: string): MicroAppStateActions;
