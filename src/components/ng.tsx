import {
  Dialog,
  FontIcon,
  IconButton,
  List,
  ListItem,
} from "material-ui";
import * as React from "react";
import { ng } from "../models";
import { myInject, UserStore } from "../stores";
import { list } from "../utils";
import { NGEditor } from "./ng-editor";
import { observer } from "mobx-react";

interface NGProps {
  user: UserStore;
}

interface NGState {
  dialog: string | null;
}

export const NG = myInject(["user"], observer(class extends React.Component<NGProps, NGState> {
  constructor(props: NGProps) {
    super(props);
    this.state = {
      dialog: null,
    };
  }

  render() {
    const user = this.props.user.data;
    return user !== null
      ? <div>
        <IconButton onClick={() => this.props.user.setData({
          ...user, storage: {
            ...user.storage,
            ng: user.storage.ng.insert(0, ng.createDefaultNG()),
          },
        })}>
          <FontIcon className="material-icons">add_circle</FontIcon>
        </IconButton>
        <List>
          {user.storage.ng.map(node =>
            <ListItem
              rightIconButton={<IconButton onClick={() => this.props.user.setData({
                ...user, storage: {
                  ...user.storage,
                  ng: user.storage.ng.filter(x => x.id !== node.id),
                },
              })}>
                <FontIcon className="material-icons">close</FontIcon>
              </IconButton>}
              onClick={() => this.setState({ dialog: node.id })}
              key={node.id}
              primaryText={node.name}>
              <Dialog
                title={node.name}
                open={this.state.dialog === node.id}
                autoScrollBodyContent={true}
                onRequestClose={() => this.setState({ dialog: null })}>
                <NGEditor
                  ng={node}
                  onUpdate={v => this.props.user.setData({
                    ...user, storage: {
                      ...user.storage,
                      ng: list.update(user.storage.ng, v),
                    },
                  })} />
              </Dialog>
            </ListItem>)}
        </List>
      </div>
      : <div>ログインして下さい</div>;
  }
}));
