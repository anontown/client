import * as React from "react";
import * as uuid from "uuid";
import { ng } from "../../models";
import {
  ListItem,
  SelectField,
  MenuItem,
  TextField,
  IconButton,
  FontIcon,
  Dialog
} from "material-ui";
import * as Im from "immutable";
import { list } from "../../utils";
import { NGMatcherEditor } from "./ng-matcher-editor";

export interface NGBodysEditorState {
  openDialog: boolean
}
export interface NGBodysEditorProps {
  values: Im.List<ng.NGBody>,
  onChange: (body: Im.List<ng.NGBody>) => void;
  select: React.ReactNode;
  primaryText: React.ReactNode;
  nestedLevel: number
}
export class NGBodysEditor extends React.Component<NGBodysEditorProps, NGBodysEditorState>{
  constructor(props: NGBodysEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    /*
    <IconButton onClick={() => this.props.onChange(this.props.values.filter(x => x.id !== this.props..id))}>
        <FontIcon className="material-icons">close</FontIcon>
      </IconButton>
    */
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
        {this.props.select}
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        onClick={() => this.setState({ openDialog: true })}
        open={true}
        primaryText={this.props.primaryText}
        rightIconButton={<IconButton onClick={() => this.props.onChange(this.props.values.insert(0, ng.createDefaultBody()))}>
          <FontIcon className="material-icons">add_circle</FontIcon>
        </IconButton>}
        nestedItems={this.props.values.map(ng => <NGBodyEditor
          key={ng.id}
          value={ng}
          onChange={x => this.props.onChange(list.update(this.props.values, x))}
          nestedLevel={this.props.nestedLevel + 1}
        />)
          .toArray()} />
    </React.Fragment>;
  }
}

export interface NGBodyEditorState {

}

export interface NGBodyEditorProps {
  value: ng.NGBody,
  onChange: (body: ng.NGBody) => void;
  nestedLevel: number
}

