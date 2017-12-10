import * as React from "react";
import { FontIcon } from "material-ui";

export interface ErrorsProps {
  errors?: string[];
}

export const Errors = (props: ErrorsProps) => (
  <div>
    {props.errors
      ? props.errors.map( (e, i) => <div key={i.toString()}><FontIcon className="material-icons">error</FontIcon> {e}</div>)
      : null}
  </div>
);
