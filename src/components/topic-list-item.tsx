import * as React from 'react';
import * as api from '@anontown/api-types'
import { Paper, Badge } from 'material-ui';
import { AvNotInterested, ImageLooksOne, CommunicationCallSplit, AvFiberNew } from 'material-ui/svg-icons';
import { dateFormat } from '../utils';

export interface Props {
  topic: api.Topic;
  newRes: number | null;
  onTopicClick?: () => void;
  detail: boolean;
  onParentClick?: () => void;
  now: Date;
}

export interface State {
}

export class TopicListItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Paper>
        <div>
          {!this.props.topic.active ? <AvNotInterested /> : null}
          {this.props.topic.type === 'one' ? <ImageLooksOne /> : null}
          {this.props.topic.type === 'fork' ? <CommunicationCallSplit /> : null}
          {this.props.newRes !== null && this.props.newRes !== 0 ? <Badge badgeContent={this.props.newRes}><AvFiberNew /></Badge> : null}
          <a onClick={this.props.onTopicClick}> {this.props.topic.title}</a>
        </div >
        {this.props.detail
          ? <div>
            {this.props.topic.type !== 'fork'
              ? <div>
                {this.props.topic.tags.join(',')}
              </div >
              : <a onClick={this.props.onParentClick} >
                親トピック
              </a >}

            <div>
              作成 {dateFormat.format(this.props.topic.date, this.props.now)} 更新 {dateFormat.format(this.props.topic.update, this.props.now)}
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