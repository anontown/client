import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import { RaisedButton, TextField } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import { ObjectOmit } from "typelevel-ts";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import { Errors } from "./errors";

interface _ClientEditorProps {
  client: api.Client | null;
  onUpdate?: (client: api.Client) => void;
  onAdd?: (client: api.Client) => void;
  user: UserData | null;
}

export type ClientEditorProps = ObjectOmit<_ClientEditorProps, "user">;

interface ClientEditorState {
  url: string;
  name: string;
  errors: string[];
}

class _ClientEditor extends React.Component<_ClientEditorProps, ClientEditorState> {
  constructor(props: _ClientEditorProps) {
    super(props);
    this.state = {
      url: props.client !== null ? props.client.url : "",
      name: props.client !== null ? props.client.name : "",
      errors: [],
    };
  }

  public render() {
    return this.props.user !== null
      ? <form onSubmit={() => this.submit()}>
        <Errors errors={this.state.errors} />
        <TextField floatingLabelText="名前" value={this.state.name} onChange={(_e, v) => this.setState({ name: v })} />
        <TextField floatingLabelText="url" value={this.state.url} onChange={(_e, v) => this.setState({ url: v })} />
        <RaisedButton type="submit" label="OK" />
      </form>
      : <div>ログインして下さい</div>;
  }

  public submit() {
    if (this.props.user === null) {
      return;
    }

    if (this.props.client !== null) {
      apiClient.updateClient(this.props.user.token, {
        id: this.props.client.id,
        name: this.state.name,
        url: this.state.url,
      }).subscribe((client) => {
        if (this.props.onUpdate) {
          this.props.onUpdate(client);
        }
        this.setState({ errors: [] });
      }, (error) => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map((e) => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    } else {
      apiClient.createClient(this.props.user.token, {
        name: this.state.name,
        url: this.state.url,
      }).subscribe((client) => {
        if (this.props.onAdd) {
          this.props.onAdd(client);
        }
        this.setState({ errors: [] });
      }, (error) => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map((e) => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });
    }
  }
}

export const ClientEditor = connect((state: Store) => ({ user: state.user }))(_ClientEditor);
