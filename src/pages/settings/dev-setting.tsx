import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Client, ClientEditor, Snack } from "../../components";
import { UserData } from "../../models";
import { Store } from "../../reducers";
import {
  apiClient,
  list,
} from "../../utils";

interface DevSettingPageProps extends RouteComponentProps<{}> {
  user: UserData | null;
}

interface DevSettingPageState {
  clients: Im.List<api.Client>;
  snackMsg: string | null;
}

export const DevSettingPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))(class extends React.Component<DevSettingPageProps, DevSettingPageState> {
  constructor(props: DevSettingPageProps) {
    super(props);
    this.state = {
      snackMsg: null,
      clients: Im.List(),
    };

    if (this.props.user !== null) {
      apiClient
        .findClientAll(this.props.user.token)
        .subscribe((clients) => {
          this.setState({ clients: Im.List(clients) });
        }, () => {
          this.setState({ snackMsg: "クライアント情報取得に失敗しました。" });
        });
    }
  }

  public render() {
    return this.props.user !== null
      ? <Paper>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.state.clients.map((c) => <Client
          client={c}
          onUpdate={(c) => this.setState({ clients: list.update(this.state.clients, c) })} />)}
        <ClientEditor
          client={null}
          onAdd={(c) => this.setState({ clients: this.state.clients.push(c) })} />
      </Paper>
      : <div>ログインして下さい。</div>;
  }
}));
