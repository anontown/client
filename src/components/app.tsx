import {
  IconButton,
  MenuItem,
  Toolbar
} from "material-ui";
import { IconMenu } from "./icon-menu";
import * as icons from "material-ui-icons";
import * as React from "react";
import { connect } from "react-redux";
import {
  NavLink,
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
  MuiThemeProvider,
  createMuiTheme,
} from "material-ui";
import {
  red,
  green,
  blue
} from 'material-ui/colors';

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue
  },
  error: red,
  type: 'dark'
});

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

  changeTheme() {

  }

  logout() {
    this.props.updateUser(null);
  }

  render() {
    return <MuiThemeProvider theme={theme}>
      <div>
        <Toolbar className={style.toolbar}>
          <NavLink to="/" >
            <IconButton>
              <icons.Home />
            </IconButton>
          </NavLink>
          <NavLink to="/topic/search">
            <IconButton>
              <icons.Search />
            </IconButton>
          </NavLink>
          {this.props.user !== null
            ? <NavLink to="/notifications">
              <IconButton>
                <icons.Notifications />
              </IconButton>
            </NavLink>
            : null}
          <IconMenu
            icon={<icons.VerifiedUser />}
            createMenu={onClick =>
              this.props.user !== null
                ? [
                  <NavLink to="/profiles"><MenuItem onClick={onClick}>プロフ管理</MenuItem></NavLink>,
                  <NavLink to="/messages"><MenuItem onClick={onClick} >お知らせ</MenuItem></NavLink>,
                  <NavLink to="/settings/account"><MenuItem onClick={onClick}  >設定</MenuItem></NavLink>,
                  <NavLink to="/profiles"><MenuItem onClick={onClick}  >プロフ管理</MenuItem></NavLink>,
                  <MenuItem onClick={() => {
                    this.logout();
                    onClick();
                  }} >ログアウト</MenuItem>,
                ]
                : <NavLink to="/in"><MenuItem onClick={onClick}>ログイン/登録</MenuItem></NavLink>}
          />
          <a
            href="https://document.anontown.com/"
            target="_blank">
            <IconButton>
              <icons.Book />
            </IconButton>
          </a>
          <IconButton onClick={() => this.changeTheme()}>
            <icons.InvertColors />
          </IconButton>
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
    </MuiThemeProvider>;
  }
});
