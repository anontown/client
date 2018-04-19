import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import {
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { myInject, UserStore } from "../stores";
import { apiClient } from "../utils";
import { Errors } from "./errors";
import { Snack } from "./snack";
import { TopicListItem } from "./topic-list-item";

interface UnconnectedTopicForkProps {
  topic: api.TopicNormal;
  onCreate?: (topic: api.TopicFork) => void;
  user: UserStore;
}

export type TopicForkProps = ObjectOmit<UnconnectedTopicForkProps, "user">;

interface TopicForkState {
  errors: string[];
  title: string;
  children: api.TopicFork[];
  snackMsg: string | null;
}

export const TopicFork = myInject(["user"],
  observer(class extends React.Component<UnconnectedTopicForkProps, TopicForkState> {
    constructor(props: UnconnectedTopicForkProps) {
      super(props);
      this.state = {
        errors: [],
        title: "",
        children: [],
        snackMsg: null,
      };

      (async () => {
        try {
          const topics = await apiClient.findTopicFork({
            parent: this.props.topic.id,
            skip: 0,
            limit: 100,
            activeOnly: false,
          });
          this.setState({ children: topics });
        } catch {
          this.setState({ snackMsg: "トピック取得に失敗" });
        }
      })();
    }

    render() {
      return <div>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.user.data !== null
          ? <form>
            <Errors errors={this.state.errors} />
            <TextField
              floatingLabelText="タイトル"
              value={this.state.title}
              onChange={(_e, v) => this.setState({ title: v })} />
            <RaisedButton onClick={() => this.submit()} label="新規作成" />
          </form>
          : null}
        <hr />
        <div>
          {this.state.children.map(t => <Paper key={t.id}>
            <TopicListItem
              topic={t}
              detail={false} />
          </Paper>)}
        </div>
      </div>;
    }

    async submit() {
      if (this.props.user.data === null) {
        return;
      }

      try {
        const topic = await apiClient.createTopicFork(this.props.user.data.token, {
          title: this.state.title,
          parent: this.props.topic.id,
        });
        if (this.props.onCreate) {
          this.props.onCreate(topic);
        }
        this.setState({ errors: [] });
      } catch (e) {
        if (e instanceof AtError) {
          this.setState({ errors: e.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      }
    }
  }));
