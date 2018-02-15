import * as api from "@anontown/api-types";
import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { apiClient } from "../utils";
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";
import { UserStore, appInject } from "../stores";

interface UnconnectedTopicFavoProps {
  user: UserStore
  detail: boolean;
}

export type TopicFavoProps = ObjectOmit<UnconnectedTopicFavoProps, "user">;

interface TopicFavoState {
  topicFavo: api.Topic[] | null;
  snackMsg: null | string;
}

export const TopicFavo = appInject(class extends React.Component<UnconnectedTopicFavoProps, TopicFavoState> {
  constructor(props: UnconnectedTopicFavoProps) {
    super(props);
    this.state = {
      topicFavo: null,
      snackMsg: null,
    };
    this.update();
  }

  update() {
    if (this.props.user.data === null) {
      return;
    }
    apiClient
      .findTopicIn({ ids: this.props.user.data.storage.topicFavo.toArray() })
      .map(topics => topics.sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0))
      .subscribe(topics => {
        this.setState({ topicFavo: topics });
      }, () => {
        this.setState({ snackMsg: "トピック取得に失敗しました" });
      });
  }

  render() {
    return <div>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      <IconButton onClick={() => this.update()} >
        <FontIcon className="material-icons">refresh</FontIcon>
      </IconButton>
      <Paper>
        {this.props.user.data !== null
          ? this.state.topicFavo !== null
            ? this.state.topicFavo.length !== 0 ?
              this.state.topicFavo.map(topic => <TopicListItem
                key={topic.id}
                topic={topic}
                detail={this.props.detail} />)
              : <div>
                お気に入りトピックがありません。
                <br />
                <Link to="/topic/search">トピック一覧</Link>
              </div>
            : null
          : <div>ログインしないと表示出来ません</div>}
      </Paper>
    </div>;
  }
});
