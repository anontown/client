import { Paper } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import { ResSeted } from "../models";
import { UserData } from "../models";
import { Store } from "../reducers";
import {
  apiClient,
  resSetedCreate,
} from "../utils";

interface ResPageProps extends RouteComponentProps<{ id: string }> {
  user: UserData | null;
}

interface ResPageState {
  res: ResSeted | null;
  snackMsg: null | string;
}

export const ResPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))(class extends React.Component<ResPageProps, ResPageState> {
  constructor(props: ResPageProps) {
    super(props);
    this.state = {
      res: null,
      snackMsg: null,
    };

    const token = this.props.user !== null ? this.props.user.token : null;

    apiClient.findResOne(token, {
      id: this.props.match.params.id,
    })
      .mergeMap((res) => resSetedCreate.resSet(token, [res]))
      .map((reses) => reses[0])
      .subscribe((res) => {
        this.setState({ res });
      }, () => {
        this.setState({ snackMsg: "レス取得に失敗しました" });
      });
  }

  public render() {
    return (
      <Page column={1}>
        <Paper>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.state.res !== null
            ? <Res res={this.state.res} isPop={false} update={(res) => this.setState({ res })} />
            : null}
        </Paper>
      </Page>
    );
  }
}));
