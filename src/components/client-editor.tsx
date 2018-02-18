import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { appInject, UserStore } from "../stores";
import { apiClient } from "../utils";
import { Errors } from "./errors";

interface UnconnectedClientEditorProps {
  client: api.Client | null;
  onUpdate?: (client: api.Client) => void;
  onAdd?: (client: api.Client) => void;
  user: UserStore;
}

export type ClientEditorProps = ObjectOmit<UnconnectedClientEditorProps, "user">;

interface ClientEditorState {
  url: string;
  name: string;
  errors: string[];
}

export const ClientEditor = appInject(class extends React.Component<UnconnectedClientEditorProps, ClientEditorState> {
  constructor(props: UnconnectedClientEditorProps) {
    super(props);
    this.state = {
      url: props.client !== null ? props.client.url : "",
      name: props.client !== null ? props.client.name : "",
      errors: [],
    };
  }

  render() {
    return this.props.user.data !== null
      ? <form>
        <Errors errors={this.state.errors} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <TextField floatingLabelText="url" value={this.state.url} onChange={(_e, v) => this.setState({ url: v })} />
        <RaisedButton onClick={() => this.submit()} label="OK" />
      </form>
      : <div>ログインして下さい</div>;
  }

  submit() {
    if (this.props.user.data === null) {
      return;
    }

    if (this.props.client !== null) {
      apiClient.updateClient(this.props.user.data.token, {
        id: this.props.client.id,
        name: this.state.name,
        url: this.state.url,
      }).subscribe(client => {
        if (this.props.onUpdate) {
          this.props.onUpdate(client);
        }
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    } else {
      apiClient.createClient(this.props.user.data.token, {
        name: this.state.name,
        url: this.state.url,
      }).subscribe(client => {
        if (this.props.onAdd) {
          this.props.onAdd(client);
        }
        this.setState({ errors: [] });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    }
  }
});
