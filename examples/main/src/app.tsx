import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
const { Content, Footer } = Layout;
import { History } from 'history';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { IndexPage } from './pages/index';
import { SubAppPage } from './pages/sub-app';
import { Setting } from './setting';

interface Props {
  history: History;
}

export const App: FC<Props> = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100%' }}>
        <Layout>
          <div className="header">
            <div className="header-title">Tenon</div>
            <div className="header-menus">
              <div>
                <Link to="/index">index</Link>
              </div>
              <div>
                <Link to="/react17">react17</Link>
              </div>
            </div>
          </div>
          <Layout
            style={{
              minWidth: '920px',
            }}
          >
            <Content className="content">
              <Switch>
                <Route path="/index" component={IndexPage} />
                <Route path="/react17" component={SubAppPage} />

                <Redirect from="*" to={`/index`} />

              </Switch>
            </Content>
          </Layout>
        </Layout>
        <Setting />
      </Layout>
    </BrowserRouter>
  );
};
