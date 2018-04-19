import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Dialog,
  MenuItem,
  Paper,
  RaisedButton,
  SelectField,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Redirect,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Errors,
  MdEditor,
  Page,
  TagsInput,
} from "../components";
import { myInject, UserStore } from "../stores";
import { apiClient } from "../utils";

interface TopicCreatePageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface TopicCreatePageState {
  title: string;
  tags: Im.Set<string>;
  text: string;
  type: api.TopicType;
  errors?: string[];
  redirect: string | null;
  openDialog: boolean;
}

export const TopicCreatePage =
  withRouter(myInject(["user"], observer(class extends React.Component<TopicCreatePageProps, TopicCreatePageState> {
    constructor(props: TopicCreatePageProps) {
      super(props);
      this.state = {
        title: "",
        tags: Im.Set(),
        text: "",
        type: "one",
        redirect: null,
        openDialog: false,
      };
    }

    render() {
      return this.state.redirect === null
        ? <Page>
          <Helmet>
            <title>トピック作成</title>
          </Helmet>
          {this.props.user.data !== null
            ? <Paper>
              <Dialog
                title="確認"
                open={this.state.openDialog}
                autoScrollBodyContent={true}
                onRequestClose={() => this.setState({ openDialog: false })}
                actions={[
                  <RaisedButton label={"はい"} onClick={() => {
                    this.setState({ openDialog: false });
                    this.create();
                  }} />,
                  <RaisedButton label={"いいえ"} onClick={() => this.setState({ openDialog: false })} />,
                ]}>
                ニュース・ネタ・実況などは単発トピックで建てて下さい。<br />
                本当に建てますか？
            </Dialog>
              <form>
                <Errors errors={this.state.errors} />
                <div>
                  <SelectField
                    floatingLabelText="種類"
                    value={this.state.type}
                    onChange={(_e, _i, v) => this.setState({ type: v })}>
                    <MenuItem value="one" primaryText="単発" />
                    <MenuItem value="normal" primaryText="通常" />
                  </SelectField>
                </div>
                <div>
                  <TextField
                    floatingLabelText="タイトル"
                    value={this.state.title}
                    onChange={(_e, v) => this.setState({ title: v })} />
                </div>
                <div>
                  <TagsInput value={this.state.tags} onChange={v => this.setState({ tags: v })} />
                </div>
                <MdEditor value={this.state.text} onChange={v => this.setState({ text: v })} />
                <div>
                  <RaisedButton onClick={() => this.submit()} label="トピック作成" />
                </div>
              </form>
            </Paper>
            : <Paper>
              ログインしてください。
        </Paper>
          }
        </Page>
        : <Redirect to={`/topic/${this.state.redirect}`} />;
    }

    async submit() {
      if (this.state.type === "normal") {
        this.setState({ openDialog: true });
      } else {
        await this.create();
      }
    }

    async create() {
      if (this.props.user.data === null) {
        return;
      }
      const params = {
        title: this.state.title,
        tags: this.state.tags.toArray(),
        text: this.state.text,
      };

      try {
        const topic = this.state.type === "one" ?
          await apiClient.createTopicOne(this.props.user.data.token, params) :
          await apiClient.createTopicNormal(this.props.user.data.token, params);
        this.setState({ errors: undefined, redirect: topic.id });
      } catch (e) {
        if (e instanceof AtError) {
          this.setState({ errors: e.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      }
    }
  })));
