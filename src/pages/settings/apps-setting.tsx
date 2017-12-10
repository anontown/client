import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  IconButton,
  Paper,
} from "material-ui";
import { ActionDelete } from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack } from "../../components";
import { UserData } from "../../models";
import { Store } from "../../reducers";
import { apiClient } from "../../utils";

interface AppsSettingPageProps extends RouteComponentProps<{}> {
  user: UserData | null;
}

interface AppsSettingPageState {
  clients: Im.List<api.Client>;
  snackMsg: string | null;
}

export const AppsSettingPage = withRouter(connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<AppsSettingPageProps, AppsSettingPageState> {
    constructor(props: AppsSettingPageProps) {
      super(props);
      this.state = {
        snackMsg: null,
        clients: Im.List(),
      };

      if (this.props.user !== null) {
        apiClient
          .findTokenClientAll(this.props.user.token)
          .subscribe(clients => {
            this.setState({ clients: Im.List(clients) });
          }, () => {
            this.setState({ snackMsg: "クライアント情報取得に失敗しました。" });
          });
      }
    }

    render() {
      return this.props.user !== null
        ? <div>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.state.clients.map(c => <Paper>
            {c.name}
            <IconButton type="button" onClick={() => this.del(c)} >
              <ActionDelete />
            </IconButton>
          </Paper>)}
        </div>
        : <div>ログインして下さい。</div>;
    }

    del(client: api.Client) {
      if (this.props.user === null) {
        return;
      }
      apiClient.deleteTokenClient(this.props.user.token, { client: client.id })
        .subscribe(() => {
          this.setState({ clients: this.state.clients.filter(c => c.id !== client.id) });
        }, () => {
          this.setState({ snackMsg: "削除に失敗しました" });
        });
    }
  }));
