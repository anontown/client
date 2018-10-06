import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Errors, Snack, UserSwitch } from "../../components";
import { myInject, UserStore } from "../../stores";
import { Query, Mutation } from "react-apollo";
import { findUser, updateUser } from "../../gql/user.gql";
import { findUser as findUserResult } from "../../gql/_gql/findUser";
import { updateUser as updateUserResult, updateUserVariables } from "../../gql/_gql/updateUser";
import { createTokenMaster as createTokenMasterResult, createTokenMasterVariables } from "../../gql/_gql/createTokenMaster";
import { createTokenMaster } from "../../gql/token.gql";

interface AccountSettingPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AccountSettingPageState {
  newPass: string;
  oldPass: string;
  sn: string;
}

export const AccountSettingPage =
  myInject(["user"],
    observer(withRouter(class extends React.Component<AccountSettingPageProps, AccountSettingPageState> {
      constructor(props: AccountSettingPageProps) {
        super(props);
        this.state = {
          newPass: "",
          oldPass: "",
          sn: "",
        };
      }

      render() {
        return <UserSwitch userData={this.props.user.data} render={() => <Paper>
          <Helmet>
            <title>アカウント設定</title>
          </Helmet>
          <UserSwitch userData={this.props.user.data} render={() =>
            <Query<findUserResult>
              query={findUser}
              onCompleted={user => {
                if ("user" in user) {
                  this.setState({ sn: user.user.sn });
                }
              }}>{
                ({ error, data }) => {
                  if (error) {
                    return <Snack msg="ユーザー情報取得に失敗しました" />;
                  }
                  if (data === undefined) {
                    return "loading";
                  }
                  return <Mutation<createTokenMasterResult, createTokenMasterVariables> mutation={createTokenMaster} onCompleted={x => {
                    this.props.user.updateToken(x.createTokenMaster);
                  }}>{submit => {
                    return <Mutation<updateUserResult, updateUserVariables> mutation={updateUser} onCompleted={() => {
                      submit({ variables: { auth: { id: data.user.id, pass: this.state.newPass } } });
                    }} variables={{ auth: { id: data.user.id, pass: this.state.oldPass }, sn: this.state.sn, pass: this.state.newPass }}>{submit => {
                      return <form>
                        <TextField floatingLabelText="ID" value={this.state.sn} onChange={(_e, v) => this.setState({ sn: v })} />
                        <TextField
                          floatingLabelText="新しいパスワード"
                          value={this.state.newPass}
                          onChange={(_e, v) => this.setState({ newPass: v })} />
                        <TextField
                          floatingLabelText="現在のパスワード"
                          value={this.state.oldPass}
                          onChange={(_e, v) => this.setState({ oldPass: v })} />
                        <RaisedButton onClick={() => submit()} label="OK" />
                      </form>;
                    }}</Mutation>;
                  }}</Mutation>;
                }
              }</Query>
          } />
        </Paper >} />;
      }
    })));

  //TODO:エラー処理
