import * as api from "@anontown/api-types";
import * as classNames from "classnames";
import {
  FontIcon,
  IconButton,
  IconMenu,
  MenuItem,
  Paper,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import * as uuid from "uuid";
import { ResSeted } from "../models";
import { ng } from "../models";
import { myInject, UserStore } from "../stores";
import {
  apiClient,
  dateFormat,
  resSetedCreate,
} from "../utils";
import { Md } from "./md";
import { ResWrite } from "./res-write";
import * as style from "./res.scss";
import { Snack } from "./snack";

interface UnconnectedResProps {
  res: ResSeted;
  user: UserStore;
  update?: (res: ResSeted) => void;
}

export type ResProps = ObjectOmit<UnconnectedResProps, "user">;

interface ResState {
  isReply: boolean;
  snackMsg: null | string;
  disableNG: boolean;
}

export const Res = myInject(["user"], observer(class extends React.Component<UnconnectedResProps, ResState> {
  constructor(props: UnconnectedResProps) {
    super(props);
    this.state = {
      isReply: false,
      snackMsg: null,
      disableNG: false,
    };
  }

  async vote(token: api.Token, vote: () => Promise<api.Res>) {
    try {
      const reses = await resSetedCreate.resSet(token, [await vote()]);
      const res = reses[0];
      if (this.props.update) {
        this.props.update(res);
      }
    } catch {
      this.setState({ snackMsg: "投票に失敗しました" });
    }
  }

  async onUV() {
    const user = this.props.user.data;
    if (user === null) {
      return;
    }

    switch (this.props.res.voteFlag) {
      case "uv":
        await this.vote(user.token, () => apiClient.cvRes(user.token, { id: this.props.res.id }));
        break;
      case "dv":
        await this.vote(user.token, () => apiClient.cvRes(user.token, { id: this.props.res.id })
          .then(() => apiClient.uvRes(user.token, { id: this.props.res.id })));
        break;
      case "not":
        await this.vote(user.token, () => apiClient.uvRes(user.token, { id: this.props.res.id }));
        break;
    }
  }

  async onDV() {
    const user = this.props.user.data;
    if (user === null) {
      return;
    }

    switch (this.props.res.voteFlag) {
      case "dv":
        await this.vote(user.token, () => apiClient.cvRes(user.token, { id: this.props.res.id }));
        break;
      case "uv":
        await this.vote(user.token, () => apiClient.cvRes(user.token, { id: this.props.res.id })
          .then(() => apiClient.dvRes(user.token, { id: this.props.res.id })));
        break;
      case "not":
        await this.vote(user.token, () => apiClient.dvRes(user.token, { id: this.props.res.id }));
        break;
    }
  }

  async onDeleteClick() {
    if (this.props.user.data === null) {
      return;
    }
    const user = this.props.user.data;

    try {
      const reses = await resSetedCreate
        .resSet(user.token, [await apiClient.delRes(user.token, { id: this.props.res.id })]);
      if (this.props.update) {
        this.props.update(reses[0]);
      }
    } catch {
      this.setState({ snackMsg: "レス削除に失敗しました" });
    }
  }

  render(): JSX.Element {
    const smallIcon = {
      width: 18,
      height: 18,
    };
    const small = {
      width: 36,
      height: 36,
      padding: 8,
    };

    const isSelf = this.props.user.data !== null && this.props.user.data.token.user === this.props.res.user;

    return this.props.user.data !== null
      && !isSelf
      && !this.state.disableNG
      && this.props.user.data.storage.ng.some(x => ng.isNG(x, this.props.res))
      ? <div>あぼーん<a onClick={() => this.setState({ disableNG: true })}>[見る]</a></div>
      : <div className={style.container} >
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        <div className={style.vote}>
          <IconButton
            onClick={() => this.onUV()}
            disabled={isSelf || this.props.user.data === null}>
            <FontIcon
              className="material-icons"
              color={this.props.res.voteFlag === "uv" ? "orange" : undefined}>keyboard_arrow_up</FontIcon>
          </IconButton>
          <IconButton
            onClick={() => this.onDV()}
            disabled={isSelf || this.props.user.data === null}>
            <FontIcon
              className="material-icons"
              color={this.props.res.voteFlag === "dv" ? "orange" : undefined}>keyboard_arrow_down</FontIcon>
          </IconButton>
        </div>
        <div className={style.main}>
          <div className={classNames(style.header, {
            [style.self]: isSelf,
            [style.reply]: this.props.res.type === "normal" && this.props.res.isReply && !isSelf,
          })}>
            <a onClick={() => this.setState({ isReply: !this.state.isReply })}>
              #
              </a>
            &nbsp;
              {this.props.res.type === "normal" && this.props.res.name !== null
              ? <span>{this.props.res.name}</span>
              : null}
            {this.props.res.type === "normal" && this.props.res.name === null && this.props.res.profile === null
              ? <span>名無しさん</span>
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
            {this.props.res.type === "normal" && this.props.res.profile !== null
              ? <Link to={{
                pathname: `/profile/${this.props.res.profile.id}`,
                state: {
                  modal: true,
                },
              }}>●{this.props.res.profile.sn}</Link>
              : null}
            &nbsp;
              <Link to={{
              pathname: `/res/${this.props.res.id}`,
              state: { modal: true },
            }}>{dateFormat.format(this.props.res.date)}</Link>
            &nbsp;
            <Link to={{
              pathname: `/hash/${encodeURIComponent(this.props.res.hash)}`,
              state: {
                modal: true,
              },
            }}>
              HASH:{this.props.res.hash.substr(0, 6)}
            </Link>
            &nbsp;
            <span>
              {this.props.res.uv - this.props.res.dv}ポイント
            </span>
            {this.props.user.data !== null
              ? <IconMenu
                iconStyle={{ fontSize: "10px" }}
                iconButtonElement={<IconButton style={{ width: "16px", height: "16px", padding: "0px" }}>
                  <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                </IconButton>}
                anchorOrigin={{ horizontal: "left", vertical: "top" }}
                targetOrigin={{ horizontal: "left", vertical: "top" }}>
                {isSelf && this.props.res.type === "normal"
                  ? <MenuItem primaryText="削除" onClick={() => this.onDeleteClick()} />
                  : null}
                <MenuItem primaryText="NG HASH" onClick={() => {
                  const user = this.props.user.data;
                  if (user !== null) {
                    this.props.user.setData({
                      ...user, storage: {
                        ...user.storage,
                        ng: user.storage.ng.insert(0, {
                          id: uuid.v4(),
                          name: `HASH:${this.props.res.hash}`,
                          topic: this.props.res.topic,
                          date: new Date(),
                          expirationDate: null,
                          chain: 1,
                          transparent: false,
                          node: {
                            type: "hash",
                            id: uuid.v4(),
                            hash: this.props.res.hash,
                          },
                        }),
                      },
                    });
                  }
                }} />
                {this.props.res.type === "normal" && this.props.res.profile !== null
                  ? <MenuItem primaryText="NG Profile" onClick={() => {
                    const user = this.props.user.data;
                    if (user !== null && this.props.res.type === "normal" && this.props.res.profile !== null) {
                      this.props.user.setData({
                        ...user, storage: {
                          ...user.storage,
                          ng: user.storage.ng.insert(0, {
                            id: uuid.v4(),
                            name: `Profile:${this.props.res.profile.id}`,
                            topic: null,
                            date: new Date(),
                            expirationDate: null,
                            chain: 1,
                            transparent: false,
                            node: {
                              type: "profile",
                              id: uuid.v4(),
                              profile: this.props.res.profile.id,
                            },
                          }),
                        },
                      });
                    }
                  }} />
                  : null}
              </IconMenu>
              : null}
          </div>
          <div>
            <span>
              {this.props.res.type === "normal" && this.props.res.reply !== null
                ? <IconButton
                  containerElement={<Link to={{
                    pathname: `/res/${this.props.res.reply}`,
                    state: { modal: true },
                  }} />}
                  style={small}
                  iconStyle={smallIcon}>
                  <FontIcon className="material-icons">send</FontIcon>
                </IconButton>
                : null}
              {this.props.res.replyCount !== 0
                ? <span>
                  <IconButton
                    containerElement={<Link to={{
                      pathname: `/res/${this.props.res.id}/reply`,
                      state: { modal: true },
                    }} />}
                    style={small}
                    iconStyle={smallIcon}>
                    <FontIcon className="material-icons">reply</FontIcon>
                  </IconButton>
                  {this.props.res.replyCount}
                </span>
                : null}
            </span>
            {this.props.res.type === "normal" ?
              <Md text={this.props.res.text} />
              : this.props.res.type === "history" ?
                <Md text={this.props.res.history.text} />
                : this.props.res.type === "topic" && this.props.res.topicObject.type === "one" ?
                  <Md text={this.props.res.topicObject.text} />
                  : null}
            {this.props.res.type === "topic" && this.props.res.topicObject.type === "fork"
              ? <div>
                <p>
                  派生トピックが建ちました。
                    </p>
              </div>
              : null}
            {this.props.res.type === "fork"
              ? <div>
                <p>
                  派生トピック:<Link to={`/topic/${this.props.res.fork.id}`}>{this.props.res.fork.title}</Link>
                </p>
              </div>
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
          {this.state.isReply && this.props.user.data !== null
            ? <Paper>
              <ResWrite topic={this.props.res.topic} reply={this.props.res.id} userData={this.props.user.data} />
            </Paper>
            : null}
        </div>
      </div >;
  }
}));
