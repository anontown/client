import { TokenMaster } from "@anontown/api-client";
import * as React from "react";
import { connect } from "react-redux";
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import {
  lightBaseTheme,
  getMuiTheme,
  MuiThemeProvider,
} from "material-ui/styles";
import { Observable } from "rxjs";
import { updateUserData } from "../actions";
import { UserData } from "../models";
import * as pages from "../pages";
import { Store } from "../reducers";
import {
  apiClient,
  createUserData,
} from "../utils";
import * as style from "./app.scss";
import * as bs from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
const muiTheme = getMuiTheme(lightBaseTheme);

interface AppProps extends RouteComponentProps<{}> {
  user: UserData | null;
  updateUser: (user: UserData | null) => void;
}

interface AppState {
  isInit: boolean;
}

const withModal = <P extends {}>(Page: React.ComponentType<P>) => {
  return withRouter<P>((props: P & RouteComponentProps<{}>) => {
    return <bs.Modal
      show={true}
      onHide={() => {
        props.history.goBack();
      }}>
      <bs.ModalBody>
        <Page {...props} />
      </bs.ModalBody>
    </bs.Modal>
  })
};

export const App = withRouter<{}>(connect((state: Store) => ({ user: state.user }),
  dispatch => ({
    updateUser: (user: UserData | null) => { dispatch(updateUserData(user)); },
  }))
  (class extends React.Component<AppProps, AppState> {
    previousLocation = this.props.location;

    componentWillMount() {
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

    componentWillUpdate(nextProps: AppProps) {
      const { location } = this.props
      if (
        nextProps.history.action !== 'POP' &&
        (!location.state || !location.state.modal)
      ) {
        this.previousLocation = this.props.location
      }
    }

    constructor(props: AppProps) {
      super(props);
      this.state = {
        isInit: false,
      };
    }

    logout() {
      this.props.updateUser(null);
    }

    render() {
      const { location } = this.props
      const isModal = !!(
        location.state &&
        location.state.modal &&
        this.previousLocation !== location
      );

      return <MuiThemeProvider muiTheme={muiTheme}>
        {this.state.isInit
          ? <div className={style.container}>
            <bs.Navbar className={style.header}>
              <bs.Nav>
                <LinkContainer to="/" >
                  <bs.NavItem>
                    <i className="material-icons">home</i>
                  </bs.NavItem>
                </LinkContainer>
                <LinkContainer to="/topic/search">
                  <bs.NavItem>
                    <i className="material-icons">search</i>
                  </bs.NavItem>
                </LinkContainer>
                {this.props.user !== null
                  ? <LinkContainer to="/notifications">
                    <bs.NavItem>
                      <i className="material-icons">notifications</i>
                    </bs.NavItem>
                  </LinkContainer>
                  : null}
                <bs.NavDropdown title={<i className="material-icons">people</i> as any} id="hogefoo">
                  {this.props.user !== null
                    ? <LinkContainer to="/profiles">
                      <bs.MenuItem>
                        プロフ管理
                      </bs.MenuItem>
                    </LinkContainer>
                    : null}
                  {this.props.user !== null
                    ? <LinkContainer to="/messages">
                      <bs.MenuItem>
                        お知らせ
                      </bs.MenuItem>
                    </LinkContainer>
                    : null}
                  {this.props.user !== null
                    ? <LinkContainer to="/settings/account">
                      <bs.MenuItem>
                        設定
                      </bs.MenuItem>
                    </LinkContainer>
                    : null}
                  {this.props.user !== null
                    ? <bs.MenuItem onClick={() => this.logout()}>
                      ログアウト
                  </bs.MenuItem>
                    : null}
                  {this.props.user === null
                    ? <LinkContainer to="/in">
                      <bs.MenuItem>
                        ログイン/登録
                        </bs.MenuItem>
                    </LinkContainer>
                    : null}
                </bs.NavDropdown>
                <bs.NavItem href="https://document.anontown.com/"
                  target="_blank">
                  <i className="material-icons">help</i>
                </bs.NavItem>
              </bs.Nav>
            </bs.Navbar>
            <div className={style.main}>
              <Switch location={isModal ? this.previousLocation : location}>
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
                <Route path='/profile/:id' component={pages.ProfilePage} />
                <Route component={pages.NotFoundPage} />
              </Switch>
              {isModal ? <Route path='/res/:id' component={withModal(pages.ResPage)} /> : null}
              {isModal ? <Route path='/profile/:id' component={withModal(pages.ProfilePage)} /> : null}
            </div>
          </div>
          : null}
      </MuiThemeProvider>;
    }
  }));
