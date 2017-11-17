import * as api from "@anontown/api-types";
import { RaisedButton } from "material-ui";
import * as qs from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page } from "../components";
import { Snack } from "../components";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";

interface AuthPageProps extends RouteComponentProps<{}> {
  user: UserData | null;
}

interface AuthPageState {
  client: api.Client | null;
  snackMsg: string | null;
}

export const AuthPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))(class extends React.Component<AuthPageProps, AuthPageState> {
  constructor(props: AuthPageProps) {
    super(props);
    this.state = {
      client: null,
      snackMsg: null,
    };

    const id: string | undefined = qs.parse(this.props.location.search).client;
    if (id !== undefined) {
      apiClient.findClientOne(this.props.user !== null ? this.props.user.token : null, {
        id,
      }).subscribe((client) => {
        this.setState({ client });
      }, () => {
        this.setState({ snackMsg: "クライアント取得に失敗しました。" });
      });
    }
  }

  public render() {
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

  public ok() {
    if (this.props.user !== null && this.state.client !== null) {
      const user = this.props.user;
      const client = this.state.client;
      apiClient.createTokenGeneral(user.token, { client: client.id })
        .mergeMap((token) => apiClient.createTokenReq(token))
        .subscribe((req) => {
          location.href = client.url + "?" + "id=" + req.token + "&key=" + encodeURI(req.key);
        }, () => {
          this.setState({ snackMsg: "認証に失敗しました。" });
        });
    }
  }
}));
