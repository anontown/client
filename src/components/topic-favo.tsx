import * as api from "@anontown/api-types";
import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import { Link } from "react-router-dom";
import { UserData } from "../models";
import { apiClient } from "../utils";
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";

interface TopicFavoProps {
  userData: UserData;
  detail: boolean;
}

interface TopicFavoState {
  topicFavo: api.Topic[] | null;
  snackMsg: null | string;
}

export class TopicFavo extends React.Component<TopicFavoProps, TopicFavoState> {
  constructor(props: TopicFavoProps) {
    super(props);
    this.state = {
      topicFavo: null,
      snackMsg: null,
    };
    this.update();
  }

  async update() {
    try {
      const topics = await apiClient
        .findTopicIn({ ids: this.props.userData.storage.topicFavo.toArray() });
      this.setState({
        topicFavo: topics.sort((a, b) => a.update > b.update ? -1 : a.update < b.update ? 1 : 0),
      });
    } catch {
      this.setState({ snackMsg: "トピック取得に失敗しました" });
    }
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
        {this.state.topicFavo !== null
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
          : null}
      </Paper>
    </div>;
  }
}
