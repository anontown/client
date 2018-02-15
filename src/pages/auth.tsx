import * as api from "@anontown/api-types";
import { RaisedButton } from "material-ui";
import * as qs from "query-string";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page } from "../components";
import { Snack } from "../components";
import { UserStore, appInject } from "../stores";
import { apiClient } from "../utils";

interface AuthPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AuthPageState {
  client: api.Client | null;
  snackMsg: string | null;
}

export const AuthPage = withRouter(appInject(class extends React.Component<AuthPageProps, AuthPageState> {
  constructor(props: AuthPageProps) {
    super(props);
    this.state = {
      client: null,
      snackMsg: null,
    };

    const id: string | string[] | undefined = qs.parse(this.props.location.search).client;
    if (typeof id === "string") {
      apiClient.findClientOne(this.props.user.data !== null ? this.props.user.data.token : null, {
        id,
      }).subscribe(client => {
        this.setState({ client });
      }, () => {
        this.setState({ snackMsg: "クライアント取得に失敗しました。" });
      });
    }
  }

  render() {
    return (
      <Page>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.user.data !== null && this.state.client !== null ? <div>
          認証しますか？
        <RaisedButton type="button" label="OK" onClick={() => this.ok()} />
        </div>
          : this.props.user.data === null ? <div>ログインして下さい</div>
            : null}
      </Page>
    );
  }

  ok() {
    if (this.props.user.data !== null && this.state.client !== null) {
      const user = this.props.user.data;
      const client = this.state.client;
      apiClient.createTokenGeneral(user.token, { client: client.id })
        .mergeMap(token => apiClient.createTokenReq(token))
        .subscribe(req => {
          location.href = client.url + "?" + "id=" + req.token + "&key=" + encodeURI(req.key);
        }, () => {
          this.setState({ snackMsg: "認証に失敗しました。" });
        });
    }
  }
}));
