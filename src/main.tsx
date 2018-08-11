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
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { Config } from "./env";

(Dialog as any).defaultProps.className = dialogStyle.dialog;
(Dialog as any).defaultProps.contentClassName = dialogStyle.dialogContent;

// Installing ServiceWorker
OfflinePluginRuntime.install();

const client = new ApolloClient({
  uri: Config.api.origin,
  request: async opt => {
    if (stores.user.data !== null) {
      opt.setContext({
        headers: {
          "X-Token": `${stores.user.data.token.id},${stores.user.data.token.key}`
        }
      });
    }
  }
});

ReactDOM.render(
  <BrowserRouter>
    <Provider {...stores}>
      <ApolloProvider client={client}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </ApolloProvider>,
    </Provider>
  </BrowserRouter>,
  document.querySelector("#root"),
);
