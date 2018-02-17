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
  ngBody: Im.List<ng.NGBody>,
  onUpdateNGBody: (body: Im.List<ng.NGBody>) => void;
}
function NGBodysEditor(props: NGBodysEditorProps): React.ReactElement<any> {
  return <div>
    <IconButton onClick={() => props.onUpdateNGBody(props.ngBody.insert(0, ng.createDefaultBody()))}>
      <FontIcon className="material-icons">add_circle</FontIcon>
    </IconButton>
    <List>
      {props.ngBody.map(ng => <ListItem key={ng.id}>
        <IconButton onClick={() => props.onUpdateNGBody(props.ngBody.filter(x => x.id !== ng.id))}>
          <FontIcon className="material-icons">close</FontIcon>
        </IconButton>
        <NGBodyEditor
          ngBody={ng}
          onUpdateNGBody={x => props.onUpdateNGBody(list.update(props.ngBody, x))} />
      </ListItem>)}
    </List>
  </div>;
}

export interface NGBodyEditorProps {
  ngBody: ng.NGBody,
  onUpdateNGBody: (body: ng.NGBody) => void;
}

export function NGBodyEditor(props: NGBodyEditorProps): React.ReactElement<any> {
  return <div>
    <SelectField
      floatingLabelText="タイプ"
      value={props.ngBody.type}
      onChange={(_e, _i, type) => {
        switch (type) {
          case "not":
            props.onUpdateNGBody({
              id: uuid.v4(),
              type: "not",
              body: ng.createDefaultBody(),
            });
            break;
          case "and":
            props.onUpdateNGBody({
              id: uuid.v4(),
              type: "and",
              body: Im.List()
            });
            break;
          case "or":
            props.onUpdateNGBody({
              id: uuid.v4(),
              type: "or",
              body: Im.List()
            });
            break;
          case "profile":
            props.onUpdateNGBody({
              id: uuid.v4(),
              type: "profile",
              profile: ""
            });
            break;
          case "hash":
            props.onUpdateNGBody({
              id: uuid.v4(),
              type: "hash",
              hash: ""
            });
            break;
          case "body":
            props.onUpdateNGBody({
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
            props.onUpdateNGBody({
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
            props.onUpdateNGBody({
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
    {props.ngBody.type === "not" ? <NGBodyEditor ngBody={props.ngBody.body} onUpdateNGBody={newBody => {
      if (props.ngBody.type === "not") {
        props.onUpdateNGBody({
          ...props.ngBody,
          body: newBody
        });
      }
    }} />
      : props.ngBody.type === "and" ? <NGBodysEditor ngBody={props.ngBody.body} onUpdateNGBody={newBody => {
        if (props.ngBody.type === "and") {
          props.onUpdateNGBody({
            ...props.ngBody,
            body: newBody
          });
        }
      }} />
        : props.ngBody.type === "or" ? <NGBodysEditor ngBody={props.ngBody.body} onUpdateNGBody={newBody => {
          if (props.ngBody.type === "or") {
            props.onUpdateNGBody({
              ...props.ngBody,
              body: newBody
            });
          }
        }} />
          : props.ngBody.type === "profile" ? <NGProfileNodeEditor
            value={props.ngBody}
            onChange={v => props.onUpdateNGBody(v)} />
            : props.ngBody.type === "hash" ? <NGHashNodeEditor
              value={props.ngBody}
              onChange={v => props.onUpdateNGBody(v)} />
              : props.ngBody.type === "body" ? <NGBodyNodeEditor
                value={props.ngBody}
                onChange={v => props.onUpdateNGBody(v)} />
                : props.ngBody.type === "name" ? <NGNameNodeEditor
                  value={props.ngBody}
                  onChange={v => props.onUpdateNGBody(v)} />
                  : props.ngBody.type === "vote" ? <NGVoteNodeEditor
                    value={props.ngBody}
                    onChange={v => props.onUpdateNGBody(v)} />
                    : null}
  </div>;
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