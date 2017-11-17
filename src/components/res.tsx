import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Badge,
  Dialog,
  IconButton,
  IconMenu,
  MenuItem,
  Paper,
} from "material-ui";
import {
  ContentReply,
  ContentSend,
  HardwareKeyboardArrowDown,
  HardwareKeyboardArrowUp,
  NavigationMoreVert,
} from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Observable } from "rxjs";
import { ObjectOmit } from "typelevel-ts";
import { ResSeted } from "../models";
import { UserData } from "../models";
import { Store } from "../reducers";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";
import { Md } from "./md";
import { Profile } from "./profile";
import { ResWrite } from "./res-write";
import { Snack } from "./snack";

interface _ResProps {
  res: ResSeted;
  user: UserData | null;
  isPop: boolean;
  update?: (res: ResSeted) => void;
}

export type ResProps = ObjectOmit<_ResProps, "user">;

interface ResState {
  isReply: boolean;
  children: { reses: Im.List<ResSeted>, msg: string | null } | null;
  snackMsg: null | string;
  slowProfile: boolean;
}

class _Res extends React.Component<_ResProps, ResState> {
  constructor(props: _ResProps) {
    super(props);
    this.state = {
      isReply: false,
      children: null,
      snackMsg: null,
      slowProfile: false,
    };
  }

  vote(token: api.Token, res$: Observable<api.Res>) {
    res$.mergeMap((res) => resSetedCreate.resSet(token, [res]))
      .map((reses) => reses[0])
      .subscribe((res) => {
        if (this.props.update) {
          this.props.update(res);
        }
      }, () => {
        this.setState({ snackMsg: "投票に失敗しました" });
      });
  }

  onUV() {
    const user = this.props.user;
    if (user === null) {
      return;
    }

    switch (this.props.res.voteFlag) {
      case "uv":
        this.vote(user.token, apiClient.cvRes(user.token, { id: this.props.res.id }));
        break;
      case "dv":
        this.vote(user.token, apiClient.cvRes(user.token, { id: this.props.res.id })
          .mergeMap(() => apiClient.uvRes(user.token, { id: this.props.res.id })));
        break;
      case "not":
        this.vote(user.token, apiClient.uvRes(user.token, { id: this.props.res.id }));
        break;
    }
  }

  onDV() {
    const user = this.props.user;
    if (user === null) {
      return;
    }

    switch (this.props.res.voteFlag) {
      case "dv":
        this.vote(user.token, apiClient.cvRes(user.token, { id: this.props.res.id }));
        break;
      case "uv":
        this.vote(user.token, apiClient.cvRes(user.token, { id: this.props.res.id })
          .mergeMap(() => apiClient.dvRes(user.token, { id: this.props.res.id })));
        break;
      case "not":
        this.vote(user.token, apiClient.dvRes(user.token, { id: this.props.res.id }));
        break;
    }
  }

  onHashClock() {
    const token = this.props.user !== null ? this.props.user.token : null;
    if (this.state.children === null) {
      apiClient.findResHash(token, {
        topic: this.props.res.topic,
        hash: this.props.res.hash,
      })
        .mergeMap((reses) => resSetedCreate.resSet(token, reses))
        .subscribe((reses) => {
          this.setState({ children: { reses: Im.List(reses), msg: `HASH抽出:${this.props.res.hash}` } });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗しました" });
        });
    } else {
      this.setState({ children: null });
    }
  }

  onDeleteClick() {
    if (this.props.user === null) {
      return;
    }
    const user = this.props.user;

    apiClient.delRes(user.token, { id: this.props.res.id })
      .mergeMap((res) => resSetedCreate.resSet(user.token, [res]))
      .map((reses) => reses[0])
      .subscribe((res) => {
        if (this.props.update) {
          this.props.update(res);
        }
      }, () => {
        this.setState({ snackMsg: "レス削除に失敗しました" });
      });
  }

  onSendReplyClock() {
    const token = this.props.user !== null ? this.props.user.token : null;
    if (this.state.children === null) {
      apiClient.findResOne(token, {
        id: this.props.res.id,
      })
        .mergeMap((res) => resSetedCreate.resSet(token, [res]))
        .subscribe((reses) => {
          this.setState({ children: { reses: Im.List(reses), msg: null } });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗しました" });
        });
    } else {
      this.setState({ children: null });
    }
  }

  onReceiveReplyClock() {
    const token = this.props.user !== null ? this.props.user.token : null;
    if (this.state.children === null) {
      apiClient.findResReply(token, {
        topic: this.props.res.topic,
        reply: this.props.res.id,
      })
        .mergeMap((reses) => resSetedCreate.resSet(token, reses))
        .subscribe((reses) => {
          this.setState({ children: { reses: Im.List(reses), msg: null } });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗しました" });
        });
    } else {
      this.setState({ children: null });
    }
  }

