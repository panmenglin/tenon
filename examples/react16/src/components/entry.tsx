import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { ChartLine } from './chart-line';

import zhCN from 'antd/lib/locale/zh_CN';

const mount = {
  ChartLine: (el: HTMLElement, props: any): void => {
    ReactDOM.render(
      <ConfigProvider locale={zhCN}>
        <ChartLine {...props}></ChartLine>
      </ConfigProvider>,
      el,
    );
  },
};

export default mount;
