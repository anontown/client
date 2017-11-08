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
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";

interface _TopicForkProps {
  topic: api.TopicNormal,
  onCreate?: (topic: api.TopicFork) => void,
  user: UserData | null
}

export type TopicForkProps = ObjectOmit<_TopicForkProps, "user">;

interface TopicForkState {
  errors: string[],
  title: string,
  children: api.TopicFork[],
  snackMsg: string | null
}

class _TopicFork extends React.Component<_TopicForkProps, TopicForkState> {
  constructor(props: _TopicForkProps) {
    super(props);
    this.state = {
      errors: [],
      title: this.props.topic.title,
      children: [],
      snackMsg: null
    }

    apiClient.findTopicFork({
      parent: this.props.topic.id,
      skip: 0,
      limit: 100,
      activeOnly: false
    }).subscribe(topics => {
      this.setState({ children: topics });
    }, () => {
      this.setState({ snackMsg: "トピック取得に失敗" });
    });
  }

  render() {
    return <div>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      {this.props.user !== null
        ? <form onSubmit={() => this.submit()}>
          <Errors errors={this.state.errors} />
          <TextField floatingLabelText="タイトル" value={this.state.title} onChange={(_e, v) => this.setState({ title: v })} />
          <RaisedButton type="submit" label="新規作成" />
        </form>
        : null}
      <hr />
      <div>
        {this.state.children.map(t => <TopicListItem topic={t} detail={false} />)}
      </div>
    </div>;
  }

  submit() {
    if (this.props.user === null) {
      return;
    }

    apiClient.createTopicFork(this.props.user.token, {
      title: this.state.title,
      parent: this.props.topic.id
    }).subscribe(topic => {
      if (this.props.onCreate) {
        this.props.onCreate(topic);
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

export const TopicFork = connect((state: Store) => ({ user: state.user }))(_TopicFork);