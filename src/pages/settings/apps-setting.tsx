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
import { myInject, UserStore } from "../../stores";
import { apiClient } from "../../utils";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react";

interface AppsSettingPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AppsSettingPageState {
  clients: Im.List<api.Client>;
  snackMsg: string | null;
}

export const AppsSettingPage =
  withRouter(myInject(["user"], observer(class extends React.Component<AppsSettingPageProps, AppsSettingPageState> {
    constructor(props: AppsSettingPageProps) {
      super(props);
      this.state = {
        snackMsg: null,
        clients: Im.List(),
      };

      (async () => {
        try {
          if (this.props.user.data !== null) {
            const token = this.props.user.data.token;
            const tokens = await apiClient.findTokenAll(token);
            const clients = await apiClient.findClientIn(token, {
              ids: Array.from(new Set(tokens
                .filter<api.TokenGeneral>((x): x is api.TokenGeneral => x.type === "general")
                .map(x => x.client)))
            });
            this.setState({ clients: Im.List(clients) });
          }
        } catch{
          this.setState({ snackMsg: "クライアント情報取得に失敗しました。" });
        }
      })();
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

    async del(client: api.Client) {
      if (this.props.user.data === null) {
        return;
      }
      try {
        await apiClient.deleteTokenClient(this.props.user.data.token, { client: client.id });
        this.setState({ clients: this.state.clients.filter(c => c.id !== client.id) });
      } catch{
        this.setState({ snackMsg: "削除に失敗しました" });
      }
    }
  })));
