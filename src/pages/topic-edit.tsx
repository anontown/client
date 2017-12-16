import * as api from "@anontown/api-types";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  Snack,
  TopicEditor
} from "../components";
import {
  apiClient,
  withModal,
} from "../utils";

interface TopicEditBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
}

interface TopicEditBaseState {
  topic: api.TopicNormal | null,
  snackMsg: null | string;
}

const TopicEditBase = withRouter(class extends React.Component<TopicEditBaseProps, TopicEditBaseState> {
  constructor(props: TopicEditBaseProps) {
    super(props);
    this.state = {
      topic: null,
      snackMsg: null,
    };

    apiClient.findTopicOne({
      id: this.props.match.params.id,
    })
      .subscribe(topic => {
        if (topic.type === "normal") {
          this.setState({ topic });
        } else {
          this.setState({ snackMsg: "通常トピックではありません。" });
        }
      }, () => {
        this.setState({ snackMsg: "トピック取得に失敗しました" });
      });
  }

  render() {
    return <div>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      {this.state.topic !== null && this.state.topic.type === "normal"
        ? <TopicEditor topic={this.state.topic} onUpdate={topic => {
          this.setState({ topic });
        }} />
        : null}
    </div>;
  }
});

export function TopicEditPage() {
  return <Page><TopicEditBase /></Page>;
}

export const TopicEditModal = withModal(() => <TopicEditBase zDepth={0} />, "トピック編集");
