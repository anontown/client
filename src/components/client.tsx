import * as React from 'react';
import * as api from '@anontown/api-types'
import { Paper, IconButton } from 'material-ui';
import { EditorModeEdit } from 'material-ui/svg-icons';
import { ClientEditor } from './client-editor';
import { UserData } from "../models";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";

interface _ClientProps {
  client: api.Client,
  onUpdate?: (client: api.Client) => void,
  user: UserData | null
}

export type ClientProps = ObjectOmit<_ClientProps, "user">;

interface ClientState {
  edit: boolean
}

class _Client extends React.Component<_ClientProps, ClientState> {
  constructor(props: _ClientProps) {
    super(props);
    this.state = {
      edit: false
    }
  }

  render() {
    let clientEditor = this.state.edit
      ? <ClientEditor client={this.props.client} onUpdate={this.props.onUpdate} />
      : null;

    let edit = this.props.user !== null && this.props.user.token.user === this.props.client.user
      ? <div>
        <IconButton type="button" onClick={() => this.setState({ edit: !this.state.edit })} >
          <EditorModeEdit />
        </IconButton>
        {clientEditor}
      </div >
      : null;

    return (
      <Paper>
        <h2>{this.props.client.name}</h2>
        <span>{this.props.client.id}</span>
        <span>{this.props.client.url}</span>
        {edit}
      </Paper>
    );
  }
}

export const Client = connect((state: Store) => ({ user: state.user }))(_Client);