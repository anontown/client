import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import {
  ResSeted,
} from "../models";
import {
  dateFormat,
  list,
} from "../utils";
import { Md } from "./md";
import { Res } from "./res";
import { Snack } from "./snack";
import { TagsLink } from "./tags-link";
import { Link } from "react-router-dom";

interface HistoryProps {
  history: api.History;
}

interface HistoryState {
  detail: boolean;
  hashReses: Im.List<ResSeted>;
  snackMsg: null | string;
}

export class History extends React.Component<HistoryProps, HistoryState> {
  constructor(props: HistoryProps) {
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
          <Link to={{
            pathname: `/hash/${encodeURIComponent(this.props.history.hash)}`,
            state: {
              modal: true,
            },
          }}>
            HASH:{this.props.history.hash.substr(0, 6)}
          </Link>
        </div>
        {this.state.detail ?
          <dl>
            <dt>タイトル</dt>
            <dd>{this.props.history.title}</dd>
            <dt>カテゴリ</dt>
            <dd><TagsLink tags={this.props.history.tags} /></dd >
            <dt>本文</dt>
            <dd>
              <Md text={this.props.history.text} />
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
}
