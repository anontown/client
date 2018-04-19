import * as api from "@anontown/api-types";
import { Paper } from "material-ui";
import * as React from "react";
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
  apiClient,
  withModal,
} from "../utils";
import { Helmet } from "react-helmet";

interface TopicForkBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
}

interface TopicForkBaseState {
  topic: api.TopicNormal | null;
  snackMsg: null | string;
}

const TopicForkBase = withRouter(class extends React.Component<TopicForkBaseProps, TopicForkBaseState> {
  constructor(props: TopicForkBaseProps) {
    super(props);
    this.state = {
      topic: null,
      snackMsg: null,
    };

    (async () => {
      try {
        const topic = await apiClient.findTopicOne({
          id: this.props.match.params.id,
        });
        if (topic.type === "normal") {
          this.setState({ topic });
        } else {
          this.setState({ snackMsg: "通常トピックではありません。" });
        }
      } catch{
        this.setState({ snackMsg: "トピック取得に失敗しました" });
      }
    })();
  }

  render() {
    return <Paper zDepth={this.props.zDepth}>
      <Helmet>
        <title>派生トピック</title>
      </Helmet>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      {this.state.topic !== null && this.state.topic.type === "normal"
        ? <TopicFork topic={this.state.topic} onCreate={topic => {
          this.props.history.push(`/topic/${topic.id}`);
        }} />
        : null}
    </Paper>;
  }
});

export function TopicForkPage() {
  return <Page><TopicForkBase /></Page>;
}

export const TopicForkModal = withModal(() => <TopicForkBase zDepth={0} />, "派生トピック");