export class NGBodyEditor extends React.Component<NGBodyEditorProps, NGBodyEditorState>{
  constructor(props: NGBodyEditorProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    const select = <SelectField
      floatingLabelText="タイプ"
      value={this.props.value.type}
      onChange={(_e, _i, type) => {
        console.log(type);
        switch (type) {
          case "not":
            this.props.onChange({
              id: uuid.v4(),
              type: "not",
              body: ng.createDefaultBody(),
            });
            break;
          case "and":
            this.props.onChange({
              id: uuid.v4(),
              type: "and",
              body: Im.List()
            });
            break;
          case "or":
            this.props.onChange({
              id: uuid.v4(),
              type: "or",
              body: Im.List()
            });
            break;
          case "profile":
            this.props.onChange({
              id: uuid.v4(),
              type: "profile",
              profile: ""
            });
            break;
          case "hash":
            this.props.onChange({
              id: uuid.v4(),
              type: "hash",
              hash: ""
            });
            break;
          case "body":
            this.props.onChange({
              id: uuid.v4(),
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
              id: uuid.v4(),
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
              id: uuid.v4(),
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
      value={this.props.value}
      select={select}
      onChange={v => this.props.onChange(v)} />
      : this.props.value.type === "and" ? <NGAndNodeEditor
        nestedLevel={this.props.nestedLevel}
        select={select}
        value={this.props.value}
        onChange={v => this.props.onChange(v)} />
        : this.props.value.type === "or" ? <NGOrNodeEditor
          nestedLevel={this.props.nestedLevel}
          select={select}
          value={this.props.value}
          onChange={v => this.props.onChange(v)} />
          : this.props.value.type === "profile" ? <NGProfileNodeEditor
            nestedLevel={this.props.nestedLevel}
            select={select}
            value={this.props.value}
            onChange={v => this.props.onChange(v)} />
            : this.props.value.type === "hash" ? <NGHashNodeEditor
              nestedLevel={this.props.nestedLevel}
              select={select}
              value={this.props.value}
              onChange={v => this.props.onChange(v)} />
              : this.props.value.type === "body" ? <NGBodyNodeEditor
                nestedLevel={this.props.nestedLevel}
                select={select}
                value={this.props.value}
                onChange={v => this.props.onChange(v)} />
                : this.props.value.type === "name" ? <NGNameNodeEditor
                  nestedLevel={this.props.nestedLevel}
                  select={select}
                  value={this.props.value}
                  onChange={v => this.props.onChange(v)} />
                  : this.props.value.type === "vote" ? <NGVoteNodeEditor
                    nestedLevel={this.props.nestedLevel}
                    select={select}
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
}

export interface NGOrNodeEditorState {

}

export class NGOrNodeEditor extends React.Component<NGOrNodeEditorProps, NGOrNodeEditorState>{
  constructor(props: NGOrNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGBodysEditor select={this.props.select}
      nestedLevel={this.props.nestedLevel}
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
      nestedLevel={this.props.nestedLevel}
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
}

export interface NGNotNodeEditorState {
  openDialog: boolean
}

export class NGNotNodeEditor extends React.Component<NGNotNodeEditorProps, NGNotNodeEditorState>{
  constructor(props: NGNotNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
        {this.props.select}
      </Dialog>
      <ListItem
        nestedLevel={this.props.nestedLevel}
        onClick={() => this.setState({ openDialog: true })}
        open={true}
        primaryText="Not"
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
    </React.Fragment>;
  }
}

export interface NGProfileNodeEditorProps {
  value: ng.NGBodyProfile;
  onChange: (body: ng.NGBodyProfile) => void;
  select: JSX.Element;
  nestedLevel: number;
}

export interface NGProfileNodeEditorState {
  openDialog: boolean
}

export class NGProfileNodeEditor extends React.Component<NGProfileNodeEditorProps, NGProfileNodeEditorState>{
  constructor(props: NGProfileNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
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
        onClick={() => this.setState({ openDialog: true })}
        primaryText={`Profile:${this.props.value.profile}`} />
    </React.Fragment>;
  }
}

export interface NGHashNodeEditorProps {
  value: ng.NGBodyHash;
  onChange: (body: ng.NGBodyHash) => void;
  select: JSX.Element;
  nestedLevel: number;
}

export interface NGHashNodeEditorState {
  openDialog: boolean
}

export class NGHashNodeEditor extends React.Component<NGHashNodeEditorProps, NGHashNodeEditorState>{
  constructor(props: NGHashNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
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
        onClick={() => this.setState({ openDialog: true })}
        primaryText={`HASH:${this.props.value.hash}`} />
    </React.Fragment>;
  }
}

export interface NGBodyNodeEditorProps {
  value: ng.NGBodyBody;
  onChange: (body: ng.NGBodyBody) => void;
  select: JSX.Element;
  nestedLevel: number;
}

export interface NGBodyNodeEditorState {
  openDialog: boolean
}

export class NGBodyNodeEditor extends React.Component<NGBodyNodeEditorProps, NGBodyNodeEditorState>{
  constructor(props: NGBodyNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
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
        onClick={() => this.setState({ openDialog: true })}
        primaryText={`BODY:${this.props.value.matcher.source}`} />
    </React.Fragment>;
  }
}

export interface NGNameNodeEditorProps {
  value: ng.NGBodyName;
  onChange: (body: ng.NGBodyName) => void;
  select: JSX.Element;
  nestedLevel: number;
}

export interface NGNameNodeEditorState {
  openDialog: boolean
}

export class NGNameNodeEditor extends React.Component<NGNameNodeEditorProps, NGNameNodeEditorState>{
  constructor(props: NGNameNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
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
        onClick={() => this.setState({ openDialog: true })}
        primaryText={`NAME:${this.props.value.matcher.source}`} />
    </React.Fragment>;
  }
}

export interface NGVoteNodeEditorProps {
  value: ng.NGBodyVote;
  onChange: (body: ng.NGBodyVote) => void;
  select: JSX.Element;
  nestedLevel: number;
}

export interface NGVoteNodeEditorState {
  openDialog: boolean
}

export class NGVoteNodeEditor extends React.Component<NGVoteNodeEditorProps, NGVoteNodeEditorState>{
  constructor(props: NGVoteNodeEditorProps) {
    super(props);
    this.state = {
      openDialog: false
    };
  }

  render() {
    return <React.Fragment>
      <Dialog
        open={this.state.openDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ openDialog: false })}>
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
        onClick={() => this.setState({ openDialog: true })}
        primaryText={`VOTE:${this.props.value}`} />
    </React.Fragment>;
  }
}