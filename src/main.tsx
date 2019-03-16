import "core-js";
import { Dialog } from "material-ui";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { App } from "./components/app";
import * as dialogStyle from "./dialog.scss";
import { ApolloProvider } from 'react-apollo';
import { gqlClient } from "./utils";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";

(Dialog as any).defaultProps.className = dialogStyle.dialog;
(Dialog as any).defaultProps.contentClassName = dialogStyle.dialogContent;

// Installing ServiceWorker
OfflinePluginRuntime.install();

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={gqlClient}>
      <ApolloHooksProvider client={gqlClient}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ApolloHooksProvider>
    </ApolloProvider>,
  </BrowserRouter>,
  document.querySelector("#root"),
);