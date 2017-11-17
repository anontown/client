import * as api from "@anontown/api-types";
import * as React from "react";
import { Link } from "react-router-dom";
import { apiClient, dateFormat } from "../utils";
import { History } from "./history";
import { Md } from "./md";
import { Snack } from "./snack";
import { TagsLink } from "./tags-link";

export interface TopicDataProps {
  topic: api.Topic;
}

interface TopicDataState {
  histories: api.History[] | null;
  parent: api.Topic | null;
  snackMsg: null | string;
}

export class TopicData extends React.Component<TopicDataProps, TopicDataState> {
  constructor(props: TopicDataProps) {
    super(props);
    this.state = {
      histories: null,
      parent: null,
      snackMsg: null,
    };
    if (this.props.topic.type === "normal") {
      apiClient.findHistoryAll({ topic: this.props.topic.id })
        .subscribe( histories => {
          this.setState({ histories });
        }, () => {
          this.setState({ snackMsg: "履歴取得に失敗しました" });
        });
    } else if (this.props.topic.type === "fork") {
      apiClient.findTopicOne({ id: this.props.topic.parent })
        .subscribe( parent => {
          this.setState({ parent });
        }, () => {
          this.setState({ snackMsg: "履歴取得に失敗しました" });
        });
    }
  }
  render() {
    return (
      <dl>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        <dt>作成</dt>
        <dd>{dateFormat.format(this.props.topic.date)}</dd>
        <dt>更新</dt>
        <dd>{dateFormat.format(this.props.topic.update)}</dd>
        {this.props.topic.type !== "fork"
          ?
          [
            <dt>カテゴリ</dt>,
            <dd>
              <TagsLink tags={this.props.topic.tags} />
            </dd>,
            <dt>本文</dt>,
            <dd>
              <Md body={this.props.topic.text} />
            </dd>,
          ]
          : null
        }
        {this.state.parent !== null
          ? [
            <dt>派生元</dt>,
            <dd>
              <Link to={`/topic/${this.state.parent.id}`}>{this.state.parent.title}</Link>
            </dd>,
          ]
          : null}
        {this.state.histories !== null
          ? [
            <dt>編集履歴</dt>,
            <dd>
              {this.state.histories.map( h => <History history={h} />)}
            </dd>,
          ]
          : null}
      </dl>
    );
  }
}
