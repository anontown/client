import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import {
  myInject,
  UserStore,
  ResReplyStore
} from "../stores";
import {
  withModal,
} from "../utils";

interface ResReplyBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  resReply: ResReplyStore;
}

interface ResReplyBaseState {
}

const ResReplyBase = withRouter(myInject(["user", "resReply"],
  observer(class extends React.Component<ResReplyBaseProps, ResReplyBaseState> {
    constructor(props: ResReplyBaseProps) {
      super(props);

      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps: ResReplyBaseProps) {
      this.props.resReply.load(nextProps.match.params.id);
    }

    render() {
      return <div>
        <Helmet>
          <title>リプライ</title>
        </Helmet>
        <Snack
          msg={this.props.resReply.msg}
          onHide={() => this.props.resReply.clearMsg()} />
        {this.props.resReply.data !== null
          ? this.props.resReply.data.reses.map(res => <Paper key={res.id}>
            <Res
              res={res}
              update={updateRes => this.props.resReply.update(updateRes)} />
          </Paper>)
          : null}
      </div>;
    }
  })));

export function ResReplyPage() {
  return <Page><ResReplyBase /></Page>;
}

export const ResReplyModal = withModal(() => <ResReplyBase />, "リプライ");
