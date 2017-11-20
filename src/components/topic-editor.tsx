import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { Button, TextField } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { TagsInput } from "./tags-input";
import * as Im from "immutable";

interface UnconnectedTopicEditorProps {
  topic: api.TopicNormal;
  onUpdate?: (topic: api.TopicNormal) => void;
  user: UserData | null;
}

export type TopicEditorProps = ObjectOmit<UnconnectedTopicEditorProps, "user">;

interface TopicEditorState {
  errors: string[];
  title: string;
  tags: Im.Set<string>;
  text: string;
}

export const TopicEditor = connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<UnconnectedTopicEditorProps, TopicEditorState> {
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
      return this.props.user !== null
        ? <form onSubmit={() => this.submit()}>
          <Errors errors={this.state.errors} />
          <TextField
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}>タイトル</TextField>
          <TagsInput value={this.state.tags} onChange={v => this.setState({ tags: v })} />
          <MdEditor value={this.state.text} onChange={v => this.setState({ text: v })} />
          <Button raised type="submit">OK</Button>
        </form>
        : <div>ログインして下さい</div>;
    }

    submit() {
      if (this.props.user === null) {
        return;
      }

      apiClient.updateTopic(this.props.user.token, {
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
