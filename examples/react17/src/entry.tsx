import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import { App } from './app';

import './app.less';

const mount = {
  React17App: (el: HTMLElement, props: any): void => {
    ReactDOM.render(
      <ConfigProvider locale={zhCN}>
        <App history={createBrowserHistory()} {...props}/>
      </ConfigProvider>,
      el,
    );
  },
};

export default mount;
