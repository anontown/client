import * as React from "react";
import { ng } from "../models";
import {
  TextField,
} from "material-ui";
import { NGBodyEditor } from "./ng-body-editor";

export interface NGEditorProps {
  ng: ng.NG,
  onUpdate: (body: ng.NG) => void;
}
//TODO:expirationDate,chain,transparent
export function NGEditor(props: NGEditorProps) {
  return <div>
    <TextField
      floatingLabelText="名前"
      value={props.ng.name}
      onChange={(_e, v) => props.onUpdate({ ...props.ng, name: v })} />
    <TextField
      floatingLabelText="トピック"
      value={props.ng.topic || ""}
      onChange={(_e, v) => props.onUpdate({ ...props.ng, topic: v || null })} />
    <NGBodyEditor
      value={props.ng.body}
      onChange={v => props.onUpdate({ ...props.ng, body: v })} />
  </div>;
}