import { Paper, RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import * as style from "./profile-add.scss";
import { profile } from "../gql/_gql/profile";

interface ProfileAddProps {
  onAdd?: (profile: profile) => void;
  userData: UserData;
  style?: React.CSSProperties
}

interface ProfileAddState {
  errors: string[];
  sn: string;
  name: string;
  text: string;
}

export class ProfileAdd extends React.Component<ProfileAddProps, ProfileAddState> {
  constructor(props: ProfileAddProps) {
    super(props);
    this.state = {
      errors: [],
      sn: "",
      name: "",
      text: "",
    };
  }

  render() {
    return <Paper className={style.container} style={this.props.style}>
      <form>
        <Errors errors={this.state.errors} />
        <TextField
          fullWidth={true}
          floatingLabelText="ID"
          value={this.state.sn}
          onChange={(_e, v) => this.setState({ sn: v })} />
        <TextField
          fullWidth={true}
          floatingLabelText="名前"
          value={this.state.name}
          onChange={(_e, v) => this.setState({ name: v })} />
        <MdEditor
          fullWidth={true}
          value={this.state.text}
          onChange={v => this.setState({ text: v })} />
        <RaisedButton onClick={() => this.submit()} label="OK" />
      </form>
    </Paper>;
  }

  async submit() {
    try {
      const profile = await apiClient.createProfile(this.props.userData.token, {
        name: this.state.name,
        text: this.state.text,
        sn: this.state.sn,
      });

      if (this.props.onAdd) {
        this.props.onAdd(profile);
      }
      this.setState({ errors: [] });
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }
}