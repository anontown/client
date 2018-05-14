import * as api from "@anontown/api-types";
import {
  FontIcon,
  IconButton,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { myInject, UserStore } from "../stores";
import { ClientEditor } from "./client-editor";

interface UnconnectedClientProps {
  client: api.Client;
  onUpdate?: (client: api.Client) => void;
  user: UserStore;
}

export type ClientProps = ObjectOmit<UnconnectedClientProps, "user">;

interface ClientState {
  edit: boolean;
}

export const Client = myInject(["user"], observer(class extends React.Component<UnconnectedClientProps, ClientState> {
  constructor(props: UnconnectedClientProps) {
    super(props);
    this.state = {
      edit: false,
    };
  }

  render() {
    const clientEditor = this.state.edit && this.props.user.data !== null
      ? <ClientEditor client={this.props.client} onUpdate={this.props.onUpdate} userData={this.props.user.data} />
      : null;

    const edit = this.props.user.data !== null && this.props.user.data.token.user === this.props.client.user
      ? <div>
        <IconButton type="button" onClick={() => this.setState({ edit: !this.state.edit })} >
          <FontIcon className="material-icons">edit</FontIcon>
        </IconButton>
        {clientEditor}
      </div >
      : null;

    return (
      <div>
        <h2>{this.props.client.name}</h2>
        <span>{this.props.client.id}</span>
        <span>{this.props.client.url}</span>
        {edit}
      </div>
    );
  }
}));
