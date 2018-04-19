import {
  Paper,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { myInject, UserStore } from "../stores";
import * as style from "./tag-favo.scss";
import { TagsLink } from "./tags-link";

interface UnconnectedTagFavoProps {
  user: UserStore;
}

export type TagFavoProps = ObjectOmit<UnconnectedTagFavoProps, "user">;

interface TagFavoState {
}

export const TagFavo = myInject(["user"],
  observer(class extends React.Component<UnconnectedTagFavoProps, TagFavoState> {
    constructor(props: UnconnectedTagFavoProps) {
      super(props);
    }

    render() {
      return <Paper className={style.container}>
        {this.props.user.data !== null
          ? this.props.user.data.storage.tagsFavo.size !== 0 ?
            this.props.user.data.storage.tagsFavo.map(tags =>
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
  }));
