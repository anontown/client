import * as React from "react";
import {
  Paper,
  Tab,
  Tabs
} from "material-ui";
import { Page } from "../components";
import {
  RouteComponentProps,
  Link
} from "react-router-dom";
import { UserData } from "../models";
import { ObjectOmit } from "typelevel-ts";
import { connect } from "react-redux";
import { Store } from "../reducers";
import {
  TagFavo,
  TopicFavo
} from "../components";

type _HomePageProps = {
  user: UserData | null
} & RouteComponentProps<{}>;

export type HomPageProps = ObjectOmit<_HomePageProps, 'user'>;

function _HomePage(props: _HomePageProps) {
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
}

export const HomePage = connect((state: Store) => ({ user: state.user }))(_HomePage);