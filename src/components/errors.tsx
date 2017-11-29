import { AlertError } from "material-ui/svg-icons";
import * as React from "react";

export interface ErrorsProps {
  errors?: string[];
}

export const Errors = (props: ErrorsProps) => (
  <div>
    {props.errors
      ? props.errors.map( (e,i) => <div key={i.toString()}><AlertError color="warn">error</AlertError> {e}</div>)
      : null}
  </div>
);
