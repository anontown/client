import * as React from "react";
import { ng } from "../../models";
import {
  ListItem,
  SelectField,
  MenuItem,
  TextField,
  IconButton,
  FontIcon,
  Dialog,
} from "material-ui";
import * as Im from "immutable";
import { list } from "../../utils";
import { NGMatcherEditor } from "./ng-matcher-editor";

export interface NGBodysEditorState {
}
export interface NGBodysEditorProps {
  values: Im.List<ng.NGBody>,
  onChange: (body: Im.List<ng.NGBody>) => void;
  select: React.ReactNode;
  primaryText: React.ReactNode;
  nestedLevel: number,
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}
export class NGBodysEditor extends React.Component<NGBodysEditorProps, NGBodysEditorState>{
  constructor(props: NGBodysEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <>
      <Dialog
        open={this.props.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.props.changeOpenDialog(false)}>
        {this.props.select}
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        open={true}
        primaryText={<>
          <a onClick={e => {
            e.stopPropagation();
            this.props.onChange(this.props.values.insert(0, ng.createDefaultBody()));
          }}>[+]</a>
          {this.props.primaryText}
        </>}
        autoGenerateNestedIndicator={false}
        nestedItems={this.props.values.map(ng => <NGBodyEditor
          key={ng.id}
          value={ng}
          onChange={x => this.props.onChange(list.update(this.props.values, x))}
          nestedLevel={this.props.nestedLevel + 1}
          rightIconButton={<IconButton
            onClick={() => this.props.onChange(this.props.values.filter(x => x.id !== ng.id))}>
            <FontIcon className="material-icons">close</FontIcon>
          </IconButton>}
        />)
          .toArray()} />
    </>;
  }
}

export interface NGBodyEditorState {
  openDialog: boolean
}

export interface NGBodyEditorProps {
  value: ng.NGBody,
  onChange: (body: ng.NGBody) => void;
  nestedLevel: number
  rightIconButton?: React.ReactElement<any>;
}

