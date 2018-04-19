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

    (async () => {
      try {
        if (this.props.topic.type === "normal") {
          const histories = await apiClient.findHistoryAll({ topic: this.props.topic.id });
          this.setState({ histories });
        } else if (this.props.topic.type === "fork") {
          const parent = await apiClient.findTopicOne({ id: this.props.topic.parent });
          this.setState({ parent });
        }
      } catch {
        this.setState({ snackMsg: "履歴取得に失敗しました" });
      }
    })();
  }
  render() {
    return <div>
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
          <div>
            <dt>カテゴリ</dt>
            <dd>
              <TagsLink tags={this.props.topic.tags} />
            </dd>
            <dt>本文</dt>
            <dd>
              <Md text={this.props.topic.text} />
            </dd>
          </div>
          : null
        }
        {this.state.parent !== null
          ? <div>
            <dt>派生元</dt>
            <dd>
              <Link to={`/topic/${this.state.parent.id}`}>{this.state.parent.title}</Link>
            </dd>

          </div>
          : null}
        {this.state.histories !== null
          ? <div>
            <dt>編集履歴</dt>
            <dd>
              {this.state.histories.map(h => <History key={h.id} history={h} />)}
            </dd>
          </div>
          : null}
      </dl>
    </div>;
  }
}
