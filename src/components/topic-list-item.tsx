import * as api from "@anontown/api-types";
import { Badge, Paper } from "material-ui";
import {
  AvFiberNew,
  AvNotInterested,
  CommunicationCallSplit,
  ImageLooksOne,
} from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { dateFormat } from "../utils";
import { TagsLink } from "./tags-link";

interface _TopicListItemProps {
  topic: api.Topic;
  user: UserData | null;
  detail: boolean;
}
export type TopicListItemProps = ObjectOmit<_TopicListItemProps, "user">;

interface TopicListItemState {
}

class _TopicListItem extends React.Component<_TopicListItemProps, TopicListItemState> {
  constructor(props: _TopicListItemProps) {
    super(props);
  }

  public render() {
    let newRes: number | null = null;
    if (this.props.user) {
      const topicData = this.props.user.storage.topicRead.get(this.props.topic.id);
      if (topicData !== undefined) {
        newRes = this.props.topic.resCount - topicData.count;
      }
    }

    return (
      <Paper>
        <div>
          {!this.props.topic.active ? <AvNotInterested /> : null}
          {this.props.topic.type === "one" ? <ImageLooksOne /> : null}
          {this.props.topic.type === "fork" ? <CommunicationCallSplit /> : null}
          {newRes !== null && newRes !== 0 ? <Badge badgeContent={newRes}><AvFiberNew /></Badge> : null}
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
              総レス数 {this.props.topic.resCount}
            </div >
          </div >
          : null
        }
      </Paper >
    );
  }
}

export const TopicListItem = connect((state: Store) => ({ user: state.user }))(_TopicListItem);
