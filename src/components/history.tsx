import * as api from "@anontown/api-types";
import {
  IconButton,
} from "material-ui";
import {
  NavigationArrowDropDown,
  NavigationArrowDropUp,
} from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import { dateFormat } from "../utils";
import { Md } from "./md";
import { Snack } from "./snack";
import { TagsLink } from "./tags-link";

interface _HistoryProps {
  history: api.History;
  user: UserData | null;
}

export type HistoryProps = ObjectOmit<_HistoryProps, "user">;

interface HistoryState {
  detail: boolean;
  hashReses: api.Res[] | null;
  snackMsg: null | string;
}

class _History extends React.Component<_HistoryProps, HistoryState> {
  constructor(props: _HistoryProps) {
    super(props);

    this.state = {
      detail: false,
      hashReses: null,
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
            {this.state.detail ? <NavigationArrowDropUp /> : <NavigationArrowDropDown />}
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
          this.state.hashReses !== null
            ? this.state.hashReses.map((res) => (<Res res={res} />))
            : null
        }
      </div >
    );
  }

  onHashClick() {
    if (this.state.hashReses === null) {
      apiClient.findResHash(this.props.user !== null ? this.props.user.token : null, {
        topic: this.props.history.topic,
        hash: this.props.history.hash,
      }).subscribe((reses) => {
        this.setState({ hashReses: reses });
      }, () => {
        this.setState({ snackMsg: "レスの取得に失敗しました" });
      });
    } else {
      this.setState({ hashReses: null });
    }
  }
}

export const History = connect((state: Store) => ({ user: state.user }))(_History);
