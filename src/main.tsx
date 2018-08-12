import "core-js";
import { Dialog } from "material-ui";
import { Provider } from "mobx-react";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { App } from "./components/app";
import * as dialogStyle from "./dialog.scss";
import { stores } from "./stores";
import { ApolloProvider } from 'react-apollo';
import { gqlClient } from "./utils";

(Dialog as any).defaultProps.className = dialogStyle.dialog;
(Dialog as any).defaultProps.contentClassName = dialogStyle.dialogContent;

// Installing ServiceWorker
OfflinePluginRuntime.install();

ReactDOM.render(
  <BrowserRouter>
    <Provider {...stores}>
      <ApolloProvider client={gqlClient}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ApolloProvider>,
    </Provider>
  </BrowserRouter>,
  document.querySelector("#root"),
);
