import * as React from 'react';
import { UserData } from "../../models";
import { connect } from "react-redux";
import { Store } from "../../reducers";
import { updateUserData } from "../../actions";
import {
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import { apiClient } from "../../utils";
import { Snack, Errors } from "../../components";
import {
  Paper,
  TextField,
  RaisedButton
} from "material-ui";
import { AtError } from "@anontown/api-client";

interface AccountSettingPageProps extends RouteComponentProps<{}> {
  user: UserData | null
  updateUser: (user: UserData | null) => void;
}

interface AccountSettingPageState {
  newPass: string,
  oldPass: string,
  sn: string,
  errors: string[],
  snackMsg: string | null
}

export const AccountSettingPage = withRouter<{}>(connect(
  (state: Store) => ({ user: state.user }),
  dispatch => ({
    updateUser: (user: UserData | null) => { dispatch(updateUserData(user)) }
  })
)(class extends React.Component<AccountSettingPageProps, AccountSettingPageState> {
  constructor(props: AccountSettingPageProps) {
    super(props);
    this.state = {
      snackMsg: null,
      newPass: '',
      oldPass: '',
      sn: '',
      errors: []
    };

    if (this.props.user !== null) {
      apiClient
        .findUserSN({ id: this.props.user.token.user })
        .subscribe(sn => {
          this.setState({ sn });
        }, () => {
          this.setState({ snackMsg: "ユーザー情報取得に失敗しました。" })
        });
    }
  }

  onSubmit() {
    if (this.props.user === null) {
      return;
    }
    const user = this.props.user;
    apiClient.updateUser({ id: user.token.user, pass: this.state.oldPass }, {
      pass: this.state.newPass,
      sn: this.state.sn
    })
      .mergeMap(() => apiClient.createTokenMaster({ id: user.token.user, pass: this.state.newPass }))
      .subscribe(token => {
        this.props.updateUser({ ...user, token });
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ['エラーが発生しました'] });
        }
      });
  }

  render() {
    return this.props.user !== null
      ? <Paper>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        <form onSubmit={() => this.onSubmit()}>
          <Errors errors={this.state.errors} />
          <TextField floatingLabelText="ID" value={this.state.sn} onChange={(_e, v) => this.setState({ sn: v })} />
          <TextField floatingLabelText="新しいパスワード" value={this.state.newPass} onChange={(_e, v) => this.setState({ newPass: v })} />
          <TextField floatingLabelText="現在のパスワード" value={this.state.oldPass} onChange={(_e, v) => this.setState({ oldPass: v })} />
          <RaisedButton type="submit" label="OK" />
        </form>
      </Paper>
      : <div>ログインして下さい。</div>;
  }
}));