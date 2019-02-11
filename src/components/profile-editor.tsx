import { Paper, RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { MdEditor } from "./md-editor";
import * as style from "./profile-editor.scss";
import { profile } from "../gql/_gql/profile";
import { useMutation } from "react-apollo-hooks";
import { updateProfile } from "../gql/profile.gql";
import { updateProfile as updateProfileResult, updateProfileVariables } from "../gql/_gql/updateProfile";
interface ProfileEditorProps {
  profile: profile;
  onUpdate?: (profile: profile) => void;
  userData: UserData;
  style?: React.CSSProperties
}

export const ProfileEditor = (props: ProfileEditorProps) => {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [sn, setSn] = React.useState(props.profile.sn);
  const [name, setName] = React.useState(props.profile.name);
  const [text, setText] = React.useState(props.profile.text);
  const submit = useMutation<updateProfileResult, updateProfileVariables>(updateProfile, {
    variables: {
      id: props.profile.id,
      name: name,
      text: text,
      sn: sn,
    },
  });

  return <Paper className={style.container} style={props.style}>
    <form>
      <Errors errors={errors} />
      <TextField
        fullWidth={true}
        floatingLabelText="ID"
        value={sn}
        onChange={(_e, v) => setSn(v)} />
      <TextField
        fullWidth={true}
        floatingLabelText="名前"
        value={name}
        onChange={(_e, v) => setName(v)} />
      <MdEditor
        fullWidth={true}
        value={text}
        onChange={v => setText(v)} />
      <RaisedButton onClick={() => submit().then(data => {
        if (props.onUpdate) {
          props.onUpdate(data.data!.updateProfile);
        }
        setErrors([]);
      }).catch(_e => {
        setErrors(["エラーが発生しました"]);
      })} label="OK" />
    </form>
  </Paper>;
};