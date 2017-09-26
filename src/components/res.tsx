import * as React from 'react';
import * as api from '@anontown/api-types'
import { IconMenu, MenuItem, IconButton, Paper } from 'material-ui';
import {
  NavigationMoreVert,
  HardwareKeyboardArrowUp,
  HardwareKeyboardArrowDown,
  ContentSend,
  ContentReply
} from 'material-ui/svg-icons';
import Errors from './errors';
import MdEditor from './md-editor';
import Md from './md';
import { ResTree } from '../models';
import { Link } from 'react-router';
import ResWrite from './res-write';

export interface Props {
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
  onYouTubeClick?: (videoID: string) => void;
}

export interface State {
  isReply: boolean
}

export default class Res extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isReply: false
    };
  }

  render() {
    let isSelf = this.props.token !== null && this.props.token.user === this.props.res.user;

    return (
      <Paper>
        <div>
          <IconButton onClick={this.props.onUV} disabled={isSelf || this.props.token === null}>
            <HardwareKeyboardArrowUp />
          </IconButton>
          <IconButton onClick={this.props.onDV} disabled={isSelf || this.props.token === null}>
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
              ? <a onClick={this.props.onClickProfile}>●{this.props.res.profile.sn}</a>
              : null}
            <Link to={{ pathname: 'res', query: { id: this.props.res.id } }}></Link>
            <a onClick={this.props.onHashClick}>HASH:{this.props.res.hash.substr(0, 6)}</a>
            <span class="action">
              <span>
                {this.props.res.uv - this.props.res.dv}ポイント
            </span>
              <IconMenu
                iconButtonElement={<IconButton><NavigationMoreVert /></IconButton>}
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}>
                {isSelf && this.props.res.type === 'normal'
                  ? <MenuItem primaryText="削除" onClick={this.props.onDelete} />
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
            {this.props.res.type === 'normal' ? <Md body={this.props.res.body} onYouTubeClick={this.props.onYouTubeClick} />
              : this.props.res.type === 'history' ? <Md body={this.props.res.history.body} onYouTubeClick={this.props.onYouTubeClick} />
                : this.props.res.type === 'topic' && this.props.res.topicObject.type === 'one' ? <Md body={this.props.res.topicObject.body} onYouTubeClick={this.props.onYouTubeClick} />
                  : null}
            <div *ngIf="res.type==='topic'&&topicRes!==null&&topicRes.type==='fork'" >
      <p>
              派生トピックが建ちました。
        </p>
          </div>
          {this.props.res.type === 'fork'
            ? <div><p>派生トピック:<Link to={{ pathname: '/topic', query: { id: this.props.res.fork.id } }}>{this.props.res.fork.title}</Link></p></div>
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
            <ResWrite profiles={this.props.user.profiles}
              errors: string[]
            onSubmit?: (value: State) => void;
            onYouTubeClick?: (videoID: string) => void;/>
          </Paper>
          : null}
        <div *ngIf="children.size!==0" >
        <md-card *ngIf="childrenMsg!==null"
    class="children-msg" >
      <strong>{{ childrenMsg }}</strong>
      </md - card >
      <app-res *ngFor="let c of children|reverse"
      [res] = "c"
        (update) = "childrenUpdate($event)"
        [isPop] = "true" ></app - res >
    </div >
  </div >
</Paper >
    );
  }
}