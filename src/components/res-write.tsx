import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import {
  Checkbox,
  FontIcon,
  IconButton,
  MenuItem,
  SelectField,
  TextField,
} from "material-ui";
import * as React from "react";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { UserData } from "../models";

interface ResWriteProps {
  onSubmit?: (value: api.Res) => void;
  topic: string;
  reply: string | null;
  userData: UserData;
}


interface ResWriteState {
  errors?: string[];
  text: string;
  name: string;
  profile: string | null;
  age: boolean;
}

export class ResWrite extends React.Component<ResWriteProps, ResWriteState> {
  constructor(props: ResWriteProps) {
    super(props);
    this.state = {
      text: "",
      name: "",
      profile: null,
      age: true,
    };
  }

  async onSubmit() {
    try {
      const res = await apiClient.createRes(this.props.userData.token, {
        topic: this.props.topic,
        name: this.state.name.length !== 0 ? this.state.name : null,
        text: this.state.text,
        reply: this.props.reply,
        profile: this.state.profile,
        age: this.state.age,
      });

      if (this.props.onSubmit) {
        this.props.onSubmit(res);
      }
      this.setState({ errors: [], text: "" });
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }

  render() {
    return <form>
      <Errors errors={this.state.errors} />
      <TextField
        floatingLabelText="名前"
        value={this.state.name}
        onChange={(_e, v) => this.setState({ name: v })} />
      <SelectField
        floatingLabelText="プロフ"
        value={this.state.profile}
        onChange={(_e, _i, v) => this.setState({ profile: v })}>
        <MenuItem value={null} primaryText="なし" />
        {this.props.userData.profiles.map(p =>
          <MenuItem
            key={p.id}
            value={p.id}
            primaryText={`●${p.sn} ${p.name}`} />)}
      </SelectField>
      <Checkbox
        label="age"
        checked={this.state.age}
        onCheck={(_e, v) => this.setState({ age: v })} />
      <MdEditor value={this.state.text}
        onChange={v => this.setState({ text: v })}
        maxRows={5}
        minRows={1}
        onKeyDown={e => {
          if ((e.shiftKey || e.ctrlKey) && e.keyCode === 13) {
            e.preventDefault();
            this.onSubmit();
          }
        }}
        fullWidth />
      <IconButton onClick={() => this.onSubmit()}>
        <FontIcon className="material-icons">arrow_forward</FontIcon>
      </IconButton>
    </form>;
  }
}
