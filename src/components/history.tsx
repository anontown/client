import * as React from 'react';
import * as api from '@anontown/api-types';
import { IconButton } from 'material-ui';
import { NavigationArrowDropUp, NavigationArrowDropDown } from 'material-ui/svg-icons';
import { dateFormat } from '../utils';
import Md from './md';


export interface Props {
  history: api.History,
  now: Date,
  hashReses: api.Res[],
  onHashClick?: () => void,
  categoryClick?: () => void,
  onYouTubeClick?: (videoID: string) => void
}

export interface State {
  detail: boolean;
}

export default class History extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.setState({ detail: false });
  }

  render() {
    return (
      <div>
        <div>
          <IconButton onClick={() => this.setState({ detail: !this.state.detail })}>
            {this.state.detail ? <NavigationArrowDropUp /> : <NavigationArrowDropDown />}
          </IconButton>
          {dateFormat.format(this.props.history.date, this.props.now)}
          <a onClick={this.props.onHashClick} > HASH:{this.props.history.hash}</a>
        </div>
        {this.state.detail ?
          <dl>
            <dt>タイトル</dt>
            <dd>{this.props.history.title}</dd>
            <dt>カテゴリ</dt>
            <dd><a onClick={this.props.categoryClick}>{this.props.history.tags.join(',')}</a></dd >
            <dt>本文</dt>
            <dd>
              <Md body={this.props.history.body}
                onYouTubeClick={this.props.onYouTubeClick} />
            </dd >
          </dl > : null
        }
        {this.props.hashReses.map(res => (<Res res={res} />))}
      </div>
    );
  }
}