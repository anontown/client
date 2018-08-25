import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Omit } from "type-zoo";
import { myInject, UserStore } from "../stores";
import { Errors } from "./errors";
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";
import { topic_TopicFork_parent, topic_TopicFork } from "../gql/_gql/topic";
import { findTopicFork, createTopicFork } from "./topic-fork.gql";
import { findTopicFork as findTopicForkResult, findTopicForkVariables, findTopicFork_topics_TopicFork } from "./_gql/findTopicFork";
import { createTopicFork as createTopicForkResult, createTopicForkVariables } from "./_gql/createTopicFork";
import { Query, Mutation } from "react-apollo";

interface UnconnectedTopicForkProps {
  topic: topic_TopicFork_parent;
  onCreate?: (topic: topic_TopicFork) => void;
  user: UserStore;
}

export type TopicForkProps = Omit<UnconnectedTopicForkProps, "user">;

interface TopicForkState {
  title: string;
}

export const TopicFork = myInject(["user"],
  observer(class extends React.Component<UnconnectedTopicForkProps, TopicForkState> {
    constructor(props: UnconnectedTopicForkProps) {
      super(props);
      this.state = {
        title: "",
      };
    }

    render() {
      return <div>
        {this.props.user.data !== null
          ? <Mutation<createTopicForkResult, createTopicForkVariables>
            mutation={createTopicFork}
            variables={{
              title: this.state.title,
              parent: this.props.topic.id
            }}
            onCompleted={data => {
              if (this.props.onCreate) {
                this.props.onCreate(data.createTopicFork);
              }
            }}>{
              (submit, { error }) => {
                return (<form>
                  {error && <Errors errors={["作成に失敗"]} />}
                  <TextField
                    floatingLabelText="タイトル"
                    value={this.state.title}
                    onChange={(_e, v) => this.setState({ title: v })} />
                  <RaisedButton onClick={() => submit()} label="新規作成" />
                </form>);
              }
            }</Mutation>
          : null}
        <hr />
        <Query<findTopicForkResult, findTopicForkVariables>
          query={findTopicFork}
          variables={{ parent: this.props.topic.id }}>{
            ({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error || !data) return (<Snack msg="派生トピック取得に失敗しました" />);
              return (<div>
                {(data.topics as findTopicFork_topics_TopicFork[]).map(t => <Paper key={t.id}>
                  <TopicListItem
                    topic={t}
                    detail={false} />
                </Paper>)}
              </div>);
            }
          }</Query>
      </div>;
    }
  }));
