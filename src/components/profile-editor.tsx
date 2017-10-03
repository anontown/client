import * as React from 'react';
import * as api from '@anontown/api-types'
import { Errors } from './errors';
import { TextField, RaisedButton } from 'material-ui';

export interface Props {
  profile: api.Profile | null,
  onUpdate?: (profile: api.Profile) => void,
  errors: string[],
  onAdd?: (value: State) => void
}

export interface State {
  sn: string,
  name: string,
  body: string,
}

export class ProfileEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sn: props.profile !== null ? props.profile.sn : '',
      name: props.profile !== null ? props.profile.name : '',
      body: props.profile !== null ? props.profile.body : ''
    }
  }

  render() {
    return (
      <form onSubmit={() => this.ok}>
        <Errors errors={this.props.errors} />
        <TextField floatingLabelText="ID" value={this.state.sn} onChange={(_e, v) => this.setState({ sn: v })} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <TextField multiLine={true} value={this.state.body} onChange={(_e, v) => this.setState({ body: v })} />
        <RaisedButton type="submit" label="OK" />
      </form>
    );
  }

  ok() {
    if (this.props.profile !== null) {
      if (this.props.onUpdate !== undefined) {
        this.props.onUpdate({ ...this.props.profile, ...this.state });
      }
    } else {
      if (this.props.onAdd !== undefined) {
        this.props.onAdd(this.state);
      }
    }
  }
}