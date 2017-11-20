import "core-js";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import { App } from "./components/app";
import { reducer } from "./reducers";

const store = createStore(reducer, applyMiddleware(logger));

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </MuiThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.querySelector("#root"),
);
