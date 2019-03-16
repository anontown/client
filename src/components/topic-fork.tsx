import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import * as React from "react";
import { Errors } from "./errors";
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";
import * as G from "../../generated/graphql";
import { useUserContext } from "src/utils";

interface TopicForkProps {
  topic: G.TopicNormal.Fragment;
  onCreate?: (topic: G.TopicFork.Fragment) => void;
}

export const TopicFork = (props: TopicForkProps) => {
  const [title, setTitle] = React.useState("");
  const user = useUserContext();

  return <div>
    {user.value !== null
      ? <G.CreateTopicFork.Component
        variables={{
          title: title,
          parent: props.topic.id
        }}
        onCompleted={data => {
          if (props.onCreate) {
            props.onCreate(data.createTopicFork);
          }
        }}>{
          (submit, { error }) => {
            return (<form>
              {error && <Errors errors={["作成に失敗"]} />}
              <TextField
                floatingLabelText="タイトル"
                value={title}
                onChange={(_e, v) => setTitle(v)} />
              <RaisedButton onClick={() => submit()} label="新規作成" />
            </form>);
          }
        }</G.CreateTopicFork.Component>
      : null}
    <hr />
    <G.FindTopics.Component
      variables={{ query: { parent: props.topic.id } }}>{
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
};
