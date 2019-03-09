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
import { Omit } from "type-zoo";
import * as uuid from "uuid";
import { ng } from "../models";
import { myInject, UserStore } from "../stores";
import {
  dateFormat,
} from "../utils";
import { Md } from "./md";
import { ResWrite } from "./res-write";
import * as style from "./res.scss";
import { Snack } from "./snack";
import * as G from "../../generated/graphql";

interface UnconnectedResProps {
  res: G.Res.Fragment;
  user: UserStore;
  update?: (res: G.Res.Fragment) => void;
}

export type ResProps = Omit<UnconnectedResProps, "user">;

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

    return this.props.user.data !== null
      && !this.props.res.self
      && !this.state.disableNG
      && this.props.user.data.storage.ng.some(x => ng.isNG(x, this.props.res))
      ? <div>あぼーん<a onClick={() => this.setState({ disableNG: true })}>[見る]</a></div>
      : <div className={style.container} >
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        <div className={style.vote}>
          <G.VoteRes.Component
            variables={{
              res: this.props.res.id,
              type: this.props.res.voteFlag === "uv" ? G.VoteType.Cv : G.VoteType.Uv
            }}
            onCompleted={data => {
              if (this.props.update) {
                this.props.update(data.voteRes);
              }
            }}>{(submit, { error }) => {
              return (<>
                {error && <Snack msg="投票に失敗しました" />}
                <IconButton
                  onClick={() => submit()}
                  disabled={this.props.res.self || this.props.user.data === null}>
                  <FontIcon
                    className="material-icons"
                    color={this.props.res.voteFlag === "uv" ? "orange" : undefined}>keyboard_arrow_up</FontIcon>
                </IconButton>
              </>);
            }}</G.VoteRes.Component>
          <G.VoteRes.Component
            variables={{
              res: this.props.res.id,
              type: this.props.res.voteFlag === "dv" ? G.VoteType.Cv : G.VoteType.Dv
            }}
            onCompleted={data => {
              if (this.props.update) {
                this.props.update(data.voteRes);
              }
            }}>{(submit, { error }) => {
              return (<>
                {error && <Snack msg="投票に失敗しました" />}
                <IconButton
                  onClick={() => submit()}
                  disabled={this.props.res.self || this.props.user.data === null}>
                  <FontIcon
                    className="material-icons"
                    color={this.props.res.voteFlag === "dv" ? "orange" : undefined}>keyboard_arrow_down</FontIcon>
                </IconButton>
              </>);
            }}</G.VoteRes.Component>
        </div>
        <div className={style.main}>
          <div className={classNames(style.header, {
            [style.self]: this.props.res.self,
            [style.reply]: this.props.res.__typename === "ResNormal" && this.props.res.isReply && !this.props.res.self,
          })}>
            <a onClick={() => this.setState({ isReply: !this.state.isReply })}>
              #
              </a>
            &nbsp;
              {this.props.res.__typename === "ResNormal" && this.props.res.name !== null
              ? <span>{this.props.res.name}</span>
              : null}
            {this.props.res.__typename === "ResNormal" && this.props.res.name === null && this.props.res.profile === null
              ? <span>名無しさん</span>
              : null}
            {this.props.res.__typename === "ResHistory"
              ? <span>トピックデータ</span>
              : null}
            {(this.props.res.__typename as any) === "ResTopic"
              ? <span>トピ主</span>
              : null}
            {this.props.res.__typename === "ResFork"
              ? <span>派生トピック</span>
              : null}
            {this.props.res.__typename === "ResDelete"
              ? <span>削除</span>
              : null}
            {this.props.res.__typename === "ResNormal" && this.props.res.profile !== null
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
                {this.props.res.self && this.props.res.__typename === "ResNormal"
                  ? <G.DelRes.Component
                    variables={{ res: this.props.res.id }}
                    onCompleted={data => {
                      if (this.props.update) {
                        this.props.update(data.delRes);
                      }
                    }}>{(submit, { error }) => {
                      return (<>
                        {error && <Snack msg={"削除に失敗しました"} />}
                        <MenuItem primaryText="削除" onClick={() => submit()} />
                      </>);
                    }}</G.DelRes.Component>
                  : null}
                <MenuItem primaryText="NG HASH" onClick={() => {
                  const user = this.props.user.data;
                  if (user !== null) {
                    this.props.user.setStorage({
                      ...user.storage,
                      ng: user.storage.ng.insert(0, {
                        id: uuid.v4(),
                        name: `HASH:${this.props.res.hash}`,
                        topic: this.props.res.topic.id,
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
                    });
                  }
                }} />
                {this.props.res.__typename === "ResNormal" && this.props.res.profile !== null
                  ? <MenuItem primaryText="NG Profile" onClick={() => {
                    const user = this.props.user.data;
                    if (user !== null && this.props.res.__typename === "ResNormal" && this.props.res.profile !== null) {
                      this.props.user.setStorage({
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
                      });
                    }
                  }} />
                  : null}
              </IconMenu>
              : null}
          </div>
          <div>
            <span>
              {this.props.res.__typename === "ResNormal" && this.props.res.reply !== null
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
            {this.props.res.__typename === "ResNormal" ?
              <Md text={this.props.res.text} />
              : this.props.res.__typename === "ResHistory" ?
                <Md text={this.props.res.history.text} />
                : (this.props.res.__typename as any) === "ResTopic" && this.props.res.topic.__typename === "TopicOne" ?
                  <Md text={this.props.res.topic.text} />
                  : null}
            {(this.props.res.__typename === "ResTopic" as any) && this.props.res.topic.__typename === "TopicFork"
              ? <div>
                <p>
                  派生トピックが建ちました。
                    </p>
              </div>
              : null}
            {this.props.res.__typename === "ResFork"
              ? <div>
                <p>
                  派生トピック:<Link to={`/topic/${this.props.res.fork.id}`}>{this.props.res.fork.title}</Link>
                </p>
              </div>
              : null}

            {this.props.res.__typename === "ResDelete"
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
              <ResWrite
                topic={this.props.res.topic.id}
                reply={this.props.res.id}
                userData={this.props.user.data}
                changeStorage={x => this.props.user.setStorage(x)} />
            </Paper>
            : null}
        </div>
      </div >;
  }
}));
