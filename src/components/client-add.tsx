import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { MutationUpdaterFn } from "react-apollo-hooks";
import * as G from "../../generated/graphql";

interface ClientAddProps {
  onAddUpdate?: MutationUpdaterFn<G.CreateClientMutation>
  userData: UserData;
}

export const ClientAdd = (props: ClientAddProps) => {
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<any>(null);

  const submit = G.useCreateClientMutation({
    variables: {
      name: name,
      url: url
    },
    update: props.onAddUpdate
  });

  return (<form>
    {error && <Errors errors={["作成に失敗"]} />}
    <TextField floatingLabelText="名前" value={name} onChange={(_e, v) => setName(v)} />
    <TextField floatingLabelText="url" value={url} onChange={(_e, v) => setUrl(v)} />
    <RaisedButton onClick={() => submit().catch(e => setError(e))} label="OK" />
  </form>);;
};