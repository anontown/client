import {
  MenuItem,
  Paper,
  RaisedButton,
  SelectField,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import Recaptcha from "react-google-recaptcha";
import { Helmet } from "react-helmet";
import {
  Redirect,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Errors,
  Page,
} from "../components";
import { Config } from "../env";
import { myInject, UserStore } from "../stores";
import { findUserID, createUser, createTokenMaster } from "./in.gql";
import { findUserID as findUserIDResult, findUserIDVariables } from "./_gql/findUserID";
import { createUser as createUserResult, createUserVariables } from "./_gql/createUser";
import { createTokenMaster as createTokenMasterResult, createTokenMasterVariables } from "./_gql/createTokenMaster";
import { gqlClient } from "../utils";

interface InPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface InPageState {
  sn: string;
  pass: string;
  isLogin: boolean;
  errors?: string[];
  recaptcha: string | null;
}

export const InPage = withRouter(myInject(["user"], observer(class extends React.Component<InPageProps, InPageState> {
  constructor(props: InPageProps) {
    super(props);
    this.state = {
      sn: "",
      pass: "",
      isLogin: true,
      recaptcha: null,
    };
  }

  render() {
    return <Page>
      <Helmet>
        <title>ログイン/登録</title>
      </Helmet>
      {this.props.user.data !== null
        ? <Redirect to="/" />
        : <Paper>
          <form>
            <Errors errors={this.state.errors} />
            <div>
              <SelectField floatingLabelText="ログイン/登録"
                value={this.state.isLogin}
                onChange={(_e, _i, v) => this.setState({ isLogin: v })}>
                <MenuItem value={true} primaryText="ログイン" />
                <MenuItem value={false} primaryText="登録" />
              </SelectField>
            </div>
            <div>
              <TextField
                floatingLabelText="ID"
                value={this.state.sn}
                onChange={(_e, v) => this.setState({ sn: v })} />
            </div>
            <div>
              <TextField
                floatingLabelText="パスワード"
                value={this.state.pass}
                onChange={(_e, v) => this.setState({ pass: v })}
                type="password" />
            </div>
            {!this.state.isLogin
              ? <Recaptcha
                sitekey={Config.recaptcha.siteKey}
                ref="recaptcha"
                onChange={(v: string) => this.setState({ recaptcha: v })} />
              : null}
            {!this.state.isLogin
              ? <div><a target="_blank" href="https://document.anontown.com/terms.html">利用規約(10行くらいしかないから読んでね)</a></div>
              : null}
            <div><RaisedButton label={this.state.isLogin ? "ログイン" : "利用規約に同意して登録"} onClick={() => this.ok()} /></div>
          </form>
        </Paper>}
    </Page>;
  }

  async ok() {
    gqlClient.mutate<createUserResult, createUserVariables>({
      mutation: createUser,
      variables: {
        sn: this.state.sn, pass: this.state.pass,
        recaptcha: this.state.recaptcha!
      }
    }).then(x => {
      if (x.data) {
        x.context!.createUser
      }
    });
    try {
      const id = this.state.isLogin
        ? await gqlClient.query<findUserIDResult, findUserIDVariables>({ query: findUserID, variables: { sn: this.state.sn } }).then(x => x.data.userID)
        : await apiClient.createUser(this.state.recaptcha!
          {
            sn: this.state.sn,
            pass: this.state.pass,
          })
          .then(user => user.id);
      const token = await apiClient.createTokenMaster({ id, pass: this.state.pass });
      this.props.user.userChange(token);
    } catch (e) {
      const rc = this.refs.recaptcha as any;
      if (rc) {
        rc.reset();
      }

      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["ログインに失敗しました。"] });
      }
    }
  }
})));
