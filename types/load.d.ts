declare module "axios" {
    interface AxiosRequestConfig {
        fileType?: string;
    }
}
export declare type Resource = {
    blocks: string[];
    js: string[];
    css: string[];
    library: string;
    key: string;
    path: string;
    root: () => ShadowRoot;
    publicPath: string;
    externals: {
        js: string[];
        css: string[];
    };
};
export declare type EntryConfig = {
    key: string;
    import: string;
};
declare type EntryConfigParams = {
    config: {
        key: string;
        import: string;
    };
    callback: (key?: string) => void;
    root: () => ShadowRoot;
};
export declare const blockRender: (key: string) => (() => HTMLElement);
/**
 * 读取入口文件获取配置
 * @param param0
 */
export declare const load: ({ config, callback, root, }: EntryConfigParams) => Promise<void>;
export {};
