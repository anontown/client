import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Snack, TopicData } from "../components";
import { myInject, TopicDataStore } from "../stores";
import {
  withModal,
} from "../utils";

interface TopicDataBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
  topicData: TopicDataStore;
}

interface TopicDataBaseState {
}

const TopicDataBase = withRouter(myInject(["topicData"],
  observer(class extends React.Component<TopicDataBaseProps, TopicDataBaseState> {
    constructor(props: TopicDataBaseProps) {
      super(props);
      this.state = {
        topic: null,
        snackMsg: null,
      };

      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps: TopicDataBaseProps) {
      this.props.topicData.load(nextProps.match.params.id);
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
