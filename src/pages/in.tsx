import { AtError } from "@anontown/api-client";
import {
  MenuItem,
  Paper,
  RaisedButton,
  SelectField,
  TextField,
} from "material-ui";
import * as React from "react";
import Recaptcha from "react-google-recaptcha";
import { UserStore, appInject } from "../stores";
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
import {
  apiClient,
  createUserData,
} from "../utils";

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

export const InPage = withRouter(appInject(class extends React.Component<InPageProps, InPageState> {
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
      {this.props.user.data !== null
        ? <Redirect to="/" />
        : <Paper>
          <form>
            <Errors errors={this.state.errors} />
            <TextField
              floatingLabelText="ID"
              value={this.state.sn}
              onChange={(_e, v) => this.setState({ sn: v })} />
            <TextField
              floatingLabelText="パスワード"
              value={this.state.pass}
              onChange={(_e, v) => this.setState({ pass: v })}
              type="password" />
            <SelectField floatingLabelText="ログイン/登録"
              value={this.state.isLogin}
              onChange={(_e, _i, v) => this.setState({ isLogin: v })}>
              <MenuItem value={true} primaryText="ログイン" />
              <MenuItem value={false} primaryText="登録" />
            </SelectField>
            {!this.state.isLogin
              ? <Recaptcha
                sitekey={Config.recaptcha.siteKey}
                ref="recaptcha"
                onChange={(v: string) => this.setState({ recaptcha: v })} />
              : null}
            {!this.state.isLogin
              ? <a target="_blank" href="https://document.anontown.com/terms.html">利用規約(10行くらいしかないから読んでね)</a>
              : null}
            <RaisedButton label={this.state.isLogin ? "ログイン" : "利用規約に同意して登録"} onClick={() => this.ok()} />
          </form>
        </Paper>}
    </Page>;
  }

  ok() {
    (this.state.isLogin ? apiClient.findUserID({ sn: this.state.sn })
      : apiClient.createUser(this.state.recaptcha as string, // TODO:キャストじゃなくて綺麗に書きたいけど面倒だからとりあえず
        {
          sn: this.state.sn,
          pass: this.state.pass,
        })
        .map(user => user.id))
      .mergeMap(id => apiClient.createTokenMaster({ id, pass: this.state.pass }))
      .mergeMap(token => createUserData(token))
      .subscribe(userData => {
        this.props.user.setData(userData);
      }, errors => {
        const rc = this.refs.recaptcha as any;
        if (rc) {
          rc.reset();
        }

        if (errors instanceof AtError) {
          this.setState({ errors: errors.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["ログインに失敗しました。"] });
        }
      });
  }
}));
