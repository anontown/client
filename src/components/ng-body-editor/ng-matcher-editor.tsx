import * as React from "react";
import { ng } from "../../models";
import {
  TextField,
  Checkbox,
} from "material-ui";

export interface NGMatcherEditorProps {
  matcher: ng.NGBodyTextMatcher,
  onChange: (body: ng.NGBodyTextMatcher) => void;
  floatingLabelText?: string;
}
export function NGMatcherEditor(props: NGMatcherEditorProps): React.ReactElement<any> {
  return <div>
    <Checkbox label="正規表現" checked={props.matcher.type === "reg"} onCheck={(_e, v) => {
      if (v) {
        props.onChange({
          ...props.matcher,
          type: "reg",
        });
      } else {
        props.onChange({
          ...props.matcher,
          type: "text",
        });
      }
    }} />
    <Checkbox label="大小文字区別しない" checked={props.matcher.i} onCheck={(_e, v) => {
      props.onChange({
        ...props.matcher,
        i: v
      });
    }} />
    <TextField
      floatingLabelText={props.floatingLabelText}
      value={props.matcher.source}
      onChange={(_e, v) => {
        props.onChange({
          ...props.matcher,
          source: v
        });
      }} />
  </div>;
}