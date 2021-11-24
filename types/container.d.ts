import { CSSProperties, ReactElement } from 'react';
import './index.less';
import { TenonBlock } from './type';
declare type Props = {
    block: TenonBlock;
    style?: CSSProperties;
    data?: Record<string, string>;
    mode?: 'development' | 'production';
};
export declare const TenonContainer: (props: Props) => ReactElement;
export {};
