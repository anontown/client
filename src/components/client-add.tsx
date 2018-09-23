import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { client } from "../gql/_gql/client";
import { createClient } from "./client-add.gql";
import { createClient as createClientResult, createClientVariables } from "./_gql/createClient";
import { Mutation } from "react-apollo";

interface ClientAddProps {
  onAdd?: (client: client) => void;
  userData: UserData;
}

interface ClientAddState {
  url: string;
  name: string;
  errors: string[];
}

export class ClientAdd extends React.Component<ClientAddProps, ClientAddState> {
  constructor(props: ClientAddProps) {
    super(props);
    this.state = {
      url: "",
      name: "",
      errors: [],
    };
  }

  render() {
    return (<Mutation<createClientResult, createClientVariables>
      mutation={createClient}
      variables={{
        name: this.state.name,
        url: this.state.url
      }}
      onCompleted={data => {
        if (this.props.onAdd) {
          this.props.onAdd(data.createClient);
        }
      }}>{
        (submit, { error }) => {
          return (<form>
            {error && <Errors errors={["作成に失敗"]} />}
            <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
            <TextField floatingLabelText="url" value={this.state.url} onChange={(_e, v) => this.setState({ url: v })} />
            <RaisedButton onClick={() => submit()} label="OK" />
          </form>);
        }
      }</Mutation>);
  }
}
