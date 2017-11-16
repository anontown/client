import * as React from "react";
import {
  Paper,
  Tab,
  Tabs
} from "material-ui";
import { Page } from "../components";
import {
  RouteComponentProps,
  Link,
  withRouter
} from "react-router-dom";
import { UserData } from "../models";
import { connect } from "react-redux";
import { Store } from "../reducers";
import {
  TagFavo,
  TopicFavo
} from "../components";

interface HomePageProps extends RouteComponentProps<{}> {
  user: UserData | null
}


export const HomePage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))(function (props: HomePageProps) {
  return <Page column={1}>
    {props.user !== null
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
}));