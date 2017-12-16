import * as api from "@anontown/api-types";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  Snack,
  TopicFork
} from "../components";
import { UserData } from "../models";
import { Store } from "../reducers";
import {
  apiClient,
  withModal,
} from "../utils";

interface TopicForkBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserData | null;
  zDepth?: number;
}

interface TopicForkBaseState {
  topic: api.TopicNormal | null,
  snackMsg: null | string;
}

const TopicForkBase = withRouter(connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<TopicForkBaseProps, TopicForkBaseState> {
    constructor(props: TopicForkBaseProps) {
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
          ? <TopicFork topic={this.state.topic} onCreate={topic => {
            this.props.history.push(`/topic/${topic.id}`);
          }} />
          : null}
      </div>;
    }
  }));

export function TopicForkPage() {
  return <Page><TopicForkBase /></Page>;
}

export const TopicForkModal = withModal(() => <TopicForkBase zDepth={0} />, "派生トピック");
