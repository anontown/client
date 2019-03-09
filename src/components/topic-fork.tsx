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
import * as G from "../../generated/graphql";

interface UnconnectedTopicForkProps {
  topic: G.TopicFork.Fragment;
  onCreate?: (topic: G.TopicFork.Fragment) => void;
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
          ? <G.CreateTopicFork.Component
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
            }</G.CreateTopicFork.Component>
          : null}
        <hr />
        <G.FindTopics.Component
          variables={{ query: { parent: this.props.topic.id } }}>{
            ({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error || !data) return (<Snack msg="派生トピック取得に失敗しました" />);
              return (<div>
                {(data.topics as G.TopicFork.Fragment[]).map(t => <Paper key={t.id}>
                  <TopicListItem
                    topic={t}
                    detail={false} />
                </Paper>)}
              </div>);
            }
          }</G.FindTopics.Component>
      </div>;
    }
  }));
