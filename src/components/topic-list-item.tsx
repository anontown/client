import * as api from "@anontown/api-types";
import { FontIcon } from "material-ui";
import * as React from "react";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { appInject, UserStore } from "../stores";
import { dateFormat } from "../utils";
import { TagsLink } from "./tags-link";
import * as style from "./topic-list-item.scss";

interface UnconnectedTopicListItemProps {
  topic: api.Topic;
  user: UserStore;
  detail: boolean;
}
export type TopicListItemProps = ObjectOmit<UnconnectedTopicListItemProps, "user">;

interface TopicListItemState {
}

export const TopicListItem =
  appInject(class extends React.Component<UnconnectedTopicListItemProps, TopicListItemState> {
    constructor(props: UnconnectedTopicListItemProps) {
      super(props);
    }

    render() {
      let newRes: number | null = null;
      if (this.props.user.data !== null) {
        const topicData = this.props.user.data.storage.topicRead.get(this.props.topic.id);
        if (topicData !== undefined) {
          newRes = this.props.topic.resCount - topicData.count;
        }
      }

      return (
        <div className={style.container}>
          <div>
            {!this.props.topic.active ? <FontIcon className="material-icons">not_interested</FontIcon> : null}
            {this.props.topic.type === "one" ? <FontIcon className="material-icons">looks_one</FontIcon> : null}
            {this.props.topic.type === "fork" ? <FontIcon className="material-icons">call_split</FontIcon> : null}
            {newRes !== null && newRes !== 0 ? <FontIcon className="material-icons">fiber_new</FontIcon> : null}
            <Link className={style.title} to={`/topic/${this.props.topic.id}`}>{this.props.topic.title}</Link>
          </div >
          {this.props.detail
            ? <div>
              {this.props.topic.type !== "fork"
                ? <div>
                  <TagsLink tags={this.props.topic.tags} mini />
                </div >
                : <Link to={`/topic/${this.props.topic.parent}`}>親トピック</Link>}

              <div>
                作成 {dateFormat.format(this.props.topic.date)} 更新 {dateFormat.format(this.props.topic.update)}
              </div>
              <div>
                総レス数 {this.props.topic.resCount} {newRes !== null && newRes !== 0 ? <span>新着 {newRes}</span> : null}
              </div>
            </div >
            : null
          }
        </div>
      );
    }
  });
