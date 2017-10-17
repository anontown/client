import * as React from 'react';
import { ResSeted } from '../models';
import { UserData } from "../models";
import { apiClient, resSetedCreate } from "../utils";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import { RouteComponentProps } from "react-router-dom";
import { Snack, Res } from "../components";
import { Paper } from "material-ui";

type _ResPageProps = RouteComponentProps<{ id: string }> & { user: UserData | null };
export type ResPageProps = ObjectOmit<_ResPageProps, "user">;

export interface ResPageState {
  res: ResSeted | null
  snackMsg: null | string,
}

class _ResPage extends React.Component<_ResPageProps, ResPageState> {
  constructor(props: _ResPageProps) {
    super(props);
    this.state = {
      res: null,
      snackMsg: null
    };

    const token = this.props.user !== null ? this.props.user.token : null;

    apiClient.findResOne(token, {
      id: this.props.match.params.id
    })
      .mergeMap(res => resSetedCreate.resSet(token, [res]))
      .map(reses => reses[0])
      .subscribe(res => {
        this.setState({ res });
      }, () => {
        this.setState({ snackMsg: "レス取得に失敗しました" });
      })
  }

  render() {
    return (
      <Paper>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.state.res !== null
          ? <Res res={this.state.res} isPop={false} update={res => this.setState({ res })} />
          : null}
      </Paper>
    );
  }
}

export const ResPage = connect((state: Store) => ({ user: state.user }))(_ResPage);