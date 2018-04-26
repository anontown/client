import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  Snack,
  TopicFork,
} from "../components";
import {
  myInject,
  TopicForkStore,
} from "../stores";
import {
  withModal,
} from "../utils";

interface TopicForkBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
  topicFork: TopicForkStore;
}

interface TopicForkBaseState {
}

const TopicForkBase = withRouter(myInject(["topicFork"],
  observer(class extends React.Component<TopicForkBaseProps, TopicForkBaseState> {
    constructor(props: TopicForkBaseProps) {
      super(props);

      this.props.topicFork.load(this.props.match.params.id);
    }

    render() {
      return <Paper zDepth={this.props.zDepth}>
        <Helmet>
          <title>派生トピック</title>
        </Helmet>
        <Snack
          msg={this.props.topicFork.msg}
          onHide={() => this.props.topicFork.clearMsg()} />
        {this.props.topicFork.topic !== null && this.props.topicFork.topic.type === "normal"
          ? <TopicFork topic={this.props.topicFork.topic} onCreate={topic => {
            this.props.history.push(`/topic/${topic.id}`);
          }} />
          : null}
      </Paper>;
    }
  })));

export function TopicForkPage() {
  return <Page><TopicForkBase /></Page>;
}

export const TopicForkModal = withModal(() => <TopicForkBase zDepth={0} />, "派生トピック");
