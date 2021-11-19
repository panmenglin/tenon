import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import { App } from './app';

import './app.less'

function render() {
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <App history={createBrowserHistory()} />
    </ConfigProvider>,
    document.querySelector('#root'),
  );
}

render();
