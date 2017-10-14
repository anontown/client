import * as React from 'react';
import * as api from '@anontown/api-types'
import { Errors } from './errors';
import { TextField, RaisedButton } from 'material-ui';
import { UserData } from "../models";
import { apiClient } from "../utils";
import { AtError } from "@anontown/api-client";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import { TagsInput } from "./tags-input";
import { MdEditor } from "./md-editor";

interface _TopicEditorProps {
  topic: api.TopicNormal,
  onUpdate?: (topic: api.TopicNormal) => void,
  user: UserData | null
}

export type TopicEditorProps = ObjectOmit<_TopicEditorProps, "user">;

export interface TopicEditorState {
  errors: string[],
  title: string,
  tags: string[],
  text: string,
}

class _TopicEditor extends React.Component<_TopicEditorProps, TopicEditorState> {
  constructor(props: _TopicEditorProps) {
    super(props);
    this.state = {
      errors: [],
      title: this.props.topic.title,
      tags: this.props.topic.tags,
      text: this.props.topic.text,
    }
  }

  render() {
    return this.props.user !== null
      ? <form onSubmit={() => this.submit()}>
        <Errors errors={this.state.errors} />
        <TextField floatingLabelText="タイトル" value={this.state.title} onChange={(_e, v) => this.setState({ title: v })} />
        <TagsInput value={this.state.tags} onChange={v => this.setState({ tags: v })} />
        <MdEditor value={this.state.text} onChange={v => this.setState({ text: v })} />
        <RaisedButton type="submit" label="OK" />
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
      tags: this.state.tags
    }).subscribe(topic => {
      if (this.props.onUpdate) {
        this.props.onUpdate(topic);
      }
      this.setState({ errors: [] });
    }, error => {
      if (error instanceof AtError) {
        this.setState({ errors: error.errors.map(e => e.message) })
      } else {
        this.setState({ errors: ['エラーが発生しました'] })
      }
    });
  }
}

export const TopicEditor = connect((state: Store) => ({ user: state.user }))(_TopicEditor);