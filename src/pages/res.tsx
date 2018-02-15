import { Paper } from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import { ResSeted } from "../models";
import {
  apiClient,
  resSetedCreate,
  withModal,
} from "../utils";
import { UserStore, appInject } from "../stores";

interface ResBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  zDepth?: number;
}

interface ResBaseState {
  res: ResSeted | null;
  snackMsg: null | string;
}

const ResBase = withRouter(appInject(class extends React.Component<ResBaseProps, ResBaseState> {
  constructor(props: ResBaseProps) {
    super(props);
    this.state = {
      res: null,
      snackMsg: null,
    };

    const token = this.props.user.data !== null ? this.props.user.data.token : null;

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

export const ResModal = withModal(() => <ResBase zDepth={0} />, "レス詳細");
