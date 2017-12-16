import {
  Paper,
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { TagsLink } from "./tags-link";
import * as style from "./tag-favo.scss";

interface UnconnectedTagFavoProps {
  user: UserData | null;
}

export type TagFavoProps = ObjectOmit<UnconnectedTagFavoProps, "user">;

interface TagFavoState {
}

export const TagFavo = connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<UnconnectedTagFavoProps, TagFavoState> {
    constructor(props: UnconnectedTagFavoProps) {
      super(props);
    }

    render() {
      return <Paper className={style.container}>
        {this.props.user !== null
          ? this.props.user.storage.tagsFavo.size !== 0 ?
            this.props.user.storage.tagsFavo.map(tags =>
              <div key={tags.join(",")}>
                <TagsLink tags={tags.toArray()} />
              </div>).toArray()
            : <div>
              お気に入りタグがありません。
              <br />
              <Link to="/topic/search">検索</Link>
            </div>
          : <div>ログインしないと表示出来ません</div>}
      </Paper>;
    }
  });
