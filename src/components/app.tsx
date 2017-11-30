import {
  IconButton,
  IconMenu,
  MenuItem,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
} from "material-ui";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as icons from "material-ui/svg-icons";
import * as React from "react";
import { connect } from "react-redux";
import {
  Link,
  Route,
  Switch,
} from "react-router-dom";
import { ObjectOmit } from "typelevel-ts";
import { updateUserData } from "../actions";
import { UserData } from "../models";
import * as pages from "../pages";
import { Store } from "../reducers";
import * as style from "./app.scss";
import {
  createUserData,
  apiClient
} from "../utils";
import { TokenMaster } from "@anontown/api-client";
import { Observable } from "rxjs";
import { throttle } from "rxjs/operator/throttle";

const muiTheme = getMuiTheme(darkBaseTheme);

interface UnconnectedAppProps {
  user: UserData | null;
  updateUser: (user: UserData | null) => void;
}

export type AppProps = ObjectOmit<UnconnectedAppProps, "user" | "updateUser">;

interface AppState {
  isInit: boolean
}

export const App = connect((state: Store) => ({ user: state.user }), dispatch => ({
  updateUser: (user: UserData | null) => { dispatch(updateUserData(user)); },
}))(class extends React.Component<UnconnectedAppProps, AppState> {
  constructor(props: UnconnectedAppProps) {
    super(props);
    this.state = {
      isInit: false
    };

    Observable.of(localStorage.getItem("token"))
      .map(tokenStr => {
        if (tokenStr !== null) {
          return { ...JSON.parse(tokenStr), type: "master" } as TokenMaster;
        } else {
          throw Error();
        }
      })
      .mergeMap(token => apiClient.findTokenOne(token))
      .mergeMap(token => createUserData(token))
      .subscribe(data => {
        this.props.updateUser(data);
        this.setState({ isInit: true });
      }, () => {
        this.props.updateUser(null);
        this.setState({ isInit: true });
      });
  }

  changeTheme() {
    // TODO: こんどやる
  }

  logout() {
    this.props.updateUser(null);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {this.state.isInit
          ? <div className={style.container}>
            <Toolbar className={style.header}>
              <ToolbarGroup firstChild={true}>
                <ToolbarTitle text="Anontown" />
              </ToolbarGroup>
              <ToolbarGroup>
                <IconButton containerElement={<Link to="/" />}>
                  <icons.ActionHome />
                </IconButton>
                <IconButton containerElement={<Link to="/topic/search" />}>
                  <icons.ActionSearch />
                </IconButton>
                {this.props.user !== null
                  ? <IconButton containerElement={<Link to="/notifications" />}>
                    <icons.NotificationAdb />
                  </IconButton>
                  : null}
                <IconMenu
                  iconButtonElement={
                    <IconButton touch={true}>
                      <icons.SocialPeople />
                    </IconButton>
                  }>
                  {this.props.user !== null
                    ? [
                      <MenuItem
                        key="1"
                        primaryText="プロフ管理"
                        containerElement={<Link to="/profiles" />} />,
                      <MenuItem
                        key="2"
                        primaryText="お知らせ"
                        containerElement={<Link to="/messages" />} />,
                      <MenuItem
                        key="3"
                        primaryText="設定"
                        containerElement={<Link to="/settings/account" />} />,
                      <MenuItem
                        key="4"
                        primaryText="プロフ管理"
                        containerElement={<Link to="/profiles" />} />,
                      <MenuItem
                        key="5"
                        primaryText="ログアウト"
                        onClick={() => this.logout()} />,
                    ]
                    : <MenuItem
                      primaryText="ログイン/登録"
                      containerElement={<Link to="/in" />} />}

                </IconMenu>
                <IconButton containerElement={<a
                  href="https://document.anontown.com/"
                  target="_blank" />}>
                  <icons.ActionBook />
                </IconButton>
                <IconButton onClick={() => this.changeTheme()}>
                  <icons.ActionInvertColors />
                </IconButton>
              </ToolbarGroup>
            </Toolbar>
            <div className={style.main}>
              <Switch>
                <Route exact path="/" component={pages.HomePage} />
                <Route path="/res/:id" component={pages.ResPage} />
                <Route path="/topic/search" component={pages.TopicSearchPage} />
                <Route path="/topic/create" component={pages.TopicCreatePage} />
                <Route path="/topic/:id" component={pages.TopicPage} />
                <Route path="/profiles" component={pages.ProfilesPage} />
                <Route path="/notifications" component={pages.NotificationsPage} />
                <Route path="/messages" component={pages.MessagesPage} />
                <Route path="/in" component={pages.InPage} />
                <Route path="/auth" component={pages.AuthPage} />
                <Route path="/settings" component={pages.SettingsPage} />
                <Route component={pages.NotFoundPage} />
              </Switch>
            </div>
          </div>
          : null}
      </MuiThemeProvider >
    );
  }
});
