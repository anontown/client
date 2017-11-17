import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { TagsInput } from "./tags-input";

interface _TopicEditorProps {
  topic: api.TopicNormal;
  onUpdate?: (topic: api.TopicNormal) => void;
  user: UserData | null;
}

export type TopicEditorProps = ObjectOmit<_TopicEditorProps, "user">;

interface TopicEditorState {
  errors: string[];
  title: string;
  tags: string[];
  text: string;
}

class _TopicEditor extends React.Component<_TopicEditorProps, TopicEditorState> {
  constructor(props: _TopicEditorProps) {
    super(props);
    this.state = {
      errors: [],
      title: this.props.topic.title,
      tags: this.props.topic.tags,
      text: this.props.topic.text,
    };
  }

  public render() {
    return this.props.user !== null
      ? <form onSubmit={() => this.submit()}>
        <Errors errors={this.state.errors} />
        <TextField floatingLabelText="タイトル" value={this.state.title} onChange={(_e, v) => this.setState({ title: v })} />
        <TagsInput value={this.state.tags} onChange={(v) => this.setState({ tags: v })} />
        <MdEditor value={this.state.text} onChange={(v) => this.setState({ text: v })} />
        <RaisedButton type="submit" label="OK" />
      </form>
      : <div>ログインして下さい</div>;
  }

  public submit() {
    if (this.props.user === null) {
      return;
    }

    apiClient.updateTopic(this.props.user.token, {
      id: this.props.topic.id,
      title: this.state.title,
      text: this.state.text,
      tags: this.state.tags,
    }).subscribe((topic) => {
      if (this.props.onUpdate) {
        this.props.onUpdate(topic);
      }
      this.setState({ errors: [] });
    }, (error) => {
      if (error instanceof AtError) {
        this.setState({ errors: error.errors.map((e) => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    });
  }
}

export const TopicEditor = connect((state: Store) => ({ user: state.user }))(_TopicEditor);
