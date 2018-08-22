import {
  Paper,
  RaisedButton,
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
  Link,
} from "react-router-dom";
import {
  Errors,
  Page,
} from "../components";
import { Config } from "../env";
import { myInject, UserStore } from "../stores";
import { createUser, createTokenMaster } from "./in.gql";
import { createUser as createUserResult, createUserVariables } from "./_gql/createUser";
import { createTokenMaster as createTokenMasterResult, createTokenMasterVariables } from "./_gql/createTokenMaster";
import { Mutation } from "react-apollo";

interface SignupPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface SignupPageState {
  sn: string;
  pass: string;
  errors?: string[];
  recaptcha: string | null;
}

export const SignupPage = withRouter(myInject(["user"], observer(class extends React.Component<SignupPageProps, SignupPageState> {
  constructor(props: SignupPageProps) {
    super(props);
    this.state = {
      sn: "",
      pass: "",
      recaptcha: null,
    };
  }

  render() {
    return <Page>
      <Helmet>
        <title>登録</title>
      </Helmet>
      {this.props.user.data !== null
        ? <Redirect to="/" />
        : <Paper>
          <form>
            <Errors errors={this.state.errors} />
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
            <Recaptcha
              sitekey={Config.recaptcha.siteKey}
              ref="recaptcha"
              onChange={(v: string) => this.setState({ recaptcha: v })} />
            <div><a target="_blank" href="https://document.anontown.com/terms.html">利用規約(10行くらいしかないから読んでね)</a></div>
            <Mutation<createTokenMasterResult, createTokenMasterVariables>
              mutation={createTokenMaster}
              onCompleted={x => {
                this.props.user.userChange(x);
              }}
              onError={() => {
                this.setState({ errors: ["ログインに失敗しました。"] });
              }}>
              {createToken => (
                <Mutation<createUserResult, createUserVariables>
                  mutation={createUser}
                  onError={() => {
                    const rc = this.refs.recaptcha as any;
                    if (rc) {
                      rc.reset();
                    }
                    this.setState({ errors: ["アカウント作成に失敗しました"] });
                  }}
                  onCompleted={user => {
                    createToken({ variables: { id: user.createUser.id, pass: this.state.pass } });
                  }}
                  variables={{
                    sn: this.state.sn, pass: this.state.pass,
                    recaptcha: this.state.recaptcha!
                  }}>
                  {create =>
                    (<div><RaisedButton label="利用規約に同意して登録" onClick={() => create()} /></div>)}
                </Mutation>
              )}
            </Mutation>
            <Link to="/login">ログイン</Link>
          </form>
        </Paper>}
    </Page>;
  }
})));
