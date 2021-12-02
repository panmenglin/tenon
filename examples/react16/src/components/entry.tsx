import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { LineChart } from './chart-line';

import zhCN from 'antd/lib/locale/zh_CN';

const blocks = {
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
