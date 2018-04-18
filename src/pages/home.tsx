import {
  Paper,
  Tab,
  Tabs,
} from "material-ui";
import * as React from "react";
import {
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page } from "../components";
import {
  TagFavo,
  TopicFavo,
} from "../components";
import { myInject, UserStore } from "../stores";
import { Helmet } from "react-helmet";
import { observer } from "mobx-react";

interface HomePageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export const HomePage = withRouter(myInject(["user"], observer
  ((props: HomePageProps) => {
    return <Page>
      <Helmet>
        <title>Anontown</title>
      </Helmet>
      {props.user.data !== null
        ? <Tabs>
          <Tab label="トピック">
            <TopicFavo detail={true} />
          </Tab>
          <Tab label="タグ">
            <TagFavo />
          </Tab>
        </Tabs>
        : <Paper>
          <h1>匿名掲示板Anontownへようこそ</h1>
          <ul>
            <li>
              <Link to="/topic/search">トピック一覧</Link>
            </li>
            <li>
              <a href="https://document.anontown.com/"
                target="_blank">説明書</a>
            </li>
          </ul>
        </Paper>}
    </Page>;
  })));
