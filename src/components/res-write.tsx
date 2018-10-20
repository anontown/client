import * as Im from "immutable";
import {
  RaisedButton,
} from "material-ui";
import * as React from "react";
import * as rx from "rxjs";
import * as op from "rxjs/operators";

import { Storage, UserData } from "../models";
import { CheckBox } from "./check-box";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { Select } from "./select";
import { TextField } from "./text-field";
import { res } from "../gql/_gql/res";

interface ResWriteProps {
  onSubmit?: (value: res) => void;
  topic: string;
  reply: string | null;
  userData: UserData;
  changeStorage: (data: Storage) => void;
}

interface ResWriteState {
  errors?: string[];
  textCache: string;
}

export class ResWrite extends React.Component<ResWriteProps, ResWriteState> {
  formDefualt = {
    name: "",
    profile: null as string | null,
    text: "",
    replyText: Im.Map<string, string>(),
    age: true,
  };

  textUpdate = new rx.Subject<string>();
  subscriptions: rx.Subscription[] = [];

  constructor(props: ResWriteProps) {
    super(props);
    const text = this.props.reply === null
      ? this.getData().text
      : this.getData().replyText.get(this.props.reply, "");
    this.state = {
      textCache: text,
    };
    this.subscriptions.push(this.textUpdate
      .pipe(op.debounceTime(1000))
      .subscribe(value => {
        this.setStorageValue(value);
      }));
  }

  componentWillUnmount() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  getData() {
    return this.props.userData.storage.topicWrite.get(this.props.topic, this.formDefualt);
  }

  setStorageValue(value: string) {
    if (this.props.reply === null) {
      this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({
        ...x,
        value,
      })));
    } else {
      const reply = this.props.reply;
      this.setStorage(this.props.userData.storage.topicWrite.update(this.props.topic, this.formDefualt, x => ({
        ...x,
        replyText: x.replyText.set(reply, value),
      })));
    }
  }

  setStorage(data: Storage["topicWrite"]) {
    this.props.changeStorage({
      ...this.props.userData.storage,
      topicWrite: data,
    });
  }

  setText(text: string) {
    this.setState({ textCache: text });
    this.textUpdate.next(text);
  }

  async onSubmit() {
    const data = this.getData();
    try {
      const res = await apiClient.createRes(this.props.userData.token, {
        topic: this.props.topic,
        name: data.name.length !== 0 ? data.name : null,
        text: this.state.textCache,
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
        style={{
          marginRight: "3px",
        }}
        placeholder="名前"
        value={data.name}
        onChange={v =>
          this.setStorage(this.props.userData.storage.topicWrite
            .update(this.props.topic, this.formDefualt, x => ({
              ...x,
              name: v,
            })))} />
      <Select
        style={{
          marginRight: "3px",
          backgroundColor: "#fff",
        }}
        value={data.profile || ""}
        onChange={v => {
          this.setStorage(this.props.userData.storage.topicWrite
            .update(this.props.topic, this.formDefualt, x => ({
              ...x,
              profile: v || null,
            })));
        }}
        options={[
          { value: "", text: "(プロフなし)" },
          ...this.props.userData.profiles.map(p => ({ value: p.id, text: `●${p.sn} ${p.name}` })),
        ]} />
      <CheckBox
        value={data.age}
        onChange={v =>
          this.setStorage(this.props.userData.storage.topicWrite
            .update(this.props.topic, this.formDefualt, x => ({
              ...x,
              age: v,
            })))}
        label="Age"
      />
      <MdEditor value={this.state.textCache}
        onChange={v => this.setText(v)}
        maxRows={5}
        minRows={1}
        onKeyDown={e => {
          if ((e.shiftKey || e.ctrlKey) && e.keyCode === 13) {
            e.preventDefault();
            this.onSubmit();
          }
        }}
        fullWidth={true}
        actions={<RaisedButton onClick={() => this.onSubmit()}>
          書き込む
      </RaisedButton>} />
    </form>;
  }
}
