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
} from "react-router-dom";
import {
  Errors,
  Page,
} from "../components";
import { myInject, UserStore } from "../stores";
import { findUserID, createTokenMaster } from "./in.gql";
import { findUserID as findUserIDResult, findUserIDVariables } from "./_gql/findUserID";
import { createTokenMaster as createTokenMasterResult, createTokenMasterVariables } from "./_gql/createTokenMaster";
import { Mutation, ApolloConsumer } from "react-apollo";

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
            <ApolloConsumer>
              {client => (
                <Mutation<createTokenMasterResult, createTokenMasterVariables>
                  mutation={createTokenMaster}
                  onCompleted={x => {
                    this.props.user.userChange(x);
                  }}
                  onError={() => {
                    this.setState({ errors: ["ログインに失敗しました。"] });
                  }}>
                  {submit => {
                    return (
                      <div><RaisedButton label="ログイン" onClick={async () => {
                        const id = await client.query<findUserIDResult, findUserIDVariables>({ query: findUserID, variables: { sn: this.state.sn } }).then(x => x.data.userID);
                        await submit({ variables: { id, pass: this.state.pass } });
                      }} /></div>
                    );
                  }}
                </Mutation>
              )}
            </ApolloConsumer>
          </form>
        </Paper>}
    </Page>;
  }
})));
