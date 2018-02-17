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
          : props.ngBody.type === "profile" ? <TextField
            floatingLabelText="ID"
            value={props.ngBody.profile}
            onChange={(_e, v) => {
              if (props.ngBody.type === "profile") {
                props.onUpdateNGBody({
                  ...props.ngBody,
                  profile: v
                });
              }
            }} />
            : props.ngBody.type === "hash" ? <TextField
              floatingLabelText="HASH"
              value={props.ngBody.hash}
              onChange={(_e, v) => {
                if (props.ngBody.type === "hash") {
                  props.onUpdateNGBody({
                    ...props.ngBody,
                    hash: v
                  });
                }
              }} />
              : props.ngBody.type === "body" ? <NGMatcherEditor
                floatingLabelText="本文"
                matcher={props.ngBody.matcher}
                onChange={v => {
                  if (props.ngBody.type === "body") {
                    props.onUpdateNGBody({
                      ...props.ngBody,
                      matcher: v
                    });
                  }
                }} />
                : props.ngBody.type === "name" ? <NGMatcherEditor
                  floatingLabelText="名前"
                  matcher={props.ngBody.matcher}
                  onChange={v => {
                    if (props.ngBody.type === "name") {
                      props.onUpdateNGBody({
                        ...props.ngBody,
                        matcher: v
                      });
                    }
                  }} />
                  : props.ngBody.type === "vote" ? <TextField
                    floatingLabelText="しきい値"
                    type="number"
                    value={props.ngBody.value.toString()}
                    onChange={(_e, v) => {
                      const newV = +v;
                      if (props.ngBody.type === "vote" && !isNaN(newV)) {
                        props.onUpdateNGBody({
                          ...props.ngBody,
                          value: newV
                        });
                      }
                    }} />
                    : null}
  </div>;
}
