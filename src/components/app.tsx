import * as React from 'react';

export interface Props {
  value: number,
  onIncClick: () => void,
  onDecClick: () => void
}

export class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.props.onIncClick}>+</button>
        {this.props.value}
        <button type="button" onClick={this.props.onDecClick}>-</button>
      </div>
    );
  }
}