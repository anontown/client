import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  IconButton,
  Paper,
  RaisedButton,
  TextField,
  Checkbox,
} from "material-ui";
import {
  EditorModeEdit,
  NavigationRefresh,
  ToggleStar,
  ToggleStarBorder,
} from "material-ui/svg-icons";
import * as qs from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  Link,
  RouteComponentProps,
} from "react-router-dom";
import {
  Subject,
  Subscription,
} from "rxjs";
import { updateUserData } from "../actions";
import {
  Page,
  Snack,
  TagsInput,
  TopicListItem,
} from "../components";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient } from "../utils";

interface TopicSearchPageProps extends RouteComponentProps<{}> {
  user: UserData | null;
  updateUser: (user: UserData | null) => void;
}

export interface TopicSearchPageState {
  snackMsg: null | string;
  topics: Im.List<api.Topic>;
  count: number;
  tags: string[];
  title: string;
  page: number;
  dead: boolean;
  formTitle: string;
  formDead: boolean;
  formTags: string[];
}

export const TopicSearchPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }), dispatch => ({
  updateUser: (user: UserData | null) => { dispatch(updateUserData(user)); },
}))(class extends React.Component<TopicSearchPageProps, TopicSearchPageState> {
  limit = 100;
  subs: Subscription[] = [];
  formChange$ = new Subject<void>();

  constructor(props: TopicSearchPageProps) {
    super(props);
    const query: { [key: string]: string } = qs.parse(this.props.location.search);
    const title = query.title || "";
    const tags = query.tags ? query.tags.split(",") : [];
    const dead = query.dead === "true";
    this.state = {
      snackMsg: null,
      topics: Im.List(),
      count: 0,
      tags,
      title,
      page: 0,
      dead,
      formTitle: title,
      formDead: dead,
      formTags: tags,
    };

    this.subs.push(this.formChange$
      .debounceTime(500)
      .subscribe(() => {
        this.props.history.push({
          pathname: "/topic/search",
          search: qs.stringify({
            title: this.state.formTitle,
            dead: this.state.formDead.toString(),
            tags: this.state.formTags.join(","),
          }),
        });
      }));

    this.more();
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  update() {
    this.setState({
      topics: Im.List(),
      page: 0,
      count: 0,
    });
    this.more();
  }

  more() {
    apiClient.findTopic({
      title: this.state.title,
      tags: this.state.tags,
      skip: this.state.page * this.limit,
      limit: this.limit,
      activeOnly: !this.state.dead,
    })
      .subscribe(topics => {
        this.setState({
          count: topics.length,
          page: this.state.page + 1,
          topics: this.state.topics.concat(topics),
        });
      }, () => {
        this.setState({ snackMsg: "トピック取得に失敗しました。" });
      });
  }

  favo() {
    if (this.props.user === null) {
      return;
    }
    const storage = this.props.user.storage;
    const tf = storage.tagsFavo;
    const tags = Im.Set(this.state.tags);
    this.props.updateUser({
      ...this.props.user,
      storage: {
        ...storage,
        tagsFavo: tf.has(tags) ? tf.delete(tags) : tf.add(tags),
      },
    });
  }

  render() {
    return <Page column={1}>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      <Paper>
        {this.props.user !== null
          ? <IconButton onClick={() => this.favo()}>
            {this.props.user.storage.tagsFavo.has(Im.Set(this.state.tags))
              ? <ToggleStar />
              : <ToggleStarBorder />}
          </IconButton>
          : null}
        <div>
          <TagsInput value={this.state.formTags} onChange={v => {
            this.setState({ formTags: v });
            this.formChange$.next();
          }} />
          <TextField floatingLabelText="タイトル" value={this.state.formTitle} onChange={(_e, v) => {
            this.setState({ formTitle: v });
            this.formChange$.next();
          }} />
          <Checkbox label="過去ログも" checked={this.state.formDead} onCheck={(_e, v) => {
            this.setState({ formDead: v });
            this.formChange$.next();
          }} />
        </div>
      </Paper >
      <div>
        {this.props.user !== null
          ? <IconButton containerElement={<Link to="/topic/create" />}>
            <EditorModeEdit />
          </IconButton>
          : null}
        <IconButton onClick={() => this.update()}>
          <NavigationRefresh />
        </IconButton>
      </div>
      <div>
        {this.state.topics.map(t => <TopicListItem topic={t} detail={true} />)}
      </div>
      {this.state.count === this.limit
        ? <div>
          <RaisedButton onClick={() => this.more()} label="もっと" />
        </div>
        : null}
    </Page>;
  }
}));
