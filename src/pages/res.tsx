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
  withModal,
} from "../utils";

interface ResBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserData | null;
  zDepth?: number;
}

interface ResBaseState {
  res: ResSeted | null;
  snackMsg: null | string;
}

const ResBase = withRouter(connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<ResBaseProps, ResBaseState> {
    constructor(props: ResBaseProps) {
      super(props);
      this.state = {
        res: null,
        snackMsg: null,
      };

      const token = this.props.user !== null ? this.props.user.token : null;

      apiClient.findResOne(token, {
        id: this.props.match.params.id,
      })
        .mergeMap(res => resSetedCreate.resSet(token, [res]))
        .map(reses => reses[0])
        .subscribe(res => {
          this.setState({ res });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗しました" });
        });
    }

    render() {
      return <div>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.state.res !== null
          ? <Paper zDepth={this.props.zDepth}>
            <Res res={this.state.res} update={res => this.setState({ res })} />
          </Paper>
          : null}
      </div>;
    }
  }));

export function ResPage() {
  return <Page><ResBase /></Page>;
}

export const ResModal = withModal(() => <ResBase zDepth={0} />);
