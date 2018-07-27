import * as Im from "immutable";
import {
  Checkbox,
  FontIcon,
  IconButton,
  Paper,
  RaisedButton,
  TextField,
} from "material-ui";
import { observer } from "mobx-react";
import * as qs from "query-string";
import * as React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router";
import {
  Link,
  RouteComponentProps,
} from "react-router-dom";
import * as rx from "rxjs";
import * as op from "rxjs/operators";
import { isArray } from "util";
import {
  Page,
  Snack,
  TagsInput,
  TopicListItem,
} from "../components";
import {
  myInject,
  TopicSearchStore,
  UserStore,
} from "../stores";
import * as style from "./topic-search.scss";

interface TopicSearchPageProps extends RouteComponentProps<{}> {
  user: UserStore;
  topicSearch: TopicSearchStore;
}

export interface TopicSearchPageState {
  formTitle: string;
  formDead: boolean;
  formTags: Im.Set<string>;
}

export const TopicSearchPage =
  withRouter(myInject(["user", "topicSearch"],
    observer(class extends React.Component<TopicSearchPageProps, TopicSearchPageState> {
      subs: rx.Subscription[] = [];
      formChange$ = new rx.Subject<void>();

      constructor(props: TopicSearchPageProps) {
        super(props);

        const query = this.parseQuery(props);

        this.state = {
          formTitle: query.title,
          formDead: query.dead,
          formTags: Im.Set(query.tags),
        };

        this.props.topicSearch.search(query.tags, query.title, query.dead);

        this.subs.push(this.formChange$
          .pipe(op.debounceTime(500))
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
            formTitle: query.title,
            formDead: query.dead,
            formTags: Im.Set(query.tags),
          });
          this.props.topicSearch.search(query.tags, query.title, query.dead);
        }
      }

      componentWillUnmount() {
        this.subs.forEach(sub => sub.unsubscribe());
      }

      favo() {
        if (this.props.user.data === null) {
          return;
        }
        const storage = this.props.user.data.storage;
        const tf = storage.tagsFavo;
        const tags = Im.Set(this.props.topicSearch.tags);
        this.props.user.setStorage({
          ...storage,
          tagsFavo: tf.has(tags) ? tf.delete(tags) : tf.add(tags),
        });
      }

      render() {
        return <Page>
          <Helmet>
            <title>検索</title>
          </Helmet>
          <Snack
            msg={this.props.topicSearch.msg}
            onHide={() => this.props.topicSearch.clearMsg()} />
          <Paper className={style.form}>
            {this.props.user.data !== null
              ? <IconButton onClick={() => this.favo()}>
                {this.props.user.data.storage.tagsFavo.has(Im.Set(this.props.topicSearch.tags))
                  ? <FontIcon className="material-icons">star</FontIcon>
                  : <FontIcon className="material-icons">star_border</FontIcon>}
              </IconButton>
              : null}
            <div>
              <TagsInput
                fullWidth={true}
                value={this.state.formTags}
                onChange={v => {
                  this.setState({ formTags: v });
                  this.formChange$.next();
                }} />
              <TextField
                fullWidth={true}
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
            <IconButton onClick={() => this.props.topicSearch.update()}>
              <FontIcon className="material-icons">refresh</FontIcon>
            </IconButton>
          </div>
          <div>
            {this.props.topicSearch.topics.map(t =>
              <Paper key={t.id}>
                <TopicListItem topic={t} detail={true} />
              </Paper>,
            )}
          </div>
          {this.props.topicSearch.isMore
            ? <div>
              <RaisedButton onClick={() => this.props.topicSearch.more()} label="もっと" />
            </div>
            : null}
        </Page>;
      }
    })));
