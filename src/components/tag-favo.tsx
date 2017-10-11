import * as React from 'react';
import { Link } from "react-router-dom";
import {
  Paper
} from 'material-ui';
import { UserData } from "../models";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";

interface _TagFavoProps {
  user: UserData | null
}

export type TagFavoProps = ObjectOmit<_TagFavoProps, "user">;

export interface TagFavoState {
}

class _TagFavo extends React.Component<_TagFavoProps, TagFavoState> {
  constructor(props: _TagFavoProps) {
    super(props);
  }

  render() {
    return this.props.user !== null
      ? this.props.user.storage.tagsFavo.size !== 0 ?
        this.props.user.storage.tagsFavo.map(tags =>
          <Paper>
            <Link to={{ pathname: "/topic/search", search: new URLSearchParams({ tags: tags.join(' ') }).toString() }}>{tags.size !== 0 ? tags.join(',') : '(なし)'}</Link>
          </Paper>).toArray()
        : <Paper>
          お気に入りタグがありません。
          <br />
          <Link to='/topic/search'>検索</Link>
        </Paper>
      : <div>ログインしないと表示出来ません</div>;
  }
}

export const TagFavo = connect((state: Store) => ({ user: state.user }))(_TagFavo);