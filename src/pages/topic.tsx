import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Dialog,
  IconButton,
  Paper,
  Slider,
  Toggle,
} from "material-ui";
import * as icons from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Observable,
  Subject,
} from "rxjs";
import { updateUserData } from "../actions";
import {
  Page,
  Res,
  ResWrite,
  Scroll,
  Snack,
  TopicData,
  TopicEditor,
  TopicFavo,
  TopicFork,
} from "../components";
import { ResSeted, UserData } from "../models";
import { Store } from "../reducers";
import { apiClient, resSetedCreate } from "../utils";
// ジェネリクス解除
interface ResScroll { new(): Scroll<ResSeted>; }
const ResScroll = Scroll as ResScroll;

interface TopicPageProps extends RouteComponentProps<{ id: string }> {
  user: UserData | null;
  updateUser: (user: UserData | null) => void;
}

export interface TopicPageState {
  snackMsg: null | string;
  topic: api.Topic | null;
  reses: Im.List<ResSeted>;
  isResWrite: boolean;
  isAutoScrollDialog: boolean;
  autoScrollSpeed: number;
  isAutoScroll: boolean;
  isDataDialog: boolean;
  isForkDialog: boolean;
  isEditDialog: boolean;
}

export const TopicPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }), dispatch => ({
    updateUser: (user: UserData | null) => { dispatch(updateUserData(user)); },
  }))(class extends React.Component<TopicPageProps, TopicPageState> {
    limit = 50;
    scrollNewItem = new Subject<string | null>();
    updateItem = new Subject<ResSeted>();
    newItem = Observable.empty<ResSeted>();

    constructor(props: TopicPageProps) {
      super(props);
      this.state = {
        snackMsg: null,
        topic: null,
        reses: Im.List(),
        isResWrite: false,
        isAutoScrollDialog: false,
        autoScrollSpeed: 15,
        isAutoScroll: false,
        isDataDialog: false,
        isForkDialog: false,
        isEditDialog: false,
      };

      apiClient.findTopicOne({ id: this.props.match.params.id })
        .subscribe( topic => {
          this.setState({ topic });
        }, () => {
          this.setState({ snackMsg: "トピック取得に失敗" });
        });

      const user = this.props.user;
      if (user !== null) {
        const topicRead = user.storage.topicRead.get(this.props.match.params.id);
        if (topicRead !== undefined) {
          apiClient.findResOne(user.token, {
            id: topicRead.res,
          }).subscribe( res => {
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

      this.newItem = apiClient.streamUpdateTopic(user !== null ? user.token : null, { id: this.props.match.params.id })
        .do( x => {
          if (this.state.topic !== null) {
            this.setState({ topic: { ...this.state.topic, resCount: x.count } });
            this.storageSave(null);
          }
        })
        .flatMap( x => resSetedCreate.resSet(user !== null ? user.token : null, [x.res]).map( reses => reses[0]));
    }

    storageSave(res: string | null) {
      if (this.props.user === null || this.state.topic === null) {
        return;
      }
      const storage = this.props.user.storage;
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
      this.props.updateUser({
        ...this.props.user,
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
      if (this.props.user === null || this.state.topic === null) {
        return;
      }
      const storage = this.props.user.storage;
      const tf = storage.topicFavo;
      this.props.updateUser({
        ...this.props.user,
        storage: {
          ...storage,
          topicFavo: this.isFavo ? tf.delete(this.state.topic.id) : tf.add(this.state.topic.id),
        },
      });
    }

    get isFavo() {
      if (this.props.user === null || this.state.topic === null) {
        return false;
      }

      return this.props.user.storage.topicFavo.has(this.state.topic.id);
    }

    render() {
      return <Page column={2}>
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
          title="詳細データ"
          open={this.state.isDataDialog}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ isDataDialog: false })}>
          {this.state.topic !== null
            ? <TopicData topic={this.state.topic} />
            : null}
        </Dialog>
        <Dialog
          title="派生トピック"
          open={this.state.isForkDialog}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ isForkDialog: false })}>
          {this.state.topic !== null && this.state.topic.type === "normal"
            ? <TopicFork topic={this.state.topic} onCreate={ topic => {
              this.setState({ isForkDialog: false });
              this.props.history.push(`/topic/${topic.id}`);
            }} />
            : null}
        </Dialog>
        <Dialog
          title="編集"
          open={this.state.isEditDialog}
          autoScrollBodyContent={true}
          onRequestClose={() => this.setState({ isEditDialog: false })}>
          {this.state.topic !== null && this.state.topic.type === "normal"
            ? <TopicEditor topic={this.state.topic} onUpdate={ topic => {
              this.setState({ isEditDialog: false });
              this.setState({ topic });
            }} />
            : null}
        </Dialog>
        {this.props.user !== null
          ? <aside>
            <TopicFavo detail={false} />
          </aside>
          : null
        }
        {this.state.topic !== null
          ? <main>
            <Paper>
              <div>
                {this.state.topic.type === "fork"
                  ? <icons.CommunicationCallSplit />
                  : null}
                {this.state.topic.type === "one"
                  ? <icons.ImageLooksOne />
                  : null}
                {this.state.topic.title}
              </div>
              <div>
                <IconButton onClick={() => this.setState({ isDataDialog: true })}>
                  <icons.HardwareKeyboardArrowDown />
                </IconButton>
                {this.state.topic.type === "normal"
                  ? <IconButton onClick={() => this.setState({ isForkDialog: true })}>
                    <icons.CommunicationCallSplit />
                  </IconButton>
                  : null}
                {this.state.topic.type === "normal" && this.props.user !== null
                  ? <IconButton onClick={() => this.setState({ isEditDialog: true })}>
                    <icons.ActionSettings />
                  </IconButton>
                  : null}
                {this.props.user !== null
                  ? <IconButton onClick={() => this.favo()}>
                    {this.isFavo
                      ? <icons.ToggleStar />
                      : <icons.ToggleStarBorder />}
                  </IconButton>
                  : null}
                <IconButton onClick={() => this.setState({ isAutoScrollDialog: true })}>
                  <icons.AvPlayCircleOutline />
                </IconButton>
                {this.props.user !== null && this.state.topic.active
                  ? <IconButton onClick={() => this.setState({ isResWrite: !this.state.isResWrite })}>
                    <icons.ContentCreate />
                  </IconButton>
                  : null}
              </div >
            </Paper>
            <ResScroll items={this.state.reses}
              onChangeItems={ reses => this.setState({ reses })}
              newItemOrder="bottom"
              findNewItem={() => {
                if (this.state.topic === null) {
                  return Observable.empty();
                }
                const token = this.props.user !== null ? this.props.user.token : null;
                return apiClient.findResNew(token, {
                  topic: this.state.topic.id,
                  limit: this.limit,
                })
                  .mergeMap( r => resSetedCreate.resSet(token, r))
                  .map( reses => Im.List(reses));
              }}
              findItem={(type, date, equal) => {
                if (this.state.topic === null) {
                  return Observable.empty();
                }
                const token = this.props.user !== null ? this.props.user.token : null;
                return apiClient.findRes(token, {
                  topic: this.state.topic.id,
                  type,
                  equal,
                  date,
                  limit: this.limit,
                })
                  .mergeMap( r => resSetedCreate.resSet(token, r))
                  .map( reses => Im.List(reses));
              }}
              width={10}
              debounceTime={500}
              autoScrollSpeed={this.state.autoScrollSpeed}
              isAutoScroll={this.state.isAutoScroll}
              scrollNewItemChange={ res => this.storageSave(res.id)}
              scrollNewItem={this.scrollNewItem}
              updateItem={this.updateItem}
              newItem={this.newItem}
              dataToEl={res => <Res
                key={res.id}
                res={res}
                isPop={false}
                update={newRes => this.updateItem.next(newRes)} />} />
            {this.state.isResWrite
              ? <Paper>
                <ResWrite topic={this.state.topic.id} reply={null} />
              </Paper>
              : null}
          </main>
          : null
        }
      </Page>;
    }
  }));
