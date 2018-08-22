import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { UserData } from "../models";
import { Errors } from "./errors";
import { client } from "../gql/_gql/client";

interface ClientEditorProps {
  client: client | null;
  onUpdate?: (client: client) => void;
  onAdd?: (client: client) => void;
  userData: UserData;
}

interface ClientEditorState {
  url: string;
  name: string;
  errors: string[];
}

export class ClientEditor extends React.Component<ClientEditorProps, ClientEditorState> {
  constructor(props: ClientEditorProps) {
    super(props);
    this.state = {
      url: props.client !== null ? props.client.url : "",
      name: props.client !== null ? props.client.name : "",
      errors: [],
    };
  }

  render() {
    return <form>
      <Errors errors={this.state.errors} />
      <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
      <TextField floatingLabelText="url" value={this.state.url} onChange={(_e, v) => this.setState({ url: v })} />
      <RaisedButton onClick={() => this.submit()} label="OK" />
    </form>;
  }

  async submit() {
    try {
      if (this.props.client !== null) {
        const client = await apiClient.updateClient(this.props.userData.token, {
          id: this.props.client.id,
          name: this.state.name,
          url: this.state.url,
        });

        if (this.props.onUpdate) {
          this.props.onUpdate(client);
        }
        this.setState({ errors: [] });
      } else {
        const client = await apiClient.createClient(this.props.userData.token, {
          name: this.state.name,
          url: this.state.url,
        });

        if (this.props.onAdd) {
          this.props.onAdd(client);
        }
        this.setState({ errors: [] });
      }
    } catch (e) {
      if (e instanceof AtError) {
        this.setState({ errors: e.errors.map(e => e.message) });
      } else {
        this.setState({ errors: ["エラーが発生しました"] });
      }
    }
  }
}
