import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack } from "../../components";
import { appInject, UserStore } from "../../stores";
import { apiClient } from "../../utils";
import { Helmet } from "react-helmet";

interface AppsSettingPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AppsSettingPageState {
  clients: Im.List<api.Client>;
  snackMsg: string | null;
}

export const AppsSettingPage =
  withRouter(appInject(class extends React.Component<AppsSettingPageProps, AppsSettingPageState> {
    constructor(props: AppsSettingPageProps) {
      super(props);
      this.state = {
        snackMsg: null,
        clients: Im.List(),
      };

      if (this.props.user.data !== null) {
        apiClient
          .findTokenClientAll(this.props.user.data.token)
          .subscribe(clients => {
            this.setState({ clients: Im.List(clients) });
          }, () => {
            this.setState({ snackMsg: "クライアント情報取得に失敗しました。" });
          });
      }
    }

    render() {
      return this.props.user.data !== null
        ? <div>
          <Helmet>
            <title>連携アプリ管理</title>
          </Helmet>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.state.clients.map(c => <Paper>
            {c.name}
            <IconButton type="button" onClick={() => this.del(c)} >
              <FontIcon className="material-icons">delete</FontIcon>
            </IconButton>
          </Paper>)}
        </div>
        : <div>ログインして下さい。</div>;
    }

    del(client: api.Client) {
      if (this.props.user.data === null) {
        return;
      }
      apiClient.deleteTokenClient(this.props.user.data.token, { client: client.id })
        .subscribe(() => {
          this.setState({ clients: this.state.clients.filter(c => c.id !== client.id) });
        }, () => {
          this.setState({ snackMsg: "削除に失敗しました" });
        });
    }
  }));
