import {
  IconButton,
  IconMenu,
  MenuItem,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
} from "material-ui";
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

interface UnconnectedAppProps {
  user: UserData | null;
  updateUser: (user: UserData | null) => void;
}

export type AppProps = ObjectOmit<UnconnectedAppProps, "user" | "updateUser">;

interface AppState {
  showSideMenu: boolean;
}

export const App = connect((state: Store) => ({ user: state.user }), dispatch => ({
    updateUser: (user: UserData | null) => { dispatch(updateUserData(user)); },
  }))(class extends React.Component<UnconnectedAppProps, AppState> {
    constructor(props: UnconnectedAppProps) {
      super(props);
      this.state = {
        showSideMenu: false,
      };
    }

    render() {
      return (
        <div>
          <Toolbar style={{
            position: "fixed",
            top: "0px",
            left: "0px",
            right: "0px",
          }}>
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
                    <icons.ActionVerifiedUser />
                  </IconButton>
                }>
                {this.props.user !== null
                  ? [
                    <MenuItem primaryText="プロフ管理" containerElement={<Link to="/profiles" />} />,
                    <MenuItem primaryText="お知らせ" containerElement={<Link to="/messages" />} />,
                    <MenuItem primaryText="設定" containerElement={<Link to="/settings/account" />} />,
                    <MenuItem primaryText="プロフ管理" containerElement={<Link to="/profiles" />} />,
                    <MenuItem primaryText="ログアウト" onClick={() => this.logout()} />,
                  ]
                  : <MenuItem primaryText="ログイン/登録" containerElement={<Link to="/in" />} />}

              </IconMenu>
              <IconButton containerElement={<a mat-menu-item
                href="https://document.anontown.com/"
                target="_blank" />}>
                <icons.ActionBook />
              </IconButton>
              <IconButton onClick={() => this.changeTheme()}>
                <icons.ActionInvertColors />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
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
        </div >
      );
    }
  });
