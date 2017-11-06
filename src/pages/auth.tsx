import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Page } from "../components";
import { Route, Switch, Link } from 'react-router-dom'
import { AccountSettingPage } from './account-setting';
import { DevSettingPage } from './dev-setting';
import { AppsSettingPage } from './apps-setting';
import { List, ListItem } from "material-ui";
import * as api from "@anontown/api-types";
import { apiClient } from "../utils";
import * as qs from "query-string";
import { UserData } from "../models";
import { ObjectOmit } from "typelevel-ts";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { Snack } from "../components";
import { RaisedButton } from 'material-ui';

type _AuthPageProps = RouteComponentProps<{}> & {
  user: UserData | null
};

export type AuthPageProps = ObjectOmit<_AuthPageProps, 'user'>;

interface AuthPageState {
  client: api.Client | null,
  snackMsg: string | null
}

class _AuthPage extends React.Component<_AuthPageProps, AuthPageState> {
  constructor(props: _AuthPageProps) {
    super(props);
    this.state = {
      client: null,
      snackMsg: null,
    };

    const id: string | undefined = qs.parse(this.props.location.search)["client"];
    if (id !== undefined) {
      apiClient.findClientOne(this.props.user !== null ? this.props.user.token : null, {
        id
      }).subscribe(client => {
        this.setState({ client });
      }, () => {
        this.setState({ snackMsg: 'クライアント取得に失敗しました。' });
      })
    }
  }

  render() {
    return (
      <Page column={1}>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.user !== null && this.state.client !== null ? <div>
          認証しますか？
        <RaisedButton type="button" label="OK" onClick={() => this.ok()} />
        </div>
          : this.props.user === null ? <div>ログインして下さい</div>
            : null}
      </Page>
    );
  }

  ok() {
    if (this.props.user !== null && this.state.client !== null) {
      const user = this.props.user;
      const client = this.state.client;
      apiClient.createTokenGeneral(user.token, { client: client.id })
        .mergeMap(token => apiClient.createTokenReq(token))
        .subscribe(req => {
          location.href = client.url + '?' + 'id=' + req.token + '&key=' + encodeURI(req.key)
        }, () => {
          this.setState({ snackMsg: '認証に失敗しました。' });
        });
    }
  }
}


export const AuthPage = connect((state: Store) => ({ user: state.user }))(_AuthPage);