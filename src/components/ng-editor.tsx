import * as React from "react";
import * as uuid from "uuid";
import { ng } from "../models";
import {
  Paper,
  SelectField,
  MenuItem,
  TextField,
  Checkbox
} from "material-ui";
import * as Im from "immutable";
import { list } from "../utils";
import { NGBodyEditor } from "./ng-body-editor";

export interface NGEditorProps {
  ng: ng.NG,
  onUpdate: (body: ng.NG) => void;
}

export function NGEditor(props: NGEditorProps) {
  return <div>
    <TextField
      floatingLabelText="名前"
      value={props.ng.name}
      onChange={(_e, v) => props.onUpdate({ ...props.ng, name: v })} />
    <TextField
      floatingLabelText="トピック"
      value={props.ng.topic}
      onChange={(_e, v) => props.onUpdate({ ...props.ng, topic: v || null })} />
    <NGBodyEditor
      ngBody={props.ng.body}
      onUpdateNGBody={v => props.onUpdate({ ...props.ng, body: v })} />
  </div>;
}