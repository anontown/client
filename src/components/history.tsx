import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import {
  ResSeted,
  UserData,
} from "../models";
import { Store } from "../reducers";
import {
  apiClient,
  dateFormat,
  list,
  resSetedCreate,
} from "../utils";
import { Md } from "./md";
import { Res } from "./res";
import { Snack } from "./snack";
import { TagsLink } from "./tags-link";

interface UnconnectedHistoryProps {
  history: api.History;
  user: UserData | null;
}

export type HistoryProps = ObjectOmit<UnconnectedHistoryProps, "user">;

interface HistoryState {
  detail: boolean;
  hashReses: Im.List<ResSeted>;
  snackMsg: null | string;
}

export const History = connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<UnconnectedHistoryProps, HistoryState> {
    constructor(props: UnconnectedHistoryProps) {
      super(props);

      this.state = {
        detail: false,
        hashReses: Im.List(),
        snackMsg: null,
      };
    }

    render() {
      return (
        <div>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          <div>
            <IconButton onClick={() => this.setState({ detail: !this.state.detail })}>
              {this.state.detail
                  ? <FontIcon className="material-icons">arrow_drop_up</FontIcon>
                  : <FontIcon className="material-icons">arrow_drop_down</FontIcon>}
            </IconButton>
            {dateFormat.format(this.props.history.date)}
            <a onClick={() => this.onHashClick()} > HASH:{this.props.history.hash}</a>
          </div>
          {this.state.detail ?
            <dl>
              <dt>タイトル</dt>
              <dd>{this.props.history.title}</dd>
              <dt>カテゴリ</dt>
              <dd><TagsLink tags={this.props.history.tags} /></dd >
              <dt>本文</dt>
              <dd>
                <Md body={this.props.history.text} />
              </dd >
            </dl > : null
          }
          {
            !this.state.hashReses.isEmpty()
              ? this.state.hashReses.map(res =>
                <Paper>
                  <Res
                    res={res}
                    update={newRes => this.setState({ hashReses: list.update(this.state.hashReses, newRes) })} />
                </Paper>)
              : null
          }
        </div >
      );
    }

    onHashClick() {
      if (this.state.hashReses === null) {
        const token = this.props.user !== null ? this.props.user.token : null;
        apiClient.findResHash(token, {
          topic: this.props.history.topic,
          hash: this.props.history.hash,
        })
          .mergeMap(reses => resSetedCreate.resSet(token, reses))
          .map(reses => Im.List(reses))
          .subscribe(reses => {
            this.setState({ hashReses: reses });
          }, () => {
            this.setState({ snackMsg: "レスの取得に失敗しました" });
          });
      } else {
        this.setState({ hashReses: Im.List() });
      }
    }
  });
