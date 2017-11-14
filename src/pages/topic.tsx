import * as React from 'react';
import { UserData, ResSeted } from "../models";
import { apiClient, resSetedCreate } from "../utils";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import {
  RouteComponentProps,
  Link
} from "react-router-dom";
import { updateUserData } from "../actions";
import {
  Page,
  Snack,
  TagsInput,
  TopicListItem,
  TopicFavo,
  Scroll,
  Res,
  ResWrite,
  ScrollListItem
} from "../components";
import {
  Paper,
  RaisedButton,
  TextField,
  IconButton,
  Dialog,
  Slider
} from "material-ui";
import * as icons from "material-ui/svg-icons";
import * as api from "@anontown/api-types";
import {
  Subscription,
  Subject
} from "rxjs";
import * as Im from "immutable";
import { Toggle } from 'material-ui/Toggle';
import { Observable } from 'rxjs/Observable';

//ジェネリクス解除
interface ResScroll { new(): Scroll<ResSeted> };
const ResScroll = Scroll as ResScroll;

type _TopicPageProps = RouteComponentProps<{ id: string }> & {
  user: UserData | null,
  updateUser: (user: UserData | null) => void;
};
export type TopicPageProps = ObjectOmit<_TopicPageProps, "user" | "updateUser">;

export interface TopicPageState {
  snackMsg: null | string,
  topic: api.Topic | null,
  reses: Im.List<ResSeted>,
  isResWrite: boolean,
  isAutoScrollDialog: boolean,
  autoScrollSpeed: number,
  isAutoScroll: boolean,
}

class _TopicPage extends React.Component<_TopicPageProps, TopicPageState> {
  limit = 50;

  constructor(props: _TopicPageProps) {
    super(props);
    this.state = {
      snackMsg: null,
      topic: null,
      reses: Im.List(),
      isResWrite: false,
      isAutoScrollDialog: false,
      autoScrollSpeed: 15,
      isAutoScroll: false,
    };
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
          count: this.state.topic.resCount
        })
      }
    });
  }

  scrollNewItem: Observable<ResSeted | null> = new Subject<ResSeted | null>();
  updateItem: Observable<ResSeted> = new Subject<ResSeted>();
  newItem: Observable<ResSeted> = new Subject<ResSeted>();

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
        <Toggle label="自動スクロール" toggled={this.state.isAutoScroll} onToggle={(_e, v) => this.setState({ isAutoScroll: v })} />
        <Slider max={30} value={this.state.autoScrollSpeed} onChange={(_e, v) => this.setState({ autoScrollSpeed: v })} />
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
              {this.state.topic.type === 'fork'
                ? <icons.CommunicationCallSplit />
                : null}
              {this.state.topic.type === 'one'
                ? <icons.ImageLooksOne />
                : null}
              {this.state.topic.title}
            </div>
            <div>
              <IconButton onClick={() => this.setState({ isDataDialog: true })}>
                <icons.HardwareKeyboardArrowDown />
              </IconButton>
              {this.state.topic.type === 'normal'
                ? <IconButton onClick={() => this.setState({ isForkDialog: true })}>
                  <icons.CommunicationCallSplit />
                </IconButton>
                : null}
              {this.state.topic.type === 'normal' && this.props.user !== null
                ? <IconButton onClick={() => this.setState({ isEditDialog: true })}>
                  <icons.ActionSettings />
                </IconButton>
                : null}
              {this.props.user !== null
                ? <IconButton onClick={() => this.favo()}>
                  {isFavo
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
            onChangeItems={reses => this.setState({ reses: reses })}
            newItemOrder="bottom"
            findNewItem={() => {
              if (this.state.topic === null) {
                return Observable.empty();
              }
              const token = this.props.user !== null ? this.props.user.token : null;
              return apiClient.findResNew(token, {
                topic: this.state.topic.id,
                limit: this.limit
              })
                .mergeMap(r => resSetedCreate.resSet(token, r))
                .map(reses => Im.List(reses));
            }}
            findItem={(type, date, equal) => {
              if (this.state.topic === null) {
                return Observable.empty();
              }
              const token = this.props.user !== null ? this.props.user.token : null;
              return apiClient.findRes(token, {
                topic: this.state.topic.id,
                type: type,
                equal: equal,
                date,
                limit: this.limit
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
            dataToEl={res => <Res />} />
          {this.state.isResWrite
            ? <Paper>
              <ResWrite />
            </Paper>
            : null}
        </main >
        : null
      }
    </Page >;
  }
}

export const TopicPage = connect((state: Store) => ({ user: state.user }),
  dispatch => ({
    updateUser: (user: UserData | null) => { dispatch(updateUserData(user)) }
  }))(_TopicPage);