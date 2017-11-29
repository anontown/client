import "core-js";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import { App } from "./components/app";
import { reducer } from "./reducers";
import { epics } from "./epics";
import { createEpicMiddleware } from 'redux-observable';

const store = createStore(reducer, applyMiddleware(logger, createEpicMiddleware(epics)));

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Provider>
  </BrowserRouter>,
  document.querySelector("#root"),
);
