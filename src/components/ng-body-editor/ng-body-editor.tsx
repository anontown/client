import * as React from "react";
import * as uuid from "uuid";
import { ng } from "../../models";
import {
  List,
  ListItem,
  SelectField,
  MenuItem,
  TextField,
  IconButton,
  FontIcon,
} from "material-ui";
import * as Im from "immutable";
import { list } from "../../utils";
import { NGMatcherEditor } from "./ng-matcher-editor";

export interface NGBodysEditorProps {
  values: Im.List<ng.NGBody>,
  onChange: (body: Im.List<ng.NGBody>) => void;
}
function NGBodysEditor(props: NGBodysEditorProps): React.ReactElement<any> {
  return <div>
    <IconButton onClick={() => props.onChange(props.values.insert(0, ng.createDefaultBody()))}>
      <FontIcon className="material-icons">add_circle</FontIcon>
    </IconButton>
    <List>
      {props.values.map(ng => <ListItem key={ng.id}>
        <IconButton onClick={() => props.onChange(props.values.filter(x => x.id !== ng.id))}>
          <FontIcon className="material-icons">close</FontIcon>
        </IconButton>
        <NGBodyEditor
          value={ng}
          onChange={x => props.onChange(list.update(props.values, x))} />
      </ListItem>)}
    </List>
  </div>;
}

export interface NGBodyEditorProps {
  value: ng.NGBody,
  onChange: (body: ng.NGBody) => void;
}

export function NGBodyEditor(props: NGBodyEditorProps): React.ReactElement<any> {
  return <div>
    <SelectField
      floatingLabelText="タイプ"
      value={props.value.type}
      onChange={(_e, _i, type) => {
        switch (type) {
          case "not":
            props.onChange({
              id: uuid.v4(),
              type: "not",
              body: ng.createDefaultBody(),
            });
            break;
          case "and":
            props.onChange({
              id: uuid.v4(),
              type: "and",
              body: Im.List()
            });
            break;
          case "or":
            props.onChange({
              id: uuid.v4(),
              type: "or",
              body: Im.List()
            });
            break;
          case "profile":
            props.onChange({
              id: uuid.v4(),
              type: "profile",
              profile: ""
            });
            break;
          case "hash":
            props.onChange({
              id: uuid.v4(),
              type: "hash",
              hash: ""
            });
            break;
          case "body":
            props.onChange({
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
            props.onChange({
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
            props.onChange({
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
    </SelectField>
    {props.value.type === "not" ? <NGNotNodeEditor value={props.value} onChange={v => props.onChange(v)} />
      : props.value.type === "and" ? <NGAndNodeEditor
        value={props.value}
        onChange={v => props.onChange(v)} />
        : props.value.type === "or" ? <NGOrNodeEditor
          value={props.value}
          onChange={v => props.onChange(v)} />
          : props.value.type === "profile" ? <NGProfileNodeEditor
            value={props.value}
            onChange={v => props.onChange(v)} />
            : props.value.type === "hash" ? <NGHashNodeEditor
              value={props.value}
              onChange={v => props.onChange(v)} />
              : props.value.type === "body" ? <NGBodyNodeEditor
                value={props.value}
                onChange={v => props.onChange(v)} />
                : props.value.type === "name" ? <NGNameNodeEditor
                  value={props.value}
                  onChange={v => props.onChange(v)} />
                  : props.value.type === "vote" ? <NGVoteNodeEditor
                    value={props.value}
                    onChange={v => props.onChange(v)} />
                    : null}
  </div>;
}

export interface NGOrNodeEditorProps {
  value: ng.NGBodyOr;
  onChange: (body: ng.NGBodyOr) => void;
}

export interface NGOrNodeEditorState {

}

export class NGOrNodeEditor extends React.Component<NGOrNodeEditorProps, NGOrNodeEditorState>{
  constructor(props: NGOrNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGBodysEditor values={this.props.value.body} onChange={newBody => {
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
}

export interface NGAndNodeEditorState {

}

export class NGAndNodeEditor extends React.Component<NGAndNodeEditorProps, NGAndNodeEditorState>{
  constructor(props: NGAndNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGBodysEditor values={this.props.value.body} onChange={newBody => {
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
}

export interface NGNotNodeEditorState {

}

export class NGNotNodeEditor extends React.Component<NGNotNodeEditorProps, NGNotNodeEditorState>{
  constructor(props: NGNotNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGBodyEditor value={this.props.value.body} onChange={newBody => {
      this.props.onChange({
        ...this.props.value,
        body: newBody
      });
    }} />;
  }
}

export interface NGProfileNodeEditorProps {
  value: ng.NGBodyProfile;
  onChange: (body: ng.NGBodyProfile) => void;
}

export interface NGProfileNodeEditorState {

}

export class NGProfileNodeEditor extends React.Component<NGProfileNodeEditorProps, NGProfileNodeEditorState>{
  constructor(props: NGProfileNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <TextField
      floatingLabelText="ID"
      value={this.props.value.profile}
      onChange={(_e, v) => {
        this.props.onChange({
          ...this.props.value,
          profile: v
        });
      }} />;
  }
}

export interface NGHashNodeEditorProps {
  value: ng.NGBodyHash;
  onChange: (body: ng.NGBodyHash) => void;
}

export interface NGHashNodeEditorState {

}

export class NGHashNodeEditor extends React.Component<NGHashNodeEditorProps, NGHashNodeEditorState>{
  constructor(props: NGHashNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <TextField
      floatingLabelText="HASH"
      value={this.props.value.hash}
      onChange={(_e, v) => {
        this.props.onChange({
          ...this.props.value,
          hash: v
        });
      }} />;
  }
}

export interface NGBodyNodeEditorProps {
  value: ng.NGBodyBody;
  onChange: (body: ng.NGBodyBody) => void;
}

export interface NGBodyNodeEditorState {

}

export class NGBodyNodeEditor extends React.Component<NGBodyNodeEditorProps, NGBodyNodeEditorState>{
  constructor(props: NGBodyNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGMatcherEditor
      floatingLabelText="本文"
      matcher={this.props.value.matcher}
      onChange={v => {
        this.props.onChange({
          ...this.props.value,
          matcher: v
        });
      }} />;
  }
}

export interface NGNameNodeEditorProps {
  value: ng.NGBodyName;
  onChange: (body: ng.NGBodyName) => void;
}

export interface NGNameNodeEditorState {

}

export class NGNameNodeEditor extends React.Component<NGNameNodeEditorProps, NGNameNodeEditorState>{
  constructor(props: NGNameNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <NGMatcherEditor
      floatingLabelText="名前"
      matcher={this.props.value.matcher}
      onChange={v => {
        this.props.onChange({
          ...this.props.value,
          matcher: v
        });
      }} />;
  }
}

export interface NGVoteNodeEditorProps {
  value: ng.NGBodyVote;
  onChange: (body: ng.NGBodyVote) => void;
}

export interface NGVoteNodeEditorState {

}

export class NGVoteNodeEditor extends React.Component<NGVoteNodeEditorProps, NGVoteNodeEditorState>{
  constructor(props: NGVoteNodeEditorProps) {
    super(props);
    this.state = {};
  }

  render() {
    return <TextField
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
      }} />;
  }
}