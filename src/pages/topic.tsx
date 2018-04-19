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
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
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
import { myInject, UserStore } from "../stores";
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

export const TopicPage = withRouter(myInject(["user"],
  observer(class extends React.Component<TopicPageProps, TopicPageState> {
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

    async init(props: TopicPageProps) {
      try {
        this.setState({ topic: await apiClient.findTopicOne({ id: props.match.params.id }) }, () => {
          this.storageSaveDate(null);
        });
      } catch {
        this.setState({ snackMsg: "トピック取得に失敗" });
      }

      const user = props.user.data;
      if (user !== null) {
        const topicRead = user.storage.topicRead.get(props.match.params.id);
        if (topicRead !== undefined) {
          this.scrollNewItem.next(topicRead.date);
        } else {
          this.scrollNewItem.next(null);
        }
      } else {
        this.scrollNewItem.next(null);
      }

      this.newItem = apiClient.streamUpdateTopic(user !== null ? user.token : null, {
        id: props.match.params.id,
      })
        .do(x => {
          if (this.state.topic !== null) {
            this.setState({ topic: { ...this.state.topic, resCount: x.count } });
            this.storageSaveDate(null);
          }
        })
        .flatMap(x => resSetedCreate.resSet(user !== null ? user.token : null, [x.res]).then(reses => reses[0]));
    }

    componentWillReceiveProps(nextProps: TopicPageProps) {
      if (this.props.match.params.id !== nextProps.match.params.id) {
        this.setState(this.initState, () => {
          this.init(nextProps);
        });
      }
    }

    storageSaveDate(date: string | null) {
      if (this.props.user.data === null || this.state.topic === null) {
        return;
      }
      const storage = this.props.user.data.storage;
      if (date === null) {
        const storageRes = storage.topicRead.get(this.state.topic.id);
        if (storageRes !== undefined) {
          date = storageRes.date;
        } else {
          const first = this.state.reses.first();
          if (first === undefined) {
            return;
          }
          date = first.date;
        }
      }
      this.props.user.setData({
        ...this.props.user.data,
        storage: {
          ...storage,
          topicRead: storage.topicRead.set(this.state.topic.id, {
            date,
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
        <Helmet>
          <title>トピック</title>
        </Helmet>
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
            <Helmet>
              <title>{this.state.topic.title}</title>
            </Helmet>
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
              findNewItem={async () => {
                if (this.state.topic === null) {
                  return Im.List();
                }
                const token = this.props.user.data !== null ? this.props.user.data.token : null;
                return Im.List(await resSetedCreate.resSet(token, await apiClient.findResNew(token, {
                  topic: this.state.topic.id,
                  limit: this.limit,
                })));
              }}
              findItem={async (type, date, equal) => {
                if (this.state.topic === null) {
                  return Im.List();
                }
                const token = this.props.user.data !== null ? this.props.user.data.token : null;
                return Im.List(await resSetedCreate.resSet(token, await apiClient.findRes(token, {
                  topic: this.state.topic.id,
                  type,
                  equal,
                  date,
                  limit: this.limit,
                })));
              }}
              width={10}
              debounceTime={500}
              autoScrollSpeed={this.state.autoScrollSpeed}
              isAutoScroll={this.state.isAutoScroll}
              scrollNewItemChange={res => this.storageSaveDate(res.date)}
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
  })));
