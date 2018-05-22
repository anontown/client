import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import * as Im from "immutable";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { TagsInput } from "./tags-input";

interface TopicEditorProps {
  topic: api.TopicNormal;
  onUpdate?: (topic: api.TopicNormal) => void;
  userData: UserData;
}

interface TopicEditorState {
  errors: string[];
  title: string;
  tags: Im.Set<string>;
  text: string;
}

export class TopicEditor extends React.Component<TopicEditorProps, TopicEditorState> {
  constructor(props: TopicEditorProps) {
    super(props);
    this.state = {
      errors: [],
      title: this.props.topic.title,
      tags: Im.Set(this.props.topic.tags),
      text: this.props.topic.text,
    };
  }

  render() {
    return <form>
      <Errors errors={this.state.errors} />
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
      <RaisedButton onClick={() => this.submit()} label="OK" />
    </form>;
  }

  async submit() {
    try {
      const topic = await apiClient.updateTopic(this.props.userData.token, {
        id: this.props.topic.id,
        title: this.state.title,
        text: this.state.text,
        tags: this.state.tags.toArray(),
      });

      if (this.props.onUpdate) {
        this.props.onUpdate(topic);
      }
      this.setState({ errors: [] });
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }
}
