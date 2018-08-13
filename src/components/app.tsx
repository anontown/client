import {
  FontIcon,
  IconButton,
  IconMenu,
  MenuItem,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle,
} from "material-ui";
import {
  getMuiTheme,
  lightBaseTheme,
  MuiThemeProvider,
} from "material-ui/styles";
import { observer } from "mobx-react";
import * as React from "react";
import {
  Link,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import { BUILD_DATE, gaID } from "../env";
import * as pages from "../pages";
import { myInject, UserStore } from "../stores";
import {
  createUserData,
  dateFormat,
  gqlClient,
  createHeaders,
} from "../utils";
import * as style from "./app.scss";
import { getToken } from "./app.gql";
import { getToken as getTokenResult } from "./_gql/getToken";

declare const gtag: any;

const muiTheme = getMuiTheme(lightBaseTheme);

interface AppProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AppState {
  isInit: boolean
}

export const App = myInject(["user"], observer(withRouter(class extends React.Component<AppProps, AppState> {
  previousLocation = this.props.location;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      isInit: false
    };
    this.changeLocation(this.props);
  }

  componentDidUpdate(prevProps: AppProps) {
    if (this.props.location !== prevProps.location) {
      this.changeLocation(this.props);
    }
  }

  changeLocation(prop: AppProps) {
    const path = prop.location.pathname;
    console.log("ga", path);
    gtag("config", gaID, {
      page_path: path,
    });
  }

  async componentWillMount() {
    try {
      const tokenStr = localStorage.getItem("token");
      let token;
      if (tokenStr !== null) {
        token = JSON.parse(tokenStr) as { id: string, key: string };
      } else {
        throw Error();
      }
      let res = await gqlClient.query<getTokenResult>({
        query: getToken,
        context: {
          headers: createHeaders(token.id, token.key)
        }
      });
      if (res.data.token.__typename === "TokenGeneral") {
        throw Error();
      }
      this.props.user.initData(await createUserData(res.data.token));
      this.setState({ isInit: true });
    } catch {
      this.props.user.initData(null);
      this.setState({ isInit: true });
    }
  }

  componentWillUpdate(nextProps: AppProps) {
    const { location } = this.props;
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  logout() {
    this.props.user.userChange(null);
  }

  render() {
    const { location } = this.props;
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    );

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {this.state.isInit
          ? <div className={style.container}>
            <Toolbar className={style.header}>
              <ToolbarGroup firstChild={true} className={style.big}>
                <ToolbarTitle text="Anontown" />
                <ToolbarTitle text={`build:${dateFormat.format(BUILD_DATE)}`}
                  style={{ fontSize: "0.5rem" }} />
              </ToolbarGroup>
              <ToolbarGroup>
                <IconButton containerElement={<Link to="/" />}>
                  <FontIcon className="material-icons">home</FontIcon>
                </IconButton>
                <IconButton containerElement={<Link to="/topic/search" />}>
                  <FontIcon className="material-icons">search</FontIcon>
                </IconButton>
                {this.props.user.data !== null
                  ? <IconButton containerElement={<Link to="/notifications" />}>
                    <FontIcon className="material-icons">notifications</FontIcon>
                  </IconButton>
                  : null}
                <IconMenu
                  iconButtonElement={
                    <IconButton touch={true}>
                      <FontIcon className="material-icons">people</FontIcon>
                    </IconButton>}>
                  {this.props.user.data !== null
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
                  <FontIcon className="material-icons">help</FontIcon>
                </IconButton>
              </ToolbarGroup>
            </Toolbar>
            <div className={style.main}>
              <Switch location={isModal ? this.previousLocation : location}>
                <Route exact={true} path="/" component={pages.HomePage} />
                <Route exact={true} path="/res/:id" component={pages.ResPage} />
                <Route exact={true} path="/res/:id/reply" component={pages.ResReplyPage} />
                <Route exact={true} path="/hash/:hash" component={pages.ResHashPage} />
                <Route exact={true} path="/topic/search" component={pages.TopicSearchPage} />
                <Route exact={true} path="/topic/create" component={pages.TopicCreatePage} />
                <Route exact={true} path="/topic/:id" component={pages.TopicPage} />
                <Route exact={true} path="/topic/:id/data" component={pages.TopicDataPage} />
                <Route exact={true} path="/topic/:id/fork" component={pages.TopicForkPage} />
                <Route exact={true} path="/topic/:id/edit" component={pages.TopicEditPage} />
                <Route exact={true} path="/profiles" component={pages.ProfilesPage} />
                <Route exact={true} path="/notifications" component={pages.NotificationsPage} />
                <Route exact={true} path="/messages" component={pages.MessagesPage} />
                <Route exact={true} path="/in" component={pages.InPage} />
                <Route exact={true} path="/auth" component={pages.AuthPage} />
                <Route path="/settings" component={pages.SettingsPage} />
                <Route exact={true} path="/profile/:id" component={pages.ProfilePage} />
                <Route component={pages.NotFoundPage} />
              </Switch>
              {isModal ? <Route path="/res/:id" component={pages.ResModal} /> : null}
              {isModal ? <Route path="/res/:id/reply" component={pages.ResReplyModal} /> : null}
              {isModal ? <Route path="/profile/:id" component={pages.ProfileModal} /> : null}
              {isModal ? <Route path="/topic/:id/data" component={pages.TopicDataModal} /> : null}
              {isModal ? <Route path="/topic/:id/fork" component={pages.TopicForkModal} /> : null}
              {isModal ? <Route path="/topic/:id/edit" component={pages.TopicEditModal} /> : null}
              {isModal ? <Route path="/hash/:hash" component={pages.ResHashModal} /> : null}
            </div>
          </div>
          : null}
      </MuiThemeProvider>
    );
  }
})));
