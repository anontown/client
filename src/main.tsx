import "core-js";
import { Dialog } from "material-ui";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { App } from "./components/app";
import * as dialogStyle from "./dialog.scss";
import { gqlClient } from "./utils";

(Dialog as any).defaultProps.className = dialogStyle.dialog;
(Dialog as any).defaultProps.contentClassName = dialogStyle.dialogContent;

// Installing ServiceWorker
OfflinePluginRuntime.install();

ReactDOM.render(
  <ApolloProvider client={gqlClient}>
    <ApolloHooksProvider client={gqlClient}>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.querySelector("#root"),
);
