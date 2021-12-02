import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { UserInfo } from './user-info';
import { LineChart } from './line-chart';

import zhCN from 'antd/lib/locale/zh_CN';

const blocks = {
  UserInfo: {
    mount: (el: HTMLElement, props: any): void => {
      ReactDOM.render(
        <ConfigProvider locale={zhCN}>
          <UserInfo {...props}></UserInfo>
        </ConfigProvider>,
        el
      );
    },
    unmount: (el: HTMLElement): void => {
      ReactDOM.unmountComponentAtNode(el);
    },
  },
  LineChart: {
    mount: (el: HTMLElement, props: any): void => {
      ReactDOM.render(
        <ConfigProvider locale={zhCN}>
          <LineChart {...props}></LineChart>
        </ConfigProvider>,
        el
      );
    },
    unmount: (el: HTMLElement): void => {
      ReactDOM.unmountComponentAtNode(el);
    },
  },
};

export default blocks;
