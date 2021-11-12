import { CSSProperties, ReactElement } from 'react';
import './index.less';
import { History } from 'history';
import { TenonBlock } from './type';
declare type Props = {
    block: TenonBlock;
    style?: CSSProperties;
    history: History;
    data?: Record<string, string>;
    mode?: 'development' | 'production';
};
export declare const TenonContainer: (props: Props) => ReactElement;
export {};
