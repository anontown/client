import * as React from 'react';
import { AlertError } from 'material-ui/svg-icons';

export interface Props {
  errors: string[]
}

export interface State {
}

export default class Errors extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.errors.map(e => <div><AlertError color="warn">error</AlertError> {e}</div>)}
      </div>
    );
  }
}