import { AtError } from "@anontown/api-client";
import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Errors, Snack } from "../../components";
import { apiClient } from "../../utils";
import { UserStore, appInject } from "../../stores";


interface AccountSettingPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AccountSettingPageState {
  newPass: string;
  oldPass: string;
  sn: string;
  errors: string[];
  snackMsg: string | null;
}

export const AccountSettingPage = appInject(withRouter(class extends React.Component<AccountSettingPageProps, AccountSettingPageState> {
  constructor(props: AccountSettingPageProps) {
    super(props);
    this.state = {
      snackMsg: null,
      newPass: "",
      oldPass: "",
      sn: "",
      errors: [],
    };

    if (this.props.user.data !== null) {
      apiClient
        .findUserSN({ id: this.props.user.data.token.user })
        .subscribe(sn => {
          this.setState({ sn });
        }, () => {
          this.setState({ snackMsg: "ユーザー情報取得に失敗しました。" });
        });
    }
  }

  onSubmit() {
    if (this.props.user.data === null) {
      return;
    }
    const user = this.props.user.data;
    apiClient.updateUser({ id: user.token.user, pass: this.state.oldPass }, {
      pass: this.state.newPass,
      sn: this.state.sn,
    })
      .mergeMap(() => apiClient.createTokenMaster({ id: user.token.user, pass: this.state.newPass }))
      .subscribe(token => {
        this.props.user.setData({ ...user, token });
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
  }

  render() {
    return this.props.user.data !== null
      ? <Paper>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        <form>
          <Errors errors={this.state.errors} />
          <TextField floatingLabelText="ID" value={this.state.sn} onChange={(_e, v) => this.setState({ sn: v })} />
          <TextField
            floatingLabelText="新しいパスワード"
            value={this.state.newPass}
            onChange={(_e, v) => this.setState({ newPass: v })} />
          <TextField
            floatingLabelText="現在のパスワード"
            value={this.state.oldPass}
            onChange={(_e, v) => this.setState({ oldPass: v })} />
          <RaisedButton onClick={() => this.onSubmit()} label="OK" />
        </form>
      </Paper>
      : <div>ログインして下さい。</div>;
  }
}));
