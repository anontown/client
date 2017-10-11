import * as React from 'react';
import * as api from '@anontown/api-types'
import { Errors } from './errors';
import { TextField, RaisedButton } from 'material-ui';
import { UserData } from "../models";
import { apiClient } from "../utils";
import { AtError } from "@anontown/api-client";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";

interface _ProfileEditorProps {
  profile: api.Profile | null,
  onUpdate?: (profile: api.Profile) => void,
  onAdd?: (profile: api.Profile) => void,
  user: UserData | null
}

export type ProfileEditorProps = ObjectOmit<_ProfileEditorProps, "user">;

export interface ProfileEditorState {
  errors: string[],
  sn: string,
  name: string,
  body: string,
}

class _ProfileEditor extends React.Component<_ProfileEditorProps, ProfileEditorState> {
  constructor(props: _ProfileEditorProps) {
    super(props);
    this.state = {
      errors: [],
      sn: props.profile !== null ? props.profile.sn : '',
      name: props.profile !== null ? props.profile.name : '',
      body: props.profile !== null ? props.profile.text : ''
    }
  }

  render() {
    return this.props.user !== null
      ? <form onSubmit={() => this.submit()}>
        <Errors errors={this.state.errors} />
        <TextField floatingLabelText="ID" value={this.state.sn} onChange={(_e, v) => this.setState({ sn: v })} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <TextField multiLine={true} value={this.state.body} onChange={(_e, v) => this.setState({ body: v })} />
        <RaisedButton type="submit" label="OK" />
      </form>
      : <div>ログインして下さい</div>;
  }

  submit() {
    if (this.props.user === null) {
      return;
    }

    if (this.props.profile !== null) {
      apiClient.updateProfile(this.props.user.token, {
        id: this.props.profile.id,
        name: this.state.name,
        text: this.state.body,
        sn: this.state.sn
      }).subscribe(profile => {
        if (this.props.onUpdate) {
          this.props.onUpdate(profile);
        }
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) })
        } else {
          this.setState({ errors: ['エラーが発生しました'] })
        }
      });
    } else {
      apiClient.createProfile(this.props.user.token, {
        name: this.state.name,
        text: this.state.body,
        sn: this.state.sn
      }).subscribe(profile => {
        if (this.props.onAdd) {
          this.props.onAdd(profile);
        }
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) })
        } else {
          this.setState({ errors: ['エラーが発生しました'] })
        }
      });
    }
  }
}

export const ProfileEditor = connect((state: Store) => ({ user: state.user }))(_ProfileEditor);