  updateChildren(res: ResSeted) {
    if (this.state.children !== null) {
      this.setState({ children: { ...this.state.children, reses: list.update(this.state.children.reses, res) } });
    }
  }

  render(): JSX.Element {
    const isSelf = this.props.user !== null && this.props.user.token.user === this.props.res.user;

    return (
      <Paper>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.res.type === "normal" && this.props.res.profile !== null
          ? <Dialog
            title="プロフィール"
            open={this.state.slowProfile}
            autoScrollBodyContent={true}
            onRequestClose={() => this.setState({ slowProfile: false })}>
            <Profile profile={this.props.res.profile} />
            }} />
          </Dialog>
          : null}
        <div>
          <IconButton onClick={() => this.onUV()} disabled={isSelf || this.props.user === null}>
            <HardwareKeyboardArrowUp />
          </IconButton>
          <IconButton onClick={() => this.onDV()} disabled={isSelf || this.props.user === null}>
            <HardwareKeyboardArrowDown />
          </IconButton>
        </div>
        <div>
          <div>
            <a onClick={() => this.setState({ isReply: !this.state.isReply })}>
              {this.props.res.type === "normal"
                ? <span>{this.props.res.name || "名無しさん"}</span>
                : null}
              {this.props.res.type === "history"
                ? <span>トピックデータ</span>
                : null}
              {this.props.res.type === "topic"
                ? <span>トピ主</span>
                : null}
              {this.props.res.type === "fork"
                ? <span>派生トピック</span>
                : null}
              {this.props.res.type === "delete"
                ? <span>削除</span>
                : null}
            </a>
            {this.props.res.type === "normal" && this.props.res.profile !== null
              ? <a onClick={() => this.setState({ slowProfile: true })}>●{this.props.res.profile.sn}</a>
              : null}
            <Link to={`/res/${this.props.res.id}`}></Link>
            <a onClick={() => this.onHashClock()}>HASH:{this.props.res.hash.substr(0, 6)}</a>
            <span>
              <span>
                {this.props.res.uv - this.props.res.dv}ポイント
          </span>
              <IconMenu
                iconButtonElement={<IconButton><NavigationMoreVert /></IconButton>}
                anchorOrigin={{ horizontal: "left", vertical: "top" }}
                targetOrigin={{ horizontal: "left", vertical: "top" }}>
                {isSelf && this.props.res.type === "normal"
                  ? <MenuItem primaryText="削除" onClick={() => this.onDeleteClick()} />
                  : null}
              </IconMenu>
            </span>
          </div>
          <div>
            <span>
              {this.props.res.type === "normal" && this.props.res.reply !== null
                ? <IconButton onClick={() => this.onSendReplyClock()}>
                  <ContentSend />
                </IconButton>
                : null}
              {this.props.res.replyCount !== 0
                ? <Badge badgeContent={this.props.res.replyCount}>
                  <IconButton onClick={() => this.onReceiveReplyClock()}>
                    <ContentReply />
                  </IconButton>
                </Badge>
                : null}
            </span>
            {this.props.res.type === "normal" ? <Md body={this.props.res.text} />
              : this.props.res.type === "history" ? <Md body={this.props.res.history.text} />
                : this.props.res.type === "topic" && this.props.res.topicObject.type === "one" ? <Md body={this.props.res.topicObject.text} />
                  : null}
            {
              this.props.res.type === "topic" && this.props.res.topicObject.type === "fork"
                ? <div>
                  <p>
                    派生トピックが建ちました。
            </p>
                </div>
                : null
            }

            {this.props.res.type === "fork"
              ? <div><p>派生トピック:<Link to={`/topic/${this.props.res.fork.id}`}>{this.props.res.fork.title}</Link></p></div>
              : null}

            {this.props.res.type === "delete"
              ? <div>
                <p>
                  {this.props.res.flag === "self"
                    ? "投稿者により削除されました。"
                    : "管理人により削除されました。"}
                </p>
              </div>
              : null}

          </div>
          {this.state.isReply && this.props.user !== null
            ? <Paper>
              <ResWrite topic={this.props.res.topic} reply={this.props.res.id} />
            </Paper>
            : null}
          {this.state.children !== null
            ? <div>
              {this.state.children.msg !== null
                ? <Paper>
                  <strong>{this.state.children.msg}</strong>
                </Paper>
                : null}
              {this.state.children.reses.map((r) => <Res res={r} update={(res) => this.updateChildren(res)} isPop={true} />)}
            </div>
            : null
          }
        </div>
      </Paper>
    );
  }
}

export const Res = connect((state: Store) => ({ user: state.user }))(_Res);
