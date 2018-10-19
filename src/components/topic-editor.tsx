import * as Im from "immutable";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { TagsInput } from "./tags-input";
import { Mutation } from "react-apollo";
import { topic_TopicNormal } from "../gql/_gql/topic";
import { updateTopic } from "../gql/topic.gql";
import { updateTopic as updateTopicResult, updateTopicVariables } from "../gql/_gql/updateTopic";

interface TopicEditorProps {
  topic: topic_TopicNormal;
  onUpdate?: (topic: topic_TopicNormal) => void;
  userData: UserData;
}

interface TopicEditorState {
  title: string;
  tags: Im.Set<string>;
  text: string;
}

export class TopicEditor extends React.Component<TopicEditorProps, TopicEditorState> {
  constructor(props: TopicEditorProps) {
    super(props);
    this.state = {
      title: this.props.topic.title,
      tags: Im.Set(this.props.topic.tags),
      text: this.props.topic.text,
    };
  }

  render() {
    return <Mutation<updateTopicResult, updateTopicVariables>
      mutation={updateTopic}
      variables={{
        id: this.props.topic.id,
        title: this.state.title,
        text: this.state.text,
        tags: this.state.tags.toArray()
      }}
      onCompleted={data => {
        if (this.props.onUpdate) {
          this.props.onUpdate(data.updateTopic);
        }
      }}>{
        (submit, { error }) => {
          return (<form>
            {error && <Errors errors={["エラーが発生しました"]} />}
            <TextField
              fullWidth={true}
              floatingLabelText="タイトル"
              value={this.state.title}
              onChange={(_e, v) => this.setState({ title: v })} />
            <TagsInput
              value={this.state.tags}
              onChange={v => this.setState({ tags: v })}
              fullWidth={true} />
            <MdEditor
              fullWidth={true}
              value={this.state.text}
              onChange={v => this.setState({ text: v })} />
            <RaisedButton onClick={() => submit()} label="OK" />
          </form>);
        }
      }</Mutation>;
  }
}
