import {
  Dialog,
  ListItem,
} from "material-ui";
import * as React from "react";
import { ng } from "../../models";
import { NGMatcherEditor } from "./ng-matcher-editor";

export interface NGNameNodeEditorProps {
  value: ng.NGNodeName;
  onChange: (node: ng.NGNodeName) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGNameNodeEditorState {
}

export class NGNameNodeEditor extends React.Component<NGNameNodeEditorProps, NGNameNodeEditorState> {
  constructor(props: NGNameNodeEditorProps) {
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
        <NGMatcherEditor
          floatingLabelText="名前"
          matcher={this.props.value.matcher}
          onChange={v => {
            this.props.onChange({
              ...this.props.value,
              matcher: v,
            });
          }} />
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        primaryText={`NAME:${this.props.value.matcher.source}`} />
    </>;
  }
}
