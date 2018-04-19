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
import { myInject, UserStore } from "../stores";
import { apiClient } from "../utils";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react";

interface AuthPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AuthPageState {
  client: api.Client | null;
  snackMsg: string | null;
}

export const AuthPage = withRouter(myInject(["user"], observer(class extends React.Component<AuthPageProps, AuthPageState> {
  constructor(props: AuthPageProps) {
    super(props);
    this.state = {
      client: null,
      snackMsg: null,
    };

    (async () => {
      try {
        const id: string | string[] | undefined = qs.parse(this.props.location.search).client;
        if (typeof id === "string") {
          const client = await apiClient
            .findClientOne(this.props.user.data !== null
              ? this.props.user.data.token
              : null, {
                id,
              });
          this.setState({ client });
        }
      } catch{
        this.setState({ snackMsg: "クライアント取得に失敗しました。" });
      }
    })();
  }

  render() {
    return (
      <Page>
        <Helmet>
          <title>アプリ認証</title>
        </Helmet>
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

  async ok() {
    if (this.props.user.data !== null && this.state.client !== null) {
      const user = this.props.user.data;
      const client = this.state.client;
      try {
        const token = await apiClient.createTokenGeneral(user.token, { client: client.id });
        const req = await apiClient.createTokenReq(token);
        location.href = client.url + "?" + "id=" + req.token + "&key=" + encodeURI(req.key);
      } catch{
        this.setState({ snackMsg: "認証に失敗しました。" });
      }
    }
  }
})));
