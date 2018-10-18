import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
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
import { myInject, UserStore } from "../stores";
import { createTokenMaster } from "../gql/token.gql";
import { createTokenMaster as createTokenMasterResult, createTokenMasterVariables } from "../gql/_gql/createTokenMaster";
import { Mutation } from "react-apollo";

interface LoginPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface LoginPageState {
  sn: string;
  pass: string;
  errors?: string[];
}

export const LoginPage = withRouter(myInject(["user"], observer(class extends React.Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      sn: "",
      pass: ""
    };
  }

  render() {
    return <Page>
      <Helmet>
        <title>ログイン</title>
      </Helmet>
      {this.props.user.data !== null
        ? <Redirect to="/" />
        : <Paper>
          <Errors errors={this.state.errors} />
          <form>
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
            <Mutation<createTokenMasterResult, createTokenMasterVariables>
              mutation={createTokenMaster}
              onCompleted={x => {
                this.props.user.userChange(x);
              }}
              onError={() => {
                this.setState({ errors: ["ログインに失敗しました。"] });
              }}
              variables={{
                auth: {
                  sn: this.state.sn, pass: this.state.pass
                }
              }}>
              {submit => (
                <div><RaisedButton label="ログイン" onClick={() => {
                  submit();
                }} /></div>
              )}
            </Mutation>
            <Link to="/signup">登録</Link>
          </form>
        </Paper>}
    </Page>;
  }
})));
