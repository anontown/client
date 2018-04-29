import { RaisedButton } from "material-ui";
import { observer } from "mobx-react";
import * as qs from "query-string";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack } from "../components";
import { Page } from "../components";
import {
  myInject,
  UserStore,
  AuthStore
} from "../stores";

interface AuthPageProps extends RouteComponentProps<{}> {
  user: UserStore;
  auth: AuthStore;
}

interface AuthPageState {
}

export const AuthPage = withRouter(myInject(["user", "auth"],
  observer(class extends React.Component<AuthPageProps, AuthPageState> {
    constructor(props: AuthPageProps) {
      super(props);

      const id: string | string[] | undefined = qs.parse(this.props.location.search).client;
      if (typeof id === "string") {
        this.props.auth.load(id);
      }
    }

    render() {
      return <Page>
        <Helmet>
          <title>アプリ認証</title>
        </Helmet>
        <Snack
          msg={this.props.auth.msg}
          onHide={() => this.props.auth.clearMsg()} />
        {this.props.user.data !== null && this.props.auth.client !== null ? <div>
          認証しますか？
        <RaisedButton type="button" label="OK" onClick={() => this.props.auth.auth()} />
        </div>
          : this.props.user.data === null ? <div>ログインして下さい</div>
            : null}
      </Page>;
    }
  })));
