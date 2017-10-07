import * as React from 'react';
import * as api from '@anontown/api-types';
import { IconButton } from 'material-ui';
import { NavigationArrowDropUp, NavigationArrowDropDown } from 'material-ui/svg-icons';
import { dateFormat } from '../utils';
import { Md } from './md';


export interface HistoryProps {
  history: api.History,
  now: Date,
  hashReses: api.Res[],
  onHashClick?: () => void,
  categoryClick?: () => void,
}

export interface HistoryState {
  detail: boolean;
}

export class History extends React.Component<HistoryProps, HistoryState> {
  constructor(props: HistoryProps) {
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
              <Md body={this.props.history.body} />
            </dd >
          </dl > : null
        }
        {this.props.hashReses.map(res => (<Res res={res} />))}
      </div>
    );
  }
}