import * as React from 'react';
import {
  IconButton,
  Slider,
  Checkbox
} from 'material-ui';
import {
  ContentUndo,
  ContentRedo,
  FileFileUpload
} from 'material-ui/svg-icons';
import { Command } from '../utils';
import * as Im from "immutable";
import { ColorPicker } from './color-picker'
import { RGBColor } from 'react-color'

export interface PageProps {
  column: 1 | 2
}

export interface PageState {
}

export class Page extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }


}