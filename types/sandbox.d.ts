/**
 * 多实例沙箱
 */
export declare class MultipleProxySandbox {
    sandboxRunning: boolean;
    name: string;
    proxy: Window | null;
    active(): void;
    inactive(): void;
    /**
     * 构造函数
     * @param {*} name 沙箱名称
     * @param {*} context 共享的上下文
     * @returns
     */
    constructor(name: string, context?: Record<string, any>);
}
