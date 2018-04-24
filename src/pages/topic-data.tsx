import { Paper } from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Snack, TopicData } from "../components";
import {
  withModal,
} from "../utils";
import { TopicDataStore, myInject } from "../stores";
import { observer } from "mobx-react";

interface TopicDataBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
  topicData: TopicDataStore;
}

interface TopicDataBaseState {
}

const TopicDataBase = withRouter(myInject(["topicData"], observer(class extends React.Component<TopicDataBaseProps, TopicDataBaseState> {
  constructor(props: TopicDataBaseProps) {
    super(props);
    this.state = {
      topic: null,
      snackMsg: null,
    };

    this.props.topicData.load(this.props.match.params.id);
  }

  render() {
    return <Paper zDepth={this.props.zDepth}>
      <Snack
        msg={this.props.topicData.msg}
        onHide={() => this.props.topicData.clearMsg()} />
      {this.props.topicData.topic !== null
        ? <Paper zDepth={this.props.zDepth}>
          <TopicData topic={this.props.topicData.topic} />
        </Paper>
        : null}
    </Paper>;
  }
})));

export function TopicDataPage() {
  return <Page><TopicDataBase /></Page>;
}

export const TopicDataModal = withModal(() => <TopicDataBase zDepth={0} />, "トピック詳細");
