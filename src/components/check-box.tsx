import * as React from "react";
import * as style from "./check-box.scss";

interface CheckBoxProps {
  value: boolean;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  onChange: (v: boolean) => void;
  label: string;
}

export function CheckBox(props: CheckBoxProps) {
  return (
    <label
      style={props.labelStyle}>
      <input
        type="checkbox"
        checked={props.value}
        style={props.style}
        className={style.checkbox}
        onChange={e =>
          props.onChange(e.target.checked)
        } />
      {props.label}
    </label>
  );
}