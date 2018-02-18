import {
  Dialog,
  ListItem,
  TextField,
} from "material-ui";
import * as React from "react";
import { ng } from "../../models";

export interface NGProfileNodeEditorProps {
  value: ng.NGNodeProfile;
  onChange: (node: ng.NGNodeProfile) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGProfileNodeEditorState {
}

export class NGProfileNodeEditor extends React.Component<NGProfileNodeEditorProps, NGProfileNodeEditorState> {
  constructor(props: NGProfileNodeEditorProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <>
      <Dialog
        open={this.props.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.props.changeOpenDialog(false)}>
        {this.props.select}
        <TextField
          floatingLabelText="ID"
          value={this.props.value.profile}
          onChange={(_e, v) => {
            this.props.onChange({
              ...this.props.value,
              profile: v,
            });
          }} />
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        primaryText={`Profile:${this.props.value.profile}`} />
    </>;
  }
}