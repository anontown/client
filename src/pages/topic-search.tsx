import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Checkbox,
  FontIcon,
  IconButton,
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import * as qs from "query-string";
import * as React from "react";
import { withRouter } from "react-router";
import {
  Link,
  RouteComponentProps,
} from "react-router-dom";
import {
  Subject,
  Subscription,
} from "rxjs";
import { isArray } from "util";
import {
  Page,
  Snack,
  TagsInput,
  TopicListItem,
} from "../components";
import { myInject, UserStore } from "../stores";
import { apiClient } from "../utils";
import * as style from "./topic-search.scss";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react";

interface TopicSearchPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface TopicSearchPageState {
  snackMsg: null | string;
  topics: Im.List<api.Topic>;
  tags: string[];
  title: string;
  dead: boolean;
  formTitle: string;
  formDead: boolean;
  formTags: Im.Set<string>;
  count: number;
}

export const TopicSearchPage =
  withRouter(myInject(["user"], observer(class extends React.Component<TopicSearchPageProps, TopicSearchPageState> {
    limit = 100;
    subs: Subscription[] = [];
    formChange$ = new Subject<void>();
    page = 0;

    constructor(props: TopicSearchPageProps) {
      super(props);

      const query = this.parseQuery(props);

      this.state = {
        snackMsg: null,
        topics: Im.List(),
        tags: query.tags,
        title: query.title,
        dead: query.dead,
        formTitle: query.title,
        formDead: query.dead,
        formTags: Im.Set(query.tags),
        count: 0,
      };

      this.subs.push(this.formChange$
        .debounceTime(500)
        .subscribe(() => {
          this.props.history.push({
            pathname: "/topic/search",
            search: qs.stringify({
              title: this.state.formTitle,
              dead: this.state.formDead.toString(),
              tags: this.state.formTags.toArray(),
            }),
          });
        }));

      this.more();
    }

    parseQuery(props: TopicSearchPageProps) {
      const query: { [key: string]: string | string[] | undefined } = qs.parse(props.location.search);

      const qTitle = query.title;
      const title = typeof qTitle === "string" ? qTitle : "";

      const qTags = query.tags;
      const tags = isArray(qTags) ? qTags
        : typeof qTags === "string" ? [qTags]
          : [];

      const dead = query.dead === "true";

      return { title, tags, dead };
    }

    componentWillReceiveProps(nextProps: TopicSearchPageProps) {
      if (this.props.location.search !== nextProps.location.search) {
        const query = this.parseQuery(nextProps);
        this.setState({
          title: query.title,
          dead: query.dead,
          tags: query.tags,
          formTitle: query.title,
          formDead: query.dead,
          formTags: Im.Set(query.tags),
        }, () => {
          this.update();
        });
      }
    }

    componentWillUnmount() {
      this.subs.forEach(sub => sub.unsubscribe());
    }

    update() {
      this.setState({
        topics: Im.List(),
        count: 0,
      });
      this.page = 0;
      this.more();
    }

    more() {
      apiClient.findTopic({
        title: this.state.title,
        tags: this.state.tags,
        skip: this.page * this.limit,
        limit: this.limit,
        activeOnly: !this.state.dead,
      })
        .subscribe(topics => {
          this.setState({
            count: topics.length,
            topics: this.state.topics.concat(topics),
          });
          this.page++;
        }, () => {
          this.setState({ snackMsg: "トピック取得に失敗しました。" });
        });
    }

    favo() {
      if (this.props.user.data === null) {
        return;
      }
      const storage = this.props.user.data.storage;
      const tf = storage.tagsFavo;
      const tags = Im.Set(this.state.tags);
      this.props.user.setData({
        ...this.props.user.data,
        storage: {
          ...storage,
          tagsFavo: tf.has(tags) ? tf.delete(tags) : tf.add(tags),
        },
      });
    }

    render() {
      return <Page>
        <Helmet>
          <title>検索</title>
        </Helmet>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        <Paper className={style.form}>
          {this.props.user.data !== null
            ? <IconButton onClick={() => this.favo()}>
              {this.props.user.data.storage.tagsFavo.has(Im.Set(this.state.tags))
                ? <FontIcon className="material-icons">star</FontIcon>
                : <FontIcon className="material-icons">star_border</FontIcon>}
            </IconButton>
            : null}
          <div>
            <TagsInput
              fullWidth
              value={this.state.formTags}
              onChange={v => {
                this.setState({ formTags: v });
                this.formChange$.next();
              }} />
            <TextField
              fullWidth
              floatingLabelText="タイトル"
              value={this.state.formTitle}
              onChange={(_e, v) => {
                this.setState({ formTitle: v });
                this.formChange$.next();
              }} />
            <Checkbox label="過去ログも" checked={this.state.formDead} onCheck={(_e, v) => {
              this.setState({ formDead: v });
              this.formChange$.next();
            }} />
          </div>
        </Paper>
        <div>
          {this.props.user.data !== null
            ? <IconButton containerElement={<Link to="/topic/create" />}>
              <FontIcon className="material-icons">edit</FontIcon>
            </IconButton>
            : null}
          <IconButton onClick={() => this.update()}>
            <FontIcon className="material-icons">refresh</FontIcon>
          </IconButton>
        </div>
        <div>
          {this.state.topics.map(t =>
            <Paper key={t.id}>
              <TopicListItem topic={t} detail={true} />
            </Paper>,
          )}
        </div>
        {this.state.count === this.limit
          ? <div>
            <RaisedButton onClick={() => this.more()} label="もっと" />
          </div>
          : null}
      </Page>;
    }
  })));
