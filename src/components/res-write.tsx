import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import {
  Checkbox,
  IconButton,
  MenuItem,
  SelectField,
  TextField,
  FontIcon
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";

interface UnconnectedResWriteProps {
  onSubmit?: (value: api.Res) => void;
  topic: string;
  reply: string | null;
  user: UserData | null;
}

export type ResWriteProps = ObjectOmit<UnconnectedResWriteProps, "user">;

interface ResWriteState {
  errors?: string[];
  body: string;
  name: string;
  profile: string | null;
  age: boolean;
}

export const ResWrite = connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<UnconnectedResWriteProps, ResWriteState> {
    constructor(props: UnconnectedResWriteProps) {
      super(props);
      this.state = {
        body: "",
        name: "",
        profile: null,
        age: true,
      };
    }

    onSubmit() {
      if (this.props.user === null) {
        return;
      }

      apiClient.createRes(this.props.user.token, {
        topic: this.props.topic,
        name: this.state.name.length !== 0 ? this.state.name : null,
        text: this.state.body,
        reply: this.props.reply,
        profile: this.state.profile,
        age: this.state.age,
      }).subscribe(res => {
        if (this.props.onSubmit) {
          this.props.onSubmit(res);
        }
        this.setState({ errors: [], body: "" });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    }

    render() {
      return this.props.user !== null
        ? <form>
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
            {this.props.user.profiles.map(p =>
              <MenuItem
                key={p.id}
                value={p.id}
                primaryText={`●${p.sn} ${p.name}`} />)}
          </SelectField>
          <Checkbox
            label="age"
            checked={this.state.age}
            onCheck={(_e, v) => this.setState({ age: v })} />
          <MdEditor value={this.state.body}
            onChange={v => this.setState({ body: v })}
            maxRows={5}
            minRows={1}
            onKeyPress={e => {
              if (e.shiftKey && e.charCode === 13) {
                e.preventDefault();
                this.onSubmit();
              }
            }}
            fullWidth />
          <IconButton onClick={() => this.onSubmit()}>
            <FontIcon className="material-icons">arrow_forward</FontIcon>
          </IconButton>
        </form>
        : <div>書き込むにはログインが必要です</div>;
    }
  });
