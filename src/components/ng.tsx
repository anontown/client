import * as React from "react";
import { list } from "../utils";
import { UserStore, appInject } from "../stores";
import { NGEditor } from "./ng-editor";
import {
  IconButton,
  FontIcon,
  Paper
} from "material-ui";
import { ng } from "../models";

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
        <IconButton onClick={() => this.props.user.setData({
          ...user, storage: {
            ...user.storage,
            ng: user.storage.ng.insert(0, ng.createDefaultNG())
          }
        })}>
          <FontIcon className="material-icons">note_add</FontIcon>
        </IconButton>
        {user.storage.ng.map(ng =>
          <Paper key={ng.id}>
            <IconButton onClick={() => this.props.user.setData({
              ...user, storage: {
                ...user.storage,
                ng: user.storage.ng.filter(x => x.id !== ng.id)
              }
            })}>
              <FontIcon className="material-icons">close</FontIcon>
            </IconButton>
            <NGEditor
              ng={ng}
              onUpdate={v => this.props.user.setData({
                ...user, storage: {
                  ...user.storage,
                  ng: list.update(user.storage.ng, v)
                }
              })} />
          </Paper>)}
      </div>
      : <div>ログインして下さい</div>;
  }
});
