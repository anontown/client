import {
  Dialog,
  ListItem,
} from "material-ui";
import * as React from "react";
import { ng } from "../../models";
import { NGMatcherEditor } from "./ng-matcher-editor";

export interface NGBodyNodeEditorProps {
  value: ng.NGNodeBody;
  onChange: (node: ng.NGNodeBody) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean;
  changeOpenDialog: (v: boolean) => void;
}

export interface NGBodyNodeEditorState {
}

export class NGBodyNodeEditor extends React.Component<NGBodyNodeEditorProps, NGBodyNodeEditorState> {
  constructor(props: NGBodyNodeEditorProps) {
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
        primaryText={`Body:${this.props.value.matcher.source}`} />
    </>;
  }
}
