import * as api from "@anontown/api-types";
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
  TopicEditor,
  UserSwitch,
} from "../components";
import { myInject, UserStore } from "../stores";
import {
  apiClient,
  withModal,
} from "../utils";

interface TopicEditBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
  user: UserStore;
}

interface TopicEditBaseState {
  topic: api.TopicNormal | null;
  snackMsg: null | string;
}

const TopicEditBase = withRouter(myInject(["user"],
  observer(class extends React.Component<TopicEditBaseProps, TopicEditBaseState> {
    constructor(props: TopicEditBaseProps) {
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
        } catch {
          this.setState({ snackMsg: "トピック取得に失敗しました" });
        }
      })();
    }

    render() {
      return <UserSwitch userData={this.props.user.data} render={userData => <Paper zDepth={this.props.zDepth}>
        <Helmet>
          <title>トピック編集</title>
        </Helmet>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.state.topic !== null && this.state.topic.type === "normal"
          ? <TopicEditor topic={this.state.topic} onUpdate={topic => {
            this.setState({ topic });
          }} userData={userData} />
          : null}
      </Paper>} />;
    }
  })));

export function TopicEditPage() {
  return <Page><TopicEditBase /></Page>;
}

export const TopicEditModal = withModal(() => <TopicEditBase zDepth={0} />, "トピック編集");
