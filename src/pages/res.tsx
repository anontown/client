import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import { myInject, UserStore, ResStore } from "../stores";
import {
  withModal,
} from "../utils";

interface ResBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  zDepth?: number;
  res: ResStore
}

interface ResBaseState {
}

const ResBase = withRouter(myInject(["user", "res"], observer(class extends React.Component<ResBaseProps, ResBaseState> {
  constructor(props: ResBaseProps) {
    super(props);
    this.state = {
      res: null,
      snackMsg: null,
    };

    this.props.res.load(this.props.match.params.id);
  }

  render() {
    return <div>
      <Helmet>
        <title>レス</title>
      </Helmet>
      <Snack
        msg={this.props.res.msg}
        onHide={() => this.props.res.clearMsg()} />
      {this.props.res.res !== null
        ? <Paper zDepth={this.props.zDepth}>
          <Res res={this.props.res.res} update={res => this.props.res.update(res)} />
        </Paper>
        : null}
    </div>;
  }
})));

export function ResPage() {
  return <Page><ResBase /></Page>;
}

export const ResModal = withModal(() => <ResBase zDepth={0} />, "レス詳細");
