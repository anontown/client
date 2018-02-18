import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Dialog,
  FontIcon,
  IconButton,
  Paper,
  Slider,
  Toggle,
} from "material-ui";
import * as React from "react";
import {
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Observable,
  ReplaySubject,
  Subject,
} from "rxjs";
import {
  NG,
  Page,
  Res,
  ResWrite,
  Scroll,
  Snack,
  TopicFavo,
} from "../components";
import { ResSeted } from "../models";
import { appInject, UserStore } from "../stores";
import { apiClient, resSetedCreate } from "../utils";
import * as style from "./topic.scss";
// TODO:NGのtransparent

// ジェネリクス解除
interface ResScroll { new(): Scroll<ResSeted>; }
const ResScroll = Scroll as ResScroll;

interface TopicPageProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
}

export interface TopicPageState {
  snackMsg: null | string;
  topic: api.Topic | null;
  reses: Im.List<ResSeted>;
  isResWrite: boolean;
  isAutoScrollDialog: boolean;
  autoScrollSpeed: number;
  isAutoScroll: boolean;
  isNGDialog: boolean;
}

export const TopicPage = withRouter(appInject(class extends React.Component<TopicPageProps, TopicPageState> {
  limit = 50;
  scrollNewItem = new ReplaySubject<string | null>(1);
  updateItem = new Subject<ResSeted>();
  newItem = Observable.empty<ResSeted>();
  initState: TopicPageState = {
    snackMsg: null,
    topic: null,
    reses: Im.List(),
    isResWrite: false,
    isAutoScrollDialog: false,
    autoScrollSpeed: 15,
    isAutoScroll: false,
    isNGDialog: false,
  };

  constructor(props: TopicPageProps) {
    super(props);
    this.state = this.initState;
    this.init(props);
  }

  init(props: TopicPageProps) {
    apiClient.findTopicOne({ id: props.match.params.id })
      .subscribe(topic => {
        this.setState({ topic }, () => {
          this.storageSave(null);
        });
      }, () => {
        this.setState({ snackMsg: "トピック取得に失敗" });
      });

    const user = props.user.data;
    if (user !== null) {
      const topicRead = user.storage.topicRead.get(props.match.params.id);
      if (topicRead !== undefined) {
        apiClient.findResOne(user.token, {
          id: topicRead.res,
        }).subscribe(res => {
          this.scrollNewItem.next(res.date);
        }, () => {
          this.scrollNewItem.next(null);
        });
      } else {
        this.scrollNewItem.next(null);
      }
    } else {
      this.scrollNewItem.next(null);
    }

    this.newItem = apiClient.streamUpdateTopic(user !== null ? user.token : null, { id: props.match.params.id })
      .do(x => {
        if (this.state.topic !== null) {
          this.setState({ topic: { ...this.state.topic, resCount: x.count } });
          this.storageSave(null);
        }
      })
      .flatMap(x => resSetedCreate.resSet(user !== null ? user.token : null, [x.res]).map(reses => reses[0]));
  }

  componentWillReceiveProps(nextProps: TopicPageProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.setState(this.initState, () => {
        this.init(nextProps);
      });
    }
  }

  storageSave(res: string | null) {
    if (this.props.user.data === null || this.state.topic === null) {
      return;
    }
    const storage = this.props.user.data.storage;
    if (res === null) {
      const storageRes = storage.topicRead.get(this.state.topic.id);
      if (storageRes !== undefined) {
        res = storageRes.res;
      } else {
        const first = this.state.reses.first();
        if (first === undefined) {
          return;
        }
        res = first.id;
      }
    }
    this.props.user.setData({
      ...this.props.user.data,
      storage: {
        ...storage,
        topicRead: storage.topicRead.set(this.state.topic.id, {
          res,
          count: this.state.topic.resCount,
        }),
      },
    });
  }

  favo() {
    if (this.props.user.data === null || this.state.topic === null) {
      return;
    }
    const storage = this.props.user.data.storage;
    const tf = storage.topicFavo;
    this.props.user.setData({
      ...this.props.user.data,
      storage: {
        ...storage,
        topicFavo: this.isFavo ? tf.delete(this.state.topic.id) : tf.add(this.state.topic.id),
      },
    });
  }

  get isFavo() {
    if (this.props.user.data === null || this.state.topic === null) {
      return false;
    }

    return this.props.user.data.storage.topicFavo.has(this.state.topic.id);
  }

  render() {
    return <Page
      disableScroll={true}
      sidebar={this.props.user.data !== null
        ? <TopicFavo detail={false} />
        : undefined}>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      <Dialog
        title="自動スクロール"
        open={this.state.isAutoScrollDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ isAutoScrollDialog: false })}>
        <Toggle
          label="自動スクロール"
          toggled={this.state.isAutoScroll}
          onToggle={(_e, v) => this.setState({ isAutoScroll: v })} />
        <Slider
          max={30}
          value={this.state.autoScrollSpeed}
          onChange={(_e, v) => this.setState({ autoScrollSpeed: v })} />
      </Dialog>
      <Dialog
        title="NG"
        open={this.state.isNGDialog}
        autoScrollBodyContent={true}
        onRequestClose={() => this.setState({ isNGDialog: false })}>
        <NG />
      </Dialog>
      {this.state.topic !== null
        ? <div className={style.main}>
          <Paper className={style.header}>
            <div className={style.subject}>
              {this.state.topic.type === "fork"
                ? <FontIcon className="material-icons">call_split</FontIcon>
                : null}
              {this.state.topic.type === "one"
                ? <FontIcon className="material-icons">looks_one</FontIcon>
                : null}
              {this.state.topic.title}
            </div>
            <div>
              <IconButton containerElement={<Link to={{
                pathname: `/topic/${this.props.match.params.id}/data`,
                state: { modal: true },
              }} />}>
                <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
              </IconButton>
              {this.state.topic.type === "normal"
                ? <IconButton containerElement={<Link to={{
                  pathname: `/topic/${this.props.match.params.id}/fork`,
                  state: { modal: true },
                }} />}>
                  <FontIcon className="material-icons">call_split</FontIcon>
                </IconButton>
                : null}
              {this.state.topic.type === "normal" && this.props.user.data !== null
                ? <IconButton containerElement={<Link to={{
                  pathname: `/topic/${this.props.match.params.id}/edit`,
                  state: { modal: true },
                }} />}>
                  <FontIcon className="material-icons">settings</FontIcon>
                </IconButton>
                : null}
              {this.props.user.data !== null
                ? <IconButton onClick={() => this.favo()}>
                  {this.isFavo
                    ? <FontIcon className="material-icons">star</FontIcon>
                    : <FontIcon className="material-icons">star_border</FontIcon>}
                </IconButton>
                : null}
              <IconButton onClick={() => this.setState({ isAutoScrollDialog: true })}>
                <FontIcon className="material-icons">play_circle_outline</FontIcon>
              </IconButton>
              <IconButton onClick={() => this.setState({ isNGDialog: true })}>
                <FontIcon className="material-icons">mood_bad</FontIcon>
              </IconButton>
              {this.props.user.data !== null && this.state.topic.active
                ? <IconButton onClick={() => this.setState({ isResWrite: !this.state.isResWrite })}>
                  <FontIcon className="material-icons">create</FontIcon>
                </IconButton>
                : null}
            </div>
          </Paper>
          <ResScroll
            className={style.reses}
            items={this.state.reses}
            onChangeItems={reses => this.setState({ reses })}
            newItemOrder="bottom"
            findNewItem={() => {
              if (this.state.topic === null) {
                return Observable.empty();
              }
              const token = this.props.user.data !== null ? this.props.user.data.token : null;
              return apiClient.findResNew(token, {
                topic: this.state.topic.id,
                limit: this.limit,
              })
                .mergeMap(r => resSetedCreate.resSet(token, r))
                .map(reses => Im.List(reses));
            }}
            findItem={(type, date, equal) => {
              if (this.state.topic === null) {
                return Observable.empty();
              }
              const token = this.props.user.data !== null ? this.props.user.data.token : null;
              return apiClient.findRes(token, {
                topic: this.state.topic.id,
                type,
                equal,
                date,
                limit: this.limit,
              })
                .mergeMap(r => resSetedCreate.resSet(token, r))
                .map(reses => Im.List(reses));
            }}
            width={10}
            debounceTime={500}
            autoScrollSpeed={this.state.autoScrollSpeed}
            isAutoScroll={this.state.isAutoScroll}
            scrollNewItemChange={res => this.storageSave(res.id)}
            scrollNewItem={this.scrollNewItem}
            updateItem={this.updateItem}
            newItem={this.newItem}
            dataToEl={res =>
              <Paper>
                <Res
                  res={res}
                  update={newRes => this.updateItem.next(newRes)} />
              </Paper>} />
          {this.state.isResWrite
            ? <Paper className={style.resWrite}>
              <ResWrite topic={this.state.topic.id} reply={null} />
            </Paper>
            : null}
        </div>
        : null
      }
    </Page>;
  }
}));