export class NGBodyEditor extends React.Component<NGBodyEditorProps, NGBodyEditorState>{
  constructor(props: NGBodyEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render(): React.ReactNode {
    const select = <SelectField
      floatingLabelText="タイプ"
      value={this.props.value.type}
      onChange={(_e, _i, type) => {
        switch (type) {
          case "not":
            this.props.onChange({
              id: this.props.value.id,
              type: "not",
              body: ng.createDefaultBody(),
            });
            break;
          case "and":
            this.props.onChange({
              id: this.props.value.id,
              type: "and",
              body: Im.List()
            });
            break;
          case "or":
            this.props.onChange({
              id: this.props.value.id,
              type: "or",
              body: Im.List()
            });
            break;
          case "profile":
            this.props.onChange({
              id: this.props.value.id,
              type: "profile",
              profile: ""
            });
            break;
          case "hash":
            this.props.onChange({
              id: this.props.value.id,
              type: "hash",
              hash: ""
            });
            break;
          case "body":
            this.props.onChange({
              id: this.props.value.id,
              type: "body",
              matcher: {
                type: "text",
                i: false,
                source: ""
              }
            });
            break;
          case "name":
            this.props.onChange({
              id: this.props.value.id,
              type: "name",
              matcher: {
                type: "text",
                i: false,
                source: ""
              }
            });
            break;
          case "vote":
            this.props.onChange({
              id: this.props.value.id,
              type: "vote",
              value: -5
            });
            break;
        }
      }}
    >
      <MenuItem value={"not"} primaryText="not" />
      <MenuItem value={"and"} primaryText="and" />
      <MenuItem value={"or"} primaryText="or" />
      <MenuItem value={"profile"} primaryText="profile" />
      <MenuItem value={"hash"} primaryText="hash" />
      <MenuItem value={"body"} primaryText="body" />
      <MenuItem value={"name"} primaryText="name" />
      <MenuItem value={"vote"} primaryText="vote" />
    </SelectField>;
    return this.props.value.type === "not" ? <NGNotNodeEditor
      nestedLevel={this.props.nestedLevel}
      rightIconButton={this.props.rightIconButton}
      openDialog={this.state.openDialog}
      changeOpenDialog={v => this.setState({ openDialog: v })}
      value={this.props.value}
      select={select}
      onChange={v => this.props.onChange(v)} />
      : this.props.value.type === "and" ? <NGAndNodeEditor
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        select={select}
        openDialog={this.state.openDialog}
        changeOpenDialog={v => this.setState({ openDialog: v })}
        value={this.props.value}
        onChange={v => this.props.onChange(v)} />
        : this.props.value.type === "or" ? <NGOrNodeEditor
          nestedLevel={this.props.nestedLevel}
          rightIconButton={this.props.rightIconButton}
          select={select}
          openDialog={this.state.openDialog}
          changeOpenDialog={v => this.setState({ openDialog: v })}
          value={this.props.value}
          onChange={v => this.props.onChange(v)} />
          : this.props.value.type === "profile" ? <NGProfileNodeEditor
            nestedLevel={this.props.nestedLevel}
            rightIconButton={this.props.rightIconButton}
            select={select}
            openDialog={this.state.openDialog}
            changeOpenDialog={v => this.setState({ openDialog: v })}
            value={this.props.value}
            onChange={v => this.props.onChange(v)} />
            : this.props.value.type === "hash" ? <NGHashNodeEditor
              nestedLevel={this.props.nestedLevel}
              rightIconButton={this.props.rightIconButton}
              select={select}
              openDialog={this.state.openDialog}
              changeOpenDialog={v => this.setState({ openDialog: v })}
              value={this.props.value}
              onChange={v => this.props.onChange(v)} />
              : this.props.value.type === "body" ? <NGBodyNodeEditor
                nestedLevel={this.props.nestedLevel}
                rightIconButton={this.props.rightIconButton}
                openDialog={this.state.openDialog}
                changeOpenDialog={v => this.setState({ openDialog: v })}
                select={select}
                value={this.props.value}
                onChange={v => this.props.onChange(v)} />
                : this.props.value.type === "name" ? <NGNameNodeEditor
                  nestedLevel={this.props.nestedLevel}
                  rightIconButton={this.props.rightIconButton}
                  openDialog={this.state.openDialog}
                  changeOpenDialog={v => this.setState({ openDialog: v })}
                  select={select}
                  value={this.props.value}
                  onChange={v => this.props.onChange(v)} />
                  : this.props.value.type === "vote" ? <NGVoteNodeEditor
                    nestedLevel={this.props.nestedLevel}
                    rightIconButton={this.props.rightIconButton}
                    select={select}
                    openDialog={this.state.openDialog}
                    changeOpenDialog={v => this.setState({ openDialog: v })}
                    value={this.props.value}
                    onChange={v => this.props.onChange(v)} />
                    : null;
  }
}

export interface NGOrNodeEditorProps {
  value: ng.NGBodyOr;
  onChange: (body: ng.NGBodyOr) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGOrNodeEditorState {

}

export class NGOrNodeEditor extends React.Component<NGOrNodeEditorProps, NGOrNodeEditorState>{
  constructor(props: NGOrNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGBodysEditor
      openDialog={this.props.openDialog}
      changeOpenDialog={this.props.changeOpenDialog}
      select={this.props.select}
      nestedLevel={this.props.nestedLevel}
      rightIconButton={this.props.rightIconButton}
      primaryText="Or"
      values={this.props.value.body} onChange={newBody => {
        this.props.onChange({
          ...this.props.value,
          body: newBody
        });
      }} />;
  }
}

export interface NGAndNodeEditorProps {
  value: ng.NGBodyAnd;
  onChange: (body: ng.NGBodyAnd) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGAndNodeEditorState {

}

export class NGAndNodeEditor extends React.Component<NGAndNodeEditorProps, NGAndNodeEditorState>{
  constructor(props: NGAndNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGBodysEditor
      openDialog={this.props.openDialog}
      changeOpenDialog={this.props.changeOpenDialog}
      nestedLevel={this.props.nestedLevel}
      rightIconButton={this.props.rightIconButton}
      select={this.props.select}
      values={this.props.value.body}
      primaryText="And"
      onChange={newBody => {
        this.props.onChange({
          ...this.props.value,
          body: newBody
        });
      }} />;
  }
}

export interface NGNotNodeEditorProps {
  value: ng.NGBodyNot;
  onChange: (body: ng.NGBodyNot) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGNotNodeEditorState {
}

export class NGNotNodeEditor extends React.Component<NGNotNodeEditorProps, NGNotNodeEditorState>{
  constructor(props: NGNotNodeEditorProps) {
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
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        open={true}
        primaryText="Not"
        autoGenerateNestedIndicator={false}
        nestedItems={[
          <NGBodyEditor
            nestedLevel={this.props.nestedLevel + 1}
            key="node"
            value={this.props.value.body} onChange={newBody => {
              this.props.onChange({
                ...this.props.value,
                body: newBody
              });
            }} />
        ]} />
    </>;
  }
}

export interface NGProfileNodeEditorProps {
  value: ng.NGBodyProfile;
  onChange: (body: ng.NGBodyProfile) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGProfileNodeEditorState {
}

export class NGProfileNodeEditor extends React.Component<NGProfileNodeEditorProps, NGProfileNodeEditorState>{
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
              profile: v
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

export interface NGHashNodeEditorProps {
  value: ng.NGBodyHash;
  onChange: (body: ng.NGBodyHash) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGHashNodeEditorState {
}

export class NGHashNodeEditor extends React.Component<NGHashNodeEditorProps, NGHashNodeEditorState>{
  constructor(props: NGHashNodeEditorProps) {
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
          floatingLabelText="HASH"
          value={this.props.value.hash}
          onChange={(_e, v) => {
            this.props.onChange({
              ...this.props.value,
              hash: v
            });
          }} />
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        primaryText={`HASH:${this.props.value.hash}`} />
    </>;
  }
}

export interface NGBodyNodeEditorProps {
  value: ng.NGBodyBody;
  onChange: (body: ng.NGBodyBody) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGBodyNodeEditorState {
}

export class NGBodyNodeEditor extends React.Component<NGBodyNodeEditorProps, NGBodyNodeEditorState>{
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
              matcher: v
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

export interface NGNameNodeEditorProps {
  value: ng.NGBodyName;
  onChange: (body: ng.NGBodyName) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGNameNodeEditorState {
}

export class NGNameNodeEditor extends React.Component<NGNameNodeEditorProps, NGNameNodeEditorState>{
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
              matcher: v
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

export interface NGVoteNodeEditorProps {
  value: ng.NGBodyVote;
  onChange: (body: ng.NGBodyVote) => void;
  select: JSX.Element;
  nestedLevel: number;
  rightIconButton?: React.ReactElement<any>;
  openDialog: boolean,
  changeOpenDialog: (v: boolean) => void;
}

export interface NGVoteNodeEditorState {
}

export class NGVoteNodeEditor extends React.Component<NGVoteNodeEditorProps, NGVoteNodeEditorState>{
  constructor(props: NGVoteNodeEditorProps) {
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
          floatingLabelText="しきい値"
          type="number"
          value={this.props.value.value.toString()}
          onChange={(_e, v) => {
            const newV = +v;
            if (this.props.value.type === "vote" && !isNaN(newV)) {
              this.props.onChange({
                ...this.props.value,
                value: newV
              });
            }
          }} />
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        rightIconButton={this.props.rightIconButton}
        onClick={() => this.props.changeOpenDialog(true)}
        primaryText={`Vote:${this.props.value.value}`} />
    </>;
  }
}