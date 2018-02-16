import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { Paper, RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { list } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import * as style from "./profile-editor.scss";
import { UserStore, appInject } from "../stores";
import { NGEditor } from "./ng-editor";

interface NGProps {
  user: UserStore
}

interface NGState {
}

export const NG = appInject(class extends React.Component<NGProps, NGState> {
  constructor(props: NGProps) {
    super(props);
  }

  render() {
    const user = this.props.user.data;
    return user !== null
      ? <div>
        {user.storage.ng.map(ng =>
          <NGEditor
            key={ng.id}
            ng={ng}
            onUpdate={v => this.props.user.setData({
              ...user, storage: {
                ...user.storage,
                ng: list.update(user.storage.ng, v)
              }
            })} />)}
      </div>
      : <div>ログインして下さい</div>;
  }
});
