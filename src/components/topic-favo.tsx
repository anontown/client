import * as React from 'react';
import { Link } from "react-router-dom";
import {
  Paper,
  IconButton
} from 'material-ui';
import { UserData } from "../models";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import { apiClient } from "../utils";
import * as api from "@anontown/api-types";
import { TopicListItem } from "./topic-list-item";
import { Snack } from "./snack";
import { NavigationRefresh } from 'material-ui/svg-icons';

interface _TopicFavoProps {
  user: UserData | null
}

export type TopicFavoProps = ObjectOmit<_TopicFavoProps, "user">;

export interface TopicFavoState {
  topicFavo: api.Topic[] | null,
  snackMsg: null | string
}

class _TopicFavo extends React.Component<_TopicFavoProps, TopicFavoState> {
  constructor(props: _TopicFavoProps) {
    super(props);
    this.state = {
      topicFavo: null,
      snackMsg: null
    };
    this.update();
  }

  update() {
    if (this.props.user === null) {
      return;
    }
    apiClient
      .findTopicIn({ ids: this.props.user.storage.topicFavo.toArray() })
      .map(topics => topics.sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0))
      .subscribe(topics => {
        this.setState({ topicFavo: topics });
      }, () => {
        this.setState({ snackMsg: "トピック取得に失敗しました" })
      });
  }

  render() {
    return <div>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      <IconButton onClick={() => this.update()} >
        <NavigationRefresh />
      </IconButton>
      {this.props.user !== null
        ? this.state.topicFavo !== null
          ? this.state.topicFavo.length !== 0 ?
            this.state.topicFavo.map(topic => <TopicListItem topic={topic} detail={false} />)
            : <Paper>
              お気に入りトピックがありません。
        <br />
              <Link to='/topic/search'>トピック一覧</Link>
            </Paper>
          : null
        : <div>ログインしないと表示出来ません</div>}
    </div>;
  }
}

export const TopicFavo = connect((state: Store) => ({ user: state.user }))(_TopicFavo);