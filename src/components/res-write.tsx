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
import { UserData, Storage } from "../models";
import * as Im from "immutable";

interface ResWriteProps {
  onSubmit?: (value: api.Res) => void;
  topic: string;
  reply: string | null;
  userData: UserData;
  changeUserData: (data: UserData) => void;
}


interface ResWriteState {
  errors?: string[];
}

export class ResWrite extends React.Component<ResWriteProps, ResWriteState> {
  constructor(props: ResWriteProps) {
    super(props);
    this.state = {};
  }

  formDefualt = {
    name: "",
    profile: null as string | null,
    text: "",
    replyText: Im.Map<string, string>(),
    age: true,
  };

  getData() {
    return this.props.userData.storage.topicWrite.get(this.props.topic, this.formDefualt);
  }

  getText() {
    if (this.props.reply === null) {
      return this.getData().text;
    } else {
      return this.getData().replyText.get(this.props.reply, "");
    }
  }

  setStorage(data: Storage["topicWrite"]) {
    this.props.changeUserData({
      ...this.props.userData,
      storage: {
        ...this.props.userData.storage,
        topicWrite: data
      }
    });
  }

  setText(text: string) {
    if (this.props.reply === null) {
      this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({
        ...x,
        text: text
      })));
    } else {
      const reply = this.props.reply;
      this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({
        ...x,
        replyText: x.replyText.set(reply, text)
      })));
    }
  }

  async onSubmit() {
    const data = this.getData();
    try {
      const res = await apiClient.createRes(this.props.userData.token, {
        topic: this.props.topic,
        name: data.name.length !== 0 ? data.name : null,
        text: data.text,
        reply: this.props.reply,
        profile: data.profile,
        age: data.age,
      });

      if (this.props.onSubmit) {
        this.props.onSubmit(res);
      }
      this.setState({ errors: [] });
      this.setText("");
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }

  render() {
    const data = this.getData();
    return <form>
      <Errors errors={this.state.errors} />
      <TextField
        floatingLabelText="名前"
        value={data.name}
        onChange={(_e, v) => this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({ ...x, name: v })))} />
      <SelectField
        floatingLabelText="プロフ"
        value={data.profile}
        onChange={(_e, _i, v) => this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({ ...x, profile: v })))}>
        <MenuItem value={null} primaryText="なし" />
        {this.props.userData.profiles.map(p =>
          <MenuItem
            key={p.id}
            value={p.id}
            primaryText={`●${p.sn} ${p.name}`} />)}
      </SelectField>
      <Checkbox
        label="age"
        checked={data.age}
        onCheck={(_e, v) => this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({ ...x, age: v })))} />
      <MdEditor value={this.getText()}
        onChange={v => this.setText(v)}
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
