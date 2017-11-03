import * as React from 'react';
import { UserData } from "../models";
import { ObjectOmit } from "typelevel-ts";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { RouteComponentProps } from "react-router-dom";
import { apiClient } from "../utils";
import { Snack } from "../components";
import {
  Paper,
  IconButton
} from "material-ui";
import * as api from "@anontown/api-types";
import { ActionDelete } from 'material-ui/svg-icons';
import * as Im from "immutable";

type _AppsSettingPageProps = RouteComponentProps<{}> & {
  user: UserData | null
};

export type AppsSettingPageProps = ObjectOmit<_AppsSettingPageProps, 'user' | 'updateUser'>;

interface AppsSettingPageState {
  clients: Im.List<api.Client>,
  snackMsg: string | null
}

class _AppsSettingPage extends React.Component<_AppsSettingPageProps, AppsSettingPageState> {
  constructor(props: _AppsSettingPageProps) {
    super(props);
    this.state = {
      snackMsg: null,
      clients: Im.List()
    };

    if (this.props.user !== null) {
      apiClient
        .findTokenClientAll(this.props.user.token)
        .subscribe(clients => {
          this.setState({ clients: Im.List(clients) });
        }, () => {
          this.setState({ snackMsg: "クライアント情報取得に失敗しました。" })
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
        this.setState({ clients: this.state.clients.filter(c => c.id !== client.id) })
      }, () => {
        this.setState({ snackMsg: '削除に失敗しました' });
      });
  }
}

export const AppsSetting = connect((state: Store) => ({ user: state.user }))(_AppsSettingPage);