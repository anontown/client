import * as React from 'react';
import { UserData } from "../models";
import { ObjectOmit } from "typelevel-ts";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { apiClient } from "../utils";
import {
  Errors
} from "../components";
import {
  Paper,
  TextField,
  RaisedButton,
  SelectField,
  MenuItem
} from "material-ui";
import * as Recaptcha from "react-google-recaptcha";
import { Config } from "../env";
import { AtError } from "@anontown/api-client";

type _InPageProps = RouteComponentProps<{}> & {
  user: UserData | null,
  updateUser: (user: UserData | null) => void
};

export type InPageProps = ObjectOmit<_InPageProps, 'user' | 'updateUser'>;

interface InPageState {
  sn: string,
  pass: string,
  isLogin: boolean,
  errors?: string[],
  recaptcha: string | null
}

class _InPage extends React.Component<_InPageProps, InPageState> {
  constructor(props: _InPageProps) {
    super(props);
    this.state = {
      sn: '',
      pass: '',
      isLogin: true,
      recaptcha: null
    };
  }

  render() {
    return this.props.user !== null
      ? <Redirect to="/" />
      : <Paper>
        <form onSubmit={() => this.ok()}>
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
              siteKey={Config.recaptcha.siteKey}
              ref="recaptcha"
              onChange={(v: string) => this.setState({ recaptcha: v })} />
            : null}

          <RaisedButton type="submit" label="OK" />
        </form>
      </Paper>;
  }

  ok() {
    (this.state.isLogin ? apiClient.findUserID({ sn: this.state.sn })
      : apiClient.createUser(this.state.recaptcha as string,//キャストじゃなくて綺麗に書きたいけど面倒だからとりあえず
        {
          sn: this.state.sn,
          pass: this.state.pass
        })
        .map(user => user.id))
      .mergeMap(id => apiClient.createTokenMaster({ id, pass: this.state.pass }))
      .subscribe(token => {
        this.props.updateUser(login(token));
      }, errors => {
        let rc = this.refs['recaptcha'] as any;
        if (rc) {
          rc.reset();
        }

        if (errors instanceof AtError) {
          this.setState({ errors: errors.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ['ログインに失敗しました。'] });
        }
      });
  }
}

export const InPage = connect((state: Store) => ({ user: state.user }))(_InPage);