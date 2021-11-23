import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { UserInfo } from './user-info';
import { LineChart } from './line-chart';

import zhCN from 'antd/lib/locale/zh_CN';

const mount = {
  UserInfo: (el: HTMLElement, props: any): void => {
    ReactDOM.render(
      <ConfigProvider locale={zhCN}>
        <UserInfo {...props}></UserInfo>
      </ConfigProvider>,
      el,
    );
  },
  LineChart: (el: HTMLElement, props: any): void => {
    ReactDOM.render(
      <ConfigProvider locale={zhCN}>
        <LineChart {...props}></LineChart>
      </ConfigProvider>,
      el,
    );
  },
};

export default mount;
