import * as React from 'react';
import * as api from '@anontown/api-types'
import { Errors } from './errors';
import { TextField, RaisedButton } from 'material-ui';

export interface ClientEditorProps {
  client: api.Client | null,
  onUpdate?: (client: api.Client) => void,
  errors: string[],
  onAdd?: (value: ClientEditorState) => void
}

export interface ClientEditorState {
  url: string,
  name: string
}

export class ClientEditor extends React.Component<ClientEditorProps, ClientEditorState> {
  constructor(props: ClientEditorProps) {
    super(props);
    this.state = {
      url: props.client !== null ? props.client.url : '',
      name: props.client !== null ? props.client.name : ''
    }
  }

  render() {
    return (
      <form onSubmit={() => this.ok}>
        <Errors errors={this.props.errors} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <TextField floatingLabelText="url" value={this.state.url} onChange={(_e, v) => this.setState({ url: v })} />
        <RaisedButton type="submit" label="OK" />
      </form>
    );
  }

  ok() {
    if (this.props.client !== null) {
      if (this.props.onUpdate !== undefined) {
        this.props.onUpdate({ ...this.props.client, ...this.state });
      }
    } else {
      if (this.props.onAdd !== undefined) {
        this.props.onAdd(this.state);
      }
    }
  }
}