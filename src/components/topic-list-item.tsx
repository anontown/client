import * as api from "@anontown/api-types";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { dateFormat } from "../utils";
import { TagsLink } from "./tags-link";
import { Card } from "reactstrap";

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
        <Card>
          <div>
            {!this.props.topic.active ? <span className="fa fa-times" /> : null}
            {this.props.topic.type === "one" ? <span className="fa fa-comment" /> : null}
            {this.props.topic.type === "fork" ? <span className="fa fa-code-fork" /> : null}
            {newRes !== null && newRes !== 0 ? <span className="fa fa-exclamation" /> : null}
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
        </Card>
      );
    }
  });
