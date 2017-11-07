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
  Page
} from "../components";
import {
  Paper,
  RaisedButton
} from "material-ui";
import * as Im from 'immutable';

type _NotificationsPageProps = RouteComponentProps<{}> & { user: UserData | null };
export type NotificationsPageProps = ObjectOmit<_NotificationsPageProps, "user">;

export interface NotificationsPageState {
  reses: Im.List<ResSeted>
  snackMsg: null | string,
}

class _NotificationsPage extends React.Component<_NotificationsPageProps, NotificationsPageState> {
  private limit = 50

  constructor(props: _NotificationsPageProps) {
    super(props);
    this.state = {
      reses: Im.List(),
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
              {this.state.reses.map(r => <Res res={r} isPop={false} update={r => this.update(r)} />)}
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

  update(res: ResSeted) {
    this.setState({ reses: this.state.reses.set(this.state.reses.findIndex((r) => r.id === res.id), res) });
  }

  findNew() {
    if (this.props.user === null) {
      return;
    }
    const token = this.props.user.token;

    apiClient.findResNoticeNew(token,
      {
        limit: this.limit
      })
      .mergeMap(reses => resSetedCreate.resSet(token, reses))
      .map(reses => Im.List(reses))
      .subscribe(reses => {
        this.setState({ reses });
      }, () => {
        this.setState({ snackMsg: 'レス取得に失敗' });
      });
  }

  readNew() {
    if (this.props.user === null) {
      return;
    }

    const token = this.props.user.token;

    const first = this.state.reses.first();
    if (first === undefined) {
      this.findNew();
    } else {
      apiClient.findResNotice(token,
        {
          type: 'after',
          equal: false,
          date: first.date,
          limit: this.limit
        })
        .mergeMap(reses => resSetedCreate.resSet(token, reses))
        .map(reses => Im.List(reses))
        .map(reses => reses.concat(this.state.reses))
        .subscribe(reses => {
          this.setState({ reses });
        }, () => {
          this.setState({ snackMsg: 'レス取得に失敗' });
        });
    }
  }

  readOld() {
    if (this.props.user === null) {
      return;
    }

    const token = this.props.user.token;

    const last = this.state.reses.last();

    if (last === undefined) {
      this.findNew();
    } else {
      apiClient.findResNotice(token,
        {
          type: 'before',
          equal: false,
          date: last.date,
          limit: this.limit
        })
        .mergeMap(reses => resSetedCreate.resSet(token, reses))
        .map(reses => this.state.reses.concat(reses))
        .subscribe(reses => {
          this.setState({ reses });
        }, () => {
          this.setState({ snackMsg: 'レス取得に失敗' });
        });
    }
  }
}

export const NotificationsPage = connect((state: Store) => ({ user: state.user }))(_NotificationsPage);