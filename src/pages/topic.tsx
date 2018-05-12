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
  NG,
  Page,
  Res,
  ResWrite,
  Scroll,
  Snack,
  TopicFavo,
} from "../components";
import { ResSeted } from "../models";
import {
  myInject,
  UserStore,
  TopicStore
} from "../stores";
import * as style from "./topic.scss";

// TODO:NGのtransparent

// ジェネリクス解除
interface ResScroll { new(): Scroll<ResSeted>; }
const ResScroll = Scroll as ResScroll;

interface TopicPageProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  topic: TopicStore;
}

export interface TopicPageState {
  isResWrite: boolean;
  isAutoScrollDialog: boolean;
  isNGDialog: boolean;
}

export const TopicPage = withRouter(myInject(["user","topic"],
  observer(class extends React.Component<TopicPageProps, TopicPageState> {
    initState: TopicPageState = {
      isResWrite: false,
      isAutoScrollDialog: false,
      isNGDialog: false,
    };

    constructor(props: TopicPageProps) {
      super(props);
      this.state = this.initState;
      this.props.topic.load(props.match.params.id);
    }

    componentWillReceiveProps(nextProps: TopicPageProps) {
      if (this.props.match.params.id !== nextProps.match.params.id) {
        this.setState(this.initState, () => {
          this.props.topic.load(nextProps.match.params.id);
        });
      }
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
          msg={this.props.topic.msg}
          onHide={() => this.props.topic.clearMsg()} />
        {this.props.topic.data !== null
          ? (() => {
            const data = this.props.topic.data;
            return <>
              <Dialog
                title="自動スクロール"
                open={this.state.isAutoScrollDialog}
                autoScrollBodyContent={true}
                onRequestClose={() => this.setState({ isAutoScrollDialog: false })}>
                <Toggle
                  label="自動スクロール"
                  toggled={data.isAutoScroll}
                  onToggle={(_e, v) => data.setIsAutoScroll(v)} />
                <Slider
                  max={30}
                  value={data.autoScrollSpeed}
                  onChange={(_e, v) => data.setAutoScrollSpeed(v)} />
              </Dialog>
              <Dialog
                title="NG"
                open={this.state.isNGDialog}
                autoScrollBodyContent={true}
                onRequestClose={() => this.setState({ isNGDialog: false })}>
                <NG />
              </Dialog>
              <div className={style.main}>
                <Helmet>
                  <title>{data.topic.title}</title>
                </Helmet>
                <Paper className={style.header}>
                  <div className={style.subject}>
                    {data.topic.type === "fork"
                      ? <FontIcon className="material-icons">call_split</FontIcon>
                      : null}
                    {data.topic.type === "one"
                      ? <FontIcon className="material-icons">looks_one</FontIcon>
                      : null}
                    {data.topic.title}
                  </div>
                  <div>
                    <IconButton containerElement={<Link to={{
                      pathname: `/topic/${this.props.match.params.id}/data`,
                      state: { modal: true },
                    }} />}>
                      <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
                    </IconButton>
                    {data.topic.type === "normal"
                      ? <IconButton containerElement={<Link to={{
                        pathname: `/topic/${this.props.match.params.id}/fork`,
                        state: { modal: true },
                      }} />}>
                        <FontIcon className="material-icons">call_split</FontIcon>
                      </IconButton>
                      : null}
                    {data.topic.type === "normal" && this.props.user.data !== null
                      ? <IconButton containerElement={<Link to={{
                        pathname: `/topic/${this.props.match.params.id}/edit`,
                        state: { modal: true },
                      }} />}>
                        <FontIcon className="material-icons">settings</FontIcon>
                      </IconButton>
                      : null}
                    {this.props.user.data !== null
                      ? <IconButton onClick={() => data.favo()}>
                        {data.isFavo
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
                    {this.props.user.data !== null && data.topic.active
                      ? <IconButton onClick={() => this.setState({ isResWrite: !this.state.isResWrite })}>
                        <FontIcon className="material-icons">create</FontIcon>
                      </IconButton>
                      : null}
                  </div>
                </Paper>
                <ResScroll
                  className={style.reses}
                  items={data.reses}
                  onChangeItems={x => data.onChangeItems(x)}
                  newItemOrder="bottom"
                  findNewItem={() => data.findNewItem()}
                  findItem={(type, date, equal) => data.findItem(type, date, equal)}
                  width={10}
                  debounceTime={500}
                  autoScrollSpeed={data.autoScrollSpeed}
                  isAutoScroll={data.isAutoScroll}
                  scrollNewItemChange={res => data.storageSaveDate(res.date)}
                  scrollNewItem={data.scrollNewItem}
                  updateItem={data.updateItem}
                  newItem={data.newItem}
                  dataToEl={res =>
                    <Paper>
                      <Res
                        res={res}
                        update={newRes => data.updateItem.next(newRes)} />
                    </Paper>} />
                {this.state.isResWrite
                  ? <Paper className={style.resWrite}>
                    <ResWrite topic={data.topic.id} reply={null} />
                  </Paper>
                  : null}
              </div>
            </>;
          })()
          : null
        }
      </Page>;
    }
  })));
