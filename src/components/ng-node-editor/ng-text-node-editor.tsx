import {
  Dialog,
  ListItem,
} from "material-ui";
import * as React from "react";
import { ng } from "../../models";
import { NGMatcherEditor } from "./ng-matcher-editor";

export interface NGTextNodeEditorProps {
  value: ng.NGNodeText;
  onChange: (node: ng.NGNodeText) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGTextNodeEditorState {
}

export class NGTextNodeEditor extends React.Component<NGTextNodeEditorProps, NGTextNodeEditorState> {
  constructor(props: NGTextNodeEditorProps) {
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
          floatingLabelText="本文"
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
        primaryText={`Text:${this.props.value.matcher.source}`} />
    </>;
  }
}
