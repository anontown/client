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
import { findTopic } from "./topic-data.gql";
import { findTopic as findTopicResult, findTopicVariables } from "./_gql/findTopic";
import { Query } from "react-apollo";

interface TopicDataBaseProps extends RouteComponentProps<{ id: string }> {
  zDepth?: number;
}

interface TopicDataBaseState {
}

const TopicDataBase = withRouter(class extends React.Component<TopicDataBaseProps, TopicDataBaseState> {
  constructor(props: TopicDataBaseProps) {
    super(props);
  }

  render() {
    this.props.match.params.id

    return <Paper zDepth={this.props.zDepth}>
      <Query<findTopicResult, findTopicVariables>
        query={findTopic}
        variables={{ id: this.props.match.params.id }}>{
          ({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error || !data || data.topics.length === 0) return (<Snack msg="トピック取得に失敗しました" />);

            return (<Paper zDepth={this.props.zDepth}>
              <TopicData topic={data.topics[0]} />
            </Paper>);
          }
        }</Query>
    </Paper>;
  }
});

export function TopicDataPage() {
  return <Page><TopicDataBase /></Page>;
}

export const TopicDataModal = withModal(() => <TopicDataBase zDepth={0} />, "トピック詳細");
