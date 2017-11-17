import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";

interface _ProfileEditorProps {
  profile: api.Profile | null;
  onUpdate?: (profile: api.Profile) => void;
  onAdd?: (profile: api.Profile) => void;
  user: UserData | null;
}

export type ProfileEditorProps = ObjectOmit<_ProfileEditorProps, "user">;

interface ProfileEditorState {
  errors: string[];
  sn: string;
  name: string;
  body: string;
}

class _ProfileEditor extends React.Component<_ProfileEditorProps, ProfileEditorState> {
  constructor(props: _ProfileEditorProps) {
    super(props);
    this.state = {
      errors: [],
      sn: props.profile !== null ? props.profile.sn : "",
      name: props.profile !== null ? props.profile.name : "",
      body: props.profile !== null ? props.profile.text : "",
    };
  }

  public render() {
    return this.props.user !== null
      ? <form onSubmit={() => this.submit()}>
        <Errors errors={this.state.errors} />
        <TextField floatingLabelText="ID" value={this.state.sn} onChange={(_e, v) => this.setState({ sn: v })} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <MdEditor value={this.state.body} onChange={(v) => this.setState({ body: v })} />
        <RaisedButton type="submit" label="OK" />
      </form>
      : <div>ログインして下さい</div>;
  }

  public submit() {
    if (this.props.user === null) {
      return;
    }

    if (this.props.profile !== null) {
      apiClient.updateProfile(this.props.user.token, {
        id: this.props.profile.id,
        name: this.state.name,
        text: this.state.body,
        sn: this.state.sn,
      }).subscribe((profile) => {
        if (this.props.onUpdate) {
          this.props.onUpdate(profile);
        }
        this.setState({ errors: [] });
      }, (error) => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map((e) => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    } else {
      apiClient.createProfile(this.props.user.token, {
        name: this.state.name,
        text: this.state.body,
        sn: this.state.sn,
      }).subscribe((profile) => {
        if (this.props.onAdd) {
          this.props.onAdd(profile);
        }
        this.setState({ errors: [] });
      }, (error) => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map((e) => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    }
  }
}

export const ProfileEditor = connect((state: Store) => ({ user: state.user }))(_ProfileEditor);
