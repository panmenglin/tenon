import React, { FC } from 'react';
import { History } from 'history';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Demo } from './pages/demo'

interface Props {
  history: History;
}

export const App: FC<Props> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Demo} />
      </Switch>
    </BrowserRouter>
  );
};
