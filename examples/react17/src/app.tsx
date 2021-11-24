import React, { FC, useLayoutEffect } from 'react';
import { Space } from 'antd';
import { History } from 'history';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { IndexPage } from './pages/index';
import { Demo } from './pages/demo';

interface Props {
  history: History;
}

export const App: FC<Props> = (props) => {
  console.log(props);

  useLayoutEffect(() => {

    console.log(document.querySelector('body'))

    const resizeObserver = new ResizeObserver((entries) => {
      console.log(123)
    });

    resizeObserver.observe(document.querySelector('body'));

    return () => {
      resizeObserver.unobserve(document.querySelector('body'));
    };
  }, []);

  return (
    <BrowserRouter>
      <div>React17</div>

      <Space>
        <Link to="/react17/index">index</Link>
        <Link to="/react17/demo">demo</Link>
      </Space>

      <Switch>
        <Route path="/react17/index" component={IndexPage} />
        <Route path="/react17/demo" component={() => Demo(props)} />

        <Redirect from="*" to={`/react17/index`} />
      </Switch>
    </BrowserRouter>
  );
};
