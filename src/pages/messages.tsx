import * as React from 'react';
import { ResSeted } from '../models';
import { UserData } from "../models";
import { apiClient, resSetedCreate } from "../utils";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import { RouteComponentProps } from "react-router-dom";
import {
  Snack,
  Res,
  Page,
  Md
} from "../components";
import {
  Paper,
  RaisedButton
} from "material-ui";
import * as Im from 'immutable';
import * as api from "@anontown/api-types";
import { dateFormat, apiClient } from "../utils";

type _MessagesPageProps = RouteComponentProps<{}> & { user: UserData | null };
export type MessagesPageProps = ObjectOmit<_MessagesPageProps, "user">;

export interface MessagesPageState {
  msgs: Im.List<api.Msg>
  snackMsg: null | string,
}

class _MessagesPage extends React.Component<_MessagesPageProps, MessagesPageState> {
  private limit = 50

  constructor(props: _MessagesPageProps) {
    super(props);
    this.state = {
      msgs: Im.List(),
      snackMsg: null
    };

    this.findNew();
  }

  render() {
    return (
      <Page column={1}>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.user !== null
          ? <div>
            <div>
              <RaisedButton label="最新" onClick={() => this.readNew()} />
            </div>
            <div>
              {this.state.msgs.map(m =>
                <Paper>
                  <div>{dateFormat.format(m.date)}</div>
                  <Md body={m.text} />
                </Paper>)}
            </div>
            <div>
              <RaisedButton label="前" onClick={() => this.readOld()} />
            </div>
          </div>
          : <Paper>
            ログインしてください。
    </Paper>
        }
      </Page>
    );
  }

  findNew() {
    if (this.props.user === null) {
      return;
    }

    apiClient.findMsgNew(this.props.user.token,
      {
        limit: this.limit
      })
      .map(msgs => Im.List(msgs))
      .subscribe(msgs => {
        this.setState({ msgs });
      }, () => {
        this.setState({ snackMsg: 'メッセージ取得に失敗' });
      });
  }

  readNew() {
    if (this.props.user === null) {
      return;
    }

    const first = this.state.msgs.first();
    if (first === undefined) {
      this.findNew();
    } else {
      apiClient.findMsg(this.props.user.token,
        {
          type: 'after',
          equal: false,
          date: first.date,
          limit: this.limit
        })
        .map(msgs => Im.List(msgs))
        .map(msgs => msgs.concat(this.state.msgs))
        .subscribe(msgs => {
          this.setState({ msgs });
        }, () => {
          this.setState({ snackMsg: 'メッセージ取得に失敗' });
        });
    }
  }

  readOld() {
    if (this.props.user === null) {
      return;
    }
    const last = this.state.msgs.last();

    if (last === undefined) {
      this.findNew();
    } else {
      apiClient.findMsg(this.props.user.token,
        {
          type: 'before',
          equal: false,
          date: last.date,
          limit: this.limit
        })
        .map(msgs => this.state.msgs.concat(msgs))
        .subscribe(msgs => {
          this.setState({ msgs });
        }, () => {
          this.setState({ snackMsg: 'メッセージ取得に失敗' });
        });
    }
  }
}

export const MessagesPage = connect((state: Store) => ({ user: state.user }))(_MessagesPage);