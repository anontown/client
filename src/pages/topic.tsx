import {
  Dialog,
  FontIcon,
  IconButton,
  Paper,
  Slider,
  Toggle,
} from "material-ui";
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
  TopicFavo,
} from "../components";
import * as style from "./topic.scss";
import * as G from "../../generated/graphql";
import { useUserContext } from "src/utils";
import * as rx from "rxjs";
// TODO:NGのtransparent

interface TopicPageProps extends RouteComponentProps<{ id: string }> {

}

export const TopicPage = withRouter((props: TopicPageProps) => {
  const [isResWrite, setIsResWrite] = React.useState(false);
  const [isAutoScrollDialog, setIsAutoScrollDialog] = React.useState(false);
  const [isNGDialog, setIsNGDialog] = React.useState(false);
  const user = useUserContext();
  const topics = G.FindTopics.use({ variables: { query: { id: [props.match.params.id] } } });
  const topic = topics.data !== undefined ? topics.data.topics[0] : null;
  const [autoScrollSpeed, setAutoScrollSpeed] = React.useState(15);
  const [isAutoScroll, setIsAutoScroll] = React.useState(false);
  const scrollNewItem = React.useRef(new rx.ReplaySubject<string>(1));
  const items = React.useRef<G.Res.Fragment[]>([]);
  let initDate;
  if (user.value !== null) {
    const topicRead = user.value.storage.topicRead.get(props.match.params.id);
    if (topicRead !== undefined) {
      initDate = topicRead.date;
    } else {
      initDate = new Date().toISOString();
    }
  } else {
    initDate = new Date().toISOString();
  }

  const isFavo = user.value !== null && user.value.storage.topicFavo.has(props.match.params.id);

  function storageSaveDate(date: string | null) {
    if (user.value === null || topic === null) {
      return;
    }
    const storage = user.value.storage;
    if (date === null) {
      const storageRes = storage.topicRead.get(props.match.params.id);
      if (storageRes !== undefined) {
        date = storageRes.date;
      } else {
        const first = items.current.first();
        if (first === undefined) {
          return;
        }
        date = first.date;
      }
    }
    const dateNonNull = date;
    user.update({
      ...user.value,
      storage: {
        ...storage,
        topicRead: storage.topicRead.update(topic.id, x => ({
          ...x,
          date: dateNonNull,
          count: topic.resCount,
        })),
      }
    });
  }

  React.useEffect(() => {
    storageSaveDate(null);
  }, [topic !== null ? topic.resCount : null]);

  return <Page
    disableScroll={true}
    sidebar={user.value !== null
      ? <TopicFavo detail={false} userData={user.value} />
      : undefined}>
    <Helmet>
      <title>トピック</title>
    </Helmet>
    {topic !== null
      ? <>
        <Dialog
          title="自動スクロール"
          open={isAutoScrollDialog}
          autoScrollBodyContent={true}
          onRequestClose={() => setIsAutoScrollDialog(false)}>
          <Toggle
            label="自動スクロール"
            toggled={isAutoScroll}
            onToggle={(_e, v) => setIsAutoScroll(v)} />
          <Slider
            max={30}
            value={autoScrollSpeed}
            onChange={(_e, v) => setAutoScrollSpeed(v)} />
        </Dialog>
        {user.value !== null ?
          <Dialog
            title="NG"
            open={isNGDialog}
            autoScrollBodyContent={true}
            onRequestClose={() => setIsNGDialog(false)}>
            <NG
              userData={user.value}
              onChangeStorage={v => {
                if (user.value !== null) {
                  user.update({
                    ...user.value,
                    storage: v
                  });
                }
              }} />
          </Dialog>
          : null
        }
        <div className={style.main}>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <Paper className={style.header}>
            <div className={style.subject}>
              {topic.__typename === "TopicFork"
                ? <FontIcon className="material-icons">call_split</FontIcon>
                : null}
              {topic.__typename === "TopicOne"
                ? <FontIcon className="material-icons">looks_one</FontIcon>
                : null}
              {topic.title}
            </div>
            <div>
              <IconButton containerElement={<Link to={{
                pathname: `/topic/${props.match.params.id}/data`,
                state: { modal: true },
              }} />}>
                <FontIcon className="material-icons">keyboard_arrow_down</FontIcon>
              </IconButton>
              {topic.__typename === "TopicNormal"
                ? <IconButton containerElement={<Link to={{
                  pathname: `/topic/${props.match.params.id}/fork`,
                  state: { modal: true },
                }} />}>
                  <FontIcon className="material-icons">call_split</FontIcon>
                </IconButton>
                : null}
              {topic.__typename === "TopicNormal" && user.value !== null
                ? <IconButton containerElement={<Link to={{
                  pathname: `/topic/${props.match.params.id}/edit`,
                  state: { modal: true },
                }} />}>
                  <FontIcon className="material-icons">settings</FontIcon>
                </IconButton>
                : null}
              {user.value !== null
                ? <IconButton onClick={() => {
                  if (user.value === null) {
                    return;
                  }
                  const storage = user.value.storage;
                  const tf = storage.topicFavo;
                  user.update({
                    ...user.value,
                    storage: {
                      ...storage,
                      topicFavo: isFavo ? tf.delete(props.match.params.id) : tf.add(props.match.params.id),
                    }
                  })
                }}>
                  {isFavo
                    ? <FontIcon className="material-icons">star</FontIcon>
                    : <FontIcon className="material-icons">star_border</FontIcon>}
                </IconButton>
                : null}
              <IconButton onClick={() => setIsAutoScrollDialog(true)}>
                <FontIcon className="material-icons">play_circle_outline</FontIcon>
              </IconButton>
              <IconButton onClick={() => setIsNGDialog(true)}>
                <FontIcon className="material-icons">mood_bad</FontIcon>
              </IconButton>
              {user.value !== null && topic.active
                ? <IconButton onClick={() => setIsResWrite(!isResWrite)}>
                  <FontIcon className="material-icons">create</FontIcon>
                </IconButton>
                : null}
            </div>
          </Paper>
          <Scroll<G.Res.Fragment, G.FindReses.Query, G.FindReses.Variables, G.ResAdded.Subscription, G.ResAdded.Variables>
            query={G.FindReses.Document}
            queryVariables={date => ({ query: { date, topic: topic.id } })}
            queryResultConverter={x => x.reses}
            queryResultMapper={(x, f) => ({ ...x, reses: f(x.reses) })}
            subscription={G.ResAdded.Document}
            subscriptionVariables={{ topic: topic.id }}
            subscriptionResultConverter={x => x.resAdded.res}
            className={style.reses}
            newItemOrder="bottom"
            width={10}
            debounceTime={500}
            autoScrollSpeed={autoScrollSpeed}
            isAutoScroll={isAutoScroll}
            scrollNewItemChange={res => storageSaveDate(res.date)}
            scrollNewItem={scrollNewItem.current}
            initDate={initDate}
            onSubscription={x => {
              topics.updateQuery(t => ({
                ...t,
                topics: t.topics.map(t => ({ ...t, resCount: x.resAdded.count }))
              }));
            }}
            dataToEl={res =>
              <Paper>
                <Res
                  res={res} />
              </Paper>}
            changeItems={x => {
              items.current = x;
            }} />
          {isResWrite && user.value !== null
            ? <Paper className={style.resWrite}>
              <ResWrite
                topic={topic.id}
                reply={null}
                userData={user.value}
                changeStorage={x => {
                  if (user.value !== null) {
                    user.update({
                      ...user.value,
                      storage: x
                    })
                  }
                }} />
            </Paper>
            : null}
        </div>
      </>
      : null
    }
  </Page>;
});
