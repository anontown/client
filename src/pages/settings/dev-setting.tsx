import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
} from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  ClientEditor,
  Snack,
} from "../../components";
import { appInject, UserStore } from "../../stores";
import {
  apiClient,
  list,
} from "../../utils";

interface DevSettingPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface DevSettingPageState {
  clients: Im.List<api.Client>;
  snackMsg: string | null;
}

export const DevSettingPage =
  withRouter(appInject(class extends React.Component<DevSettingPageProps, DevSettingPageState> {
    constructor(props: DevSettingPageProps) {
      super(props);
      this.state = {
        snackMsg: null,
        clients: Im.List(),
      };

      if (this.props.user.data !== null) {
        apiClient
          .findClientAll(this.props.user.data.token)
          .subscribe(clients => {
            this.setState({ clients: Im.List(clients) });
          }, () => {
            this.setState({ snackMsg: "クライアント情報取得に失敗しました。" });
          });
      }
    }

    render() {
      return this.props.user.data !== null
        ? <Paper>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.state.clients.map(c => <ClientEditor
            client={c}
            onUpdate={newClient => this.setState({ clients: list.update(this.state.clients, newClient) })} />)}
          <ClientEditor
            client={null}
            onAdd={c => this.setState({ clients: this.state.clients.push(c) })} />
        </Paper>
        : <div>ログインして下さい。</div>;
    }
  }));
