import React from 'react';
import {
  MenuItem,
  Menu,
  IconButton
} from 'material-ui';

interface IconMenuState {
  anchorEl: any,
  open: boolean,
}

interface IconMenuProps {
  icon: React.ReactNode,
  createMenu: (onClick: () => void) => React.ReactNode
}

export class IconMenu extends React.Component<IconMenuProps, IconMenuState> {
  constructor(props: IconMenuProps) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
    };
  }

  handleClick = event => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
    this.props.icon
  };

  render() {
    return [
      <IconButton
        key="button"
        onClick={this.handleClick}>
        {this.props.icon}
      </IconButton>,
      <Menu
        key="menu"
        anchorEl={this.state.anchorEl}
        open={this.state.open}
        onRequestClose={this.handleRequestClose}>
        {this.props.createMenu(this.handleRequestClose)}
      </Menu>
    ];
  }
}