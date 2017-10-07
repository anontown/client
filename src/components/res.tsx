import * as React from 'react';
import * as api from '@anontown/api-types'
import {
  IconMenu,
  MenuItem,
  IconButton,
  Paper,
  Badge
} from 'material-ui';
import {
  NavigationMoreVert,
  HardwareKeyboardArrowUp,
  HardwareKeyboardArrowDown,
  ContentSend,
  ContentReply
} from 'material-ui/svg-icons';
import { Md } from './md';
import { ResTree } from '../models';
import { Link } from 'react-router-dom';
import { ResWriteContainer } from '../containers';

export interface ResProps {
  res: ResTree,
  user: {
    token: api.Token,
    profiles: api.Profile[]
  } | null,
  onDeleteClick?: () => void,
  onUVClick?: () => void;
  onDVClick?: () => void;
  onProfileClick?: () => void;
  onHashClick?: () => void;
  onReplyClick?: () => void;
  onSendClick?: () => void;
}

export interface ResState {
  isReply: boolean
}

export class Res extends React.Component<ResProps, ResState> {
  constructor(props: ResProps) {
    super(props);
    this.state = {
      isReply: false
    };
  }

  render() {
    let isSelf = this.props.user !== null && this.props.user.token.user === this.props.res.user;

    return (
      <Paper>
        <div>
          <IconButton onClick={this.props.onUVClick} disabled={isSelf || this.props.user === null}>
            <HardwareKeyboardArrowUp />
          </IconButton>
          <IconButton onClick={this.props.onDVClick} disabled={isSelf || this.props.user === null}>
            <HardwareKeyboardArrowDown />
          </IconButton>
        </div >
        <div>
          <div>
            <a onClick={() => this.setState({ isReply: !this.state.isReply })}>
              {this.props.res.type === 'normal'
                ? <span>{this.props.res.name || '名無しさん'}</span>
                : null}
              {this.props.res.type === 'history'
                ? <span>トピックデータ</span>
                : null}
              {this.props.res.type === 'topic'
                ? <span>トピ主</span>
                : null}
              {this.props.res.type === 'fork'
                ? <span>派生トピック</span>
                : null}
              {this.props.res.type === 'delete'
                ? <span>削除</span>
                : null}
            </a>
            {this.props.res.type === 'normal' && this.props.res.profile !== null
              ? <a onClick={this.props.onProfileClick}>●{this.props.res.profile.sn}</a>
              : null}
            <Link to={`/res/${this.props.res.id}`}></Link>
            <a onClick={this.props.onHashClick}>HASH:{this.props.res.hash.substr(0, 6)}</a>
            <span>
              <span>
                {this.props.res.uv - this.props.res.dv}ポイント
            </span>
              <IconMenu
                iconButtonElement={<IconButton><NavigationMoreVert /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}>
                {isSelf && this.props.res.type === 'normal'
                  ? <MenuItem primaryText="削除" onClick={this.props.onDeleteClick} />
                  : null}
              </IconMenu>
            </span >
          </div >
          <div>
            <span>
              {this.props.res.type === 'normal' && this.props.res.reply !== null
                ? <IconButton onClick={this.props.onSendClick}>
                  <ContentSend />
                </IconButton>
                : null}
              {this.props.res.replyCount !== 0
                ? <Badge badgeContent={this.props.res.replyCount}>
                  <IconButton onClick={this.props.onReplyClick}>
                    <ContentReply />
                  </IconButton>
                </Badge>
                : null}
            </span>
            {this.props.res.type === 'normal' ? <Md body={this.props.res.body} />
              : this.props.res.type === 'history' ? <Md body={this.props.res.history.body} />
                : this.props.res.type === 'topic' && this.props.res.topicObject.type === 'one' ? <Md body={this.props.res.topicObject.body} />
                  : null}
            {
              this.props.res.type === 'topic' && this.props.res.topicObject.type === 'fork'
                ? <div>
                  <p>
                    派生トピックが建ちました。
              </p>
                </div>
                : null
            }

            {this.props.res.type === 'fork'
              ? <div><p>派生トピック:<Link to={`/topic/${this.props.res.fork.id}`}>{this.props.res.fork.title}</Link></p></div>
              : null}

            {this.props.res.type === 'delete'
              ? <div>
                <p>
                  {this.props.res.flag === 'self'
                    ? '投稿者により削除されました。'
                    : '管理人により削除されました。'}
                </p>
              </div>
              : null}

          </div >
          {this.state.isReply && this.props.user !== null
            ? <Paper>
              <ResWriteContainer topic={this.props.res.topic} reply={this.props.res.id} />
            </Paper>
            : null}
          {this.props.res.children !== null
            ? [
              (
                this.props.res.children.msg !== null
                  ? <Paper>
                    <strong>{this.props.res.children.msg}</strong>
                  </Paper>
                  : null
              ),
              (this.props.res.children.resIDs.map(id => <ResContainer id={id} />))
            ]
            : null
          }
        </div>
      </Paper >
    );
  }
}