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

        (async () => {
          if (this.props.user.data !== null) {
            try {
              const sn = await apiClient
                .findUserSN({ id: this.props.user.data.token.user });
              this.setState({ sn });
            } catch {
              this.setState({ snackMsg: "ユーザー情報取得に失敗しました。" });
            }
          }
        })();
      }

      async onSubmit() {
        if (this.props.user.data === null) {
          return;
        }
        const user = this.props.user.data;
        try {
          await apiClient.updateUser({ id: user.token.user, pass: this.state.oldPass }, {
            pass: this.state.newPass,
            sn: this.state.sn,
          });
          const token = await apiClient.createTokenMaster({ id: user.token.user, pass: this.state.newPass });
          this.props.user.updateToken(token);
          this.setState({ errors: [] });
        } catch (e) {
          if (e instanceof AtError) {
            this.setState({ errors: e.errors.map(e => e.message) });
          } else {
            this.setState({ errors: ["エラーが発生しました"] });
          }
        }
      }

      render() {
        return <UserSwitch userData={this.props.user.data} render={() => <Paper>
          <Helmet>
            <title>アカウント設定</title>
          </Helmet>
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
        </Paper>} />;
      }
    })));
