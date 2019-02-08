import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { client } from "../gql/_gql/client";
import { createClient } from "../gql/client.gql";
import { createClient as createClientResult, createClientVariables } from "../gql/_gql/createClient";
import { Mutation } from "react-apollo";

interface ClientAddProps {
  onAdd?: (client: client) => void;
  userData: UserData;
}

export const ClientAdd = (props: ClientAddProps) => {
  const [url, updateUrl] = React.useState("");
  const [name, updateName] = React.useState("");

  return (<Mutation<createClientResult, createClientVariables>
    mutation={createClient}
    variables={{
      name: name,
      url: url
    }}
    onCompleted={data => {
      if (props.onAdd) {
        props.onAdd(data.createClient);
      }
    }}>{
      (submit, { error }) => {
        return (<form>
          {error && <Errors errors={["作成に失敗"]} />}
          <TextField floatingLabelText="名前" value={name} onChange={(_e, v) => updateName(v)} />
          <TextField floatingLabelText="url" value={url} onChange={(_e, v) => updateUrl(v)} />
          <RaisedButton onClick={() => submit()} label="OK" />
        </form>);
      }
    }</Mutation>);
};