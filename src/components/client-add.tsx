import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { client } from "../gql/_gql/client";
import { createClient } from "../gql/client.gql";
import { createClient as createClientResult, createClientVariables } from "../gql/_gql/createClient";
import { useMutation } from "react-apollo-hooks";

interface ClientAddProps {
  onAdd?: (client: client) => void;
  userData: UserData;
}

export const ClientAdd = (props: ClientAddProps) => {
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<any>(null);
  const submit = useMutation<createClientResult, createClientVariables>(createClient, {
    variables: {
      name: name,
      url: url
    },
  });

  return (<form>
    {error && <Errors errors={["作成に失敗"]} />}
    <TextField floatingLabelText="名前" value={name} onChange={(_e, v) => setName(v)} />
    <TextField floatingLabelText="url" value={url} onChange={(_e, v) => setUrl(v)} />
    <RaisedButton onClick={() => submit().then(data => {
      if (props.onAdd) {
        props.onAdd(data.data!.createClient);
      }
    }).catch(e => setError(e))} label="OK" />
  </form>);;
};