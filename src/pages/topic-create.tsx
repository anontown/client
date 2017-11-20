import { AtError } from "@anontown/api-client";
import * as api from "@anontown/api-types";
import {
  Dialog,
  MenuItem,
  Paper,
  Button,
  Select,
  TextField,
  DialogActions,
  FormControlLabel
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import {
  Redirect,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Observable } from "rxjs";
import {
  Errors,
  MdEditor,
  Page,
  TagsInput,
} from "../components";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";
import * as Im from "immutable";

interface TopicCreatePageProps extends RouteComponentProps<{}> {
  user: UserData | null;
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

export const TopicCreatePage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<TopicCreatePageProps, TopicCreatePageState> {
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
        ? <Page column={1}>
          {this.props.user !== null
            ? <Paper>
              <Dialog
                title="確認"
                open={this.state.openDialog}
                onRequestClose={() => this.setState({ openDialog: false })}>
                ニュース・ネタ・実況などは単発トピックで建てて下さい。<br />
                本当に建てますか？
                <DialogActions>
                <Button raised onClick={() => {
                    this.setState({ openDialog: false });
                    this.create();
                  }}>はい</Button>
                  <Button raised
                    onClick={() => this.setState({ openDialog: false })}>いいえ</Button>
                  </DialogActions>
            </Dialog>
              <form onSubmit={() => this.submit()}>
                <Errors errors={this.state.errors} />
                <div>
                  <FormControlLabel label="種類" control={<Select
                    value={this.state.type}
                    onChange={e => this.setState({ type: e.target.value as api.TopicType })}>
                    <MenuItem value="one">単発</MenuItem>
                    <MenuItem value="normal">通常</MenuItem>
                  </Select>}/>
                </div>
                <div>
                  <TextField
                    label="タイトル"
                    value={this.state.title}
                    onChange={e => this.setState({ title: e.target.value })} />
                </div>
                <div>
                  <TagsInput value={this.state.tags} onChange={v => this.setState({ tags: v })} />
                </div>
                <MdEditor value={this.state.text} onChange={v => this.setState({ text: v })} />
                <div>
                  <Button raised type="submit">トピック作成</Button>
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

    submit() {
      if (this.state.type === "normal") {
        this.setState({ openDialog: true });
      } else {
        this.create();
      }
    }

    create() {
      if (this.props.user === null) {
        return;
      }
      const params = {
        title: this.state.title,
        tags: this.state.tags.toArray(),
        text: this.state.text,
      };

      const obs$: Observable<api.Topic> = (this.state.type === "one" ?
        apiClient.createTopicOne(this.props.user.token, params) :
        apiClient.createTopicNormal(this.props.user.token, params));

      obs$.subscribe(topic => {
        this.setState({ errors: undefined, redirect: topic.id });
      }, error => {
        if (error instanceof AtError) {
          this.setState({ errors: error.errors.map(e => e.message) });
        } else {
          this.setState({ errors: ["エラーが発生しました"] });
        }
      });

    }
  }));
