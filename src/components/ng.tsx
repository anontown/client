import * as React from "react";
import { list } from "../utils";
import { UserStore, appInject } from "../stores";
import { NGEditor } from "./ng-editor";
import {
  IconButton,
  FontIcon,
  Dialog,
  List,
  ListItem
} from "material-ui";
import { ng } from "../models";

interface NGProps {
  user: UserStore
}

interface NGState {
  dialog: string | null
}

export const NG = appInject(class extends React.Component<NGProps, NGState> {
  constructor(props: NGProps) {
    super(props);
    this.state = {
      dialog: null
    }
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
          <FontIcon className="material-icons">add_circle</FontIcon>
        </IconButton>
        <List>
          {user.storage.ng.map(ng =>
            <ListItem
              rightIconButton={<IconButton onClick={() => this.props.user.setData({
                ...user, storage: {
                  ...user.storage,
                  ng: user.storage.ng.filter(x => x.id !== ng.id)
                }
              })}>
                <FontIcon className="material-icons">close</FontIcon>
              </IconButton>}
              onClick={() => this.setState({ dialog: ng.id })}
              key={ng.id}
              primaryText={ng.name}>
              <Dialog
                title={ng.name}
                open={this.state.dialog === ng.id}
                autoScrollBodyContent={true}
                onRequestClose={() => this.setState({ dialog: null })}>
                <NGEditor
                  ng={ng}
                  onUpdate={v => this.props.user.setData({
                    ...user, storage: {
                      ...user.storage,
                      ng: list.update(user.storage.ng, v)
                    }
                  })} />
              </Dialog>
            </ListItem>)}
        </List>
      </div>
      : <div>ログインして下さい</div>;
  }
});
