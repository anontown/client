import { Paper } from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, TopicData, Snack } from "../components";
import {
  apiClient,
  withModal,
} from "../utils";
import * as api from "@anontown/api-types";

interface TopicDataBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
}

interface TopicDataBaseState {
  topic: api.Topic | null;
  snackMsg: null | string;
}

const TopicDataBase = withRouter(class extends React.Component<TopicDataBaseProps, TopicDataBaseState> {
  constructor(props: TopicDataBaseProps) {
    super(props);
    this.state = {
      topic: null,
      snackMsg: null,
    };

    apiClient.findTopicOne({
      id: this.props.match.params.id,
    })
      .subscribe(topic => {
        this.setState({ topic });
      }, () => {
        this.setState({ snackMsg: "トピック取得に失敗しました" });
      });
  }

  render() {
    return <div>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      {this.state.topic !== null
        ? <Paper zDepth={this.props.zDepth}>
          <TopicData topic={this.state.topic} />
        </Paper>
        : null}
    </div>;
  }
});

export function TopicDataPage() {
  return <Page><TopicDataBase /></Page>;
}

export const TopicDataModal = withModal(() => <TopicDataBase zDepth={0} />);
