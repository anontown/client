import * as api from "@anontown/api-types";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { dateFormat } from "../utils";
import { TagsLink } from "./tags-link";
import * as bs from "react-bootstrap";

interface UnconnectedTopicListItemProps {
  topic: api.Topic;
  user: UserData | null;
  detail: boolean;
}
export type TopicListItemProps = ObjectOmit<UnconnectedTopicListItemProps, "user">;

interface TopicListItemState {
}

export const TopicListItem = connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<UnconnectedTopicListItemProps, TopicListItemState> {
    constructor(props: UnconnectedTopicListItemProps) {
      super(props);
    }

    render() {
      let newRes: number | null = null;
      if (this.props.user) {
        const topicData = this.props.user.storage.topicRead.get(this.props.topic.id);
        if (topicData !== undefined) {
          newRes = this.props.topic.resCount - topicData.count;
        }
      }

      return (
        <bs.Panel>
          <div>
            {!this.props.topic.active ? <i className="material-icons">not_interested</i> : null}
            {this.props.topic.type === "one" ? <i className="material-icons">looks_one</i> : null}
            {this.props.topic.type === "fork" ? <i className="material-icons">call_split</i> : null}
            {newRes !== null && newRes !== 0 ? <i className="material-icons">fiber_new</i> : null}
            <Link to={`/topic/${this.props.topic.id}`}>{this.props.topic.title}</Link>
          </div >
          {this.props.detail
            ? <div>
              {this.props.topic.type !== "fork"
                ? <div>
                  <TagsLink tags={this.props.topic.tags} />
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
        </bs.Panel>
      );
    }
  });
