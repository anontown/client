import * as React from 'react';
import { AlertError } from 'material-ui/svg-icons';

export interface ErrorsProps {
  errors?: string[]
}

export const Errors = (props: ErrorsProps) => (
  <div>
    {props.errors
      ? props.errors.map(e => <div><AlertError color="warn">error</AlertError> {e}</div>)
      : null}
  </div>
);