import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import * as Im from "immutable";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { appInject, UserStore } from "../stores";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { TagsInput } from "./tags-input";

interface UnconnectedTopicEditorProps {
  topic: api.TopicNormal;
  onUpdate?: (topic: api.TopicNormal) => void;
  user: UserStore;
}

export type TopicEditorProps = ObjectOmit<UnconnectedTopicEditorProps, "user">;

interface TopicEditorState {
  errors: string[];
  title: string;
  tags: Im.Set<string>;
  text: string;
}

export const TopicEditor = appInject(class extends React.Component<UnconnectedTopicEditorProps, TopicEditorState> {
  constructor(props: UnconnectedTopicEditorProps) {
    super(props);
    this.state = {
      errors: [],
      title: this.props.topic.title,
      tags: Im.Set(this.props.topic.tags),
      text: this.props.topic.text,
    };
  }

  render() {
    return this.props.user.data !== null
      ? <form>
        <Errors errors={this.state.errors} />
        <TextField
          fullWidth
          floatingLabelText="タイトル"
          value={this.state.title}
          onChange={(_e, v) => this.setState({ title: v })} />
        <TagsInput
          value={this.state.tags}
          onChange={v => this.setState({ tags: v })}
          fullWidth />
        <MdEditor
          fullWidth
          value={this.state.text}
          onChange={v => this.setState({ text: v })} />
        <RaisedButton onClick={() => this.submit()} label="OK" />
      </form>
      : <div>ログインして下さい</div>;
  }

  submit() {
    if (this.props.user.data === null) {
      return;
    }

    apiClient.updateTopic(this.props.user.data.token, {
      id: this.props.topic.id,
      title: this.state.title,
      text: this.state.text,
      tags: this.state.tags.toArray(),
    }).subscribe(topic => {
      if (this.props.onUpdate) {
        this.props.onUpdate(topic);
      }
      this.setState({ errors: [] });
    }, error => {
      if (error instanceof AtError) {
        this.setState({ errors: error.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    });
  }
});
