import * as React from 'react';
import * as api from '@anontown/api-types'
import { Paper, IconButton } from 'material-ui';
import { EditorModeEdit } from 'material-ui/svg-icons';
import { ClientEditor } from './client-editor';

export interface Props {
  client: api.Client,
  userID: string | null,
  onUpdate: (client: api.Client) => void,
  errors: string[]
}

export interface State {
  edit: boolean
}

export class Client extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      edit: false
    }
  }

  render() {
    let clientEditor = this.state.edit
      ? <ClientEditor client={this.props.client} onUpdate={this.props.onUpdate} errors={this.props.errors} />
      : null;

    let edit = this.props.userID !== null && this.props.userID === this.props.client.user
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