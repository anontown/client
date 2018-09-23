import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { client } from "../gql/_gql/client";
import { updateClient } from "./client-editor.gql";
import { updateClient as updateClientResult, updateClientVariables } from "./_gql/updateClient";
import { Mutation } from "react-apollo";

interface ClientEditorProps {
  client: client;
  onUpdate?: (client: client) => void;
  userData: UserData;
}

interface ClientEditorState {
  url: string;
  name: string;
}

export class ClientEditor extends React.Component<ClientEditorProps, ClientEditorState> {
  constructor(props: ClientEditorProps) {
    super(props);
    this.state = {
      url: props.client.url,
      name: props.client.name,
    };
  }

  render() {
    return (<Mutation<updateClientResult, updateClientVariables>
      mutation={updateClient}
      variables={{
        id: this.props.client.id,
        name: this.state.name,
        url: this.state.url,
      }}
      onCompleted={data => {
        if (this.props.onUpdate) {
          this.props.onUpdate(data);
        }
      }}>{
        (submit, { error }) => {
          return (<form>
            {error && <Errors errors={["更新に失敗"]} />}
            <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
            <TextField floatingLabelText="url" value={this.state.url} onChange={(_e, v) => this.setState({ url: v })} />
            <RaisedButton onClick={() => submit()} label="OK" />
          </form>);
        }
      }</Mutation>);
  }
}
