import * as Im from "immutable";
import {
  RaisedButton,
} from "material-ui";
import * as React from "react";

import { Storage, UserData } from "../models";
import { CheckBox } from "./check-box";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import { Select } from "./select";
import { TextField } from "./text-field";
import { res } from "../gql/_gql/res";
import { useInputCache } from "../utils";
import { findProfiles } from "../gql/profile.gql";
import { findProfilesVariables, findProfiles as findProfilesResult } from "../gql/_gql/findProfiles";
import { useQuery, useMutation } from "react-apollo-hooks";
import { createRes as createResResult, createResVariables } from "../gql/_gql/createRes";
import { createRes } from "../gql/res.gql";


interface ResWriteProps {
  onSubmit?: (value: res) => void;
  topic: string;
  reply: string | null;
  userData: UserData;
  changeStorage: (data: Storage) => void;
}

export const ResWrite = (props: ResWriteProps) => {
  function setStorage(data: Storage["topicWrite"]) {
    props.changeStorage({
      ...props.userData.storage,
      topicWrite: data,
    });
  }

  const formDefualt = {
    name: "",
    profile: null as string | null,
    text: "",
    replyText: Im.Map<string, string>(),
    age: true,
  };

  const data = props.userData.storage.topicWrite.get(props.topic, formDefualt);

  const [errors, setErrors] = React.useState<string[]>([]);
  const [textCache, setTextCache] = useInputCache(props.reply === null
    ? data.text
    : data.replyText.get(props.reply, ""), value => {
      if (props.reply === null) {
        setStorage(props.userData.storage.topicWrite.update(props.topic, formDefualt, x => ({
          ...x,
          value,
        })));
      } else {
        const reply = props.reply;
        setStorage(props.userData.storage.topicWrite.update(props.topic, formDefualt, x => ({
          ...x,
          replyText: x.replyText.set(reply, value),
        })));
      }
    });

  const { data: profiles, error } = useQuery<findProfilesResult, findProfilesVariables>(findProfiles, {
    variables: {
      query: {
        self: true
      }
    }
  });

  const mutation = useMutation<createResResult, createResVariables>(createRes, {
    variables: {
      topic: props.topic,
      name: data.name.length !== 0 ? data.name : null,
      text: textCache,
      reply: props.reply,
      profile: data.profile,
      age: data.age,
    }
  });

  const submit = () => {
    mutation().then(x => {
      if (props.onSubmit) {
        props.onSubmit(x.data!.createRes);
      }
      setErrors([]);
      setTextCache("");
    }).catch(() => {
      setErrors(["エラーが発生しました"]);
    });
  };

  return <form>
    <Errors errors={errors} />
    <TextField
      style={{
        marginRight: "3px",
      }}
      placeholder="名前"
      value={data.name}
      onChange={v =>
        setStorage(props.userData.storage.topicWrite
          .update(props.topic, formDefualt, x => ({
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
        setStorage(props.userData.storage.topicWrite
          .update(props.topic, formDefualt, x => ({
            ...x,
            profile: v || null,
          })));
      }}
      options={[
        { value: "", text: "(プロフなし)" },
        ...profiles!.profiles.map(p => ({ value: p.id, text: `●${p.sn} ${p.name}` })),
      ]} />
    <CheckBox
      value={data.age}
      onChange={v =>
        setStorage(props.userData.storage.topicWrite
          .update(props.topic, formDefualt, x => ({
            ...x,
            age: v,
          })))}
      label="Age"
    />
    <MdEditor value={textCache}
      onChange={v => setTextCache(v)}
      maxRows={5}
      minRows={1}
      onKeyDown={e => {
        if ((e.shiftKey || e.ctrlKey) && e.keyCode === 13) {
          e.preventDefault();
          submit();
        }
      }}
      fullWidth={true}
      actions={<RaisedButton onClick={submit}>
        書き込む
      </RaisedButton>} />
  </form>;
};
