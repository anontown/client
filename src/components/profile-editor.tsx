import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { Paper, RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import * as style from "./profile-editor.scss";
import { UserStore, appInject } from "../stores";

interface UnconnectedProfileEditorProps {
  profile: api.Profile | null;
  onUpdate?: (profile: api.Profile) => void;
  onAdd?: (profile: api.Profile) => void;
  user: UserStore
}

export type ProfileEditorProps = ObjectOmit<UnconnectedProfileEditorProps, "user">;

interface ProfileEditorState {
  errors: string[];
  sn: string;
  name: string;
  body: string;
}

export const ProfileEditor = appInject(class extends React.Component<UnconnectedProfileEditorProps, ProfileEditorState> {
  constructor(props: UnconnectedProfileEditorProps) {
    super(props);
    this.state = {
      errors: [],
      sn: props.profile !== null ? props.profile.sn : "",
      name: props.profile !== null ? props.profile.name : "",
      body: props.profile !== null ? props.profile.text : "",
    };
  }

  render() {
    return this.props.user.data !== null
      ? <Paper className={style.container}>
        <form>
          <Errors errors={this.state.errors} />
          <TextField
            fullWidth
            floatingLabelText="ID"
            value={this.state.sn}
            onChange={(_e, v) => this.setState({ sn: v })} />
          <TextField
            fullWidth
            floatingLabelText="名前"
            value={this.state.name}
            onChange={(_e, v) => this.setState({ name: v })} />
          <MdEditor
            fullWidth
            value={this.state.body}
            onChange={v => this.setState({ body: v })} />
          <RaisedButton onClick={() => this.submit()} label="OK" />
        </form>
      </Paper>
      : <div>ログインして下さい</div>;
  }

  submit() {
    if (this.props.user.data === null) {
      return;
    }

    if (this.props.profile !== null) {
      apiClient.updateProfile(this.props.user.data.token, {
        id: this.props.profile.id,
        name: this.state.name,
        text: this.state.body,
        sn: this.state.sn,
      }).subscribe(profile => {
        if (this.props.onUpdate) {
          this.props.onUpdate(profile);
        }
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    } else {
      apiClient.createProfile(this.props.user.data.token, {
        name: this.state.name,
        text: this.state.body,
        sn: this.state.sn,
      }).subscribe(profile => {
        if (this.props.onAdd) {
          this.props.onAdd(profile);
        }
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    }
  }
});
