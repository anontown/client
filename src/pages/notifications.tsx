import {
  Paper,
  RaisedButton,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  Res,
  Snack,
} from "../components";
import {
  myInject,
  UserStore,
  NotificationsStore
} from "../stores";


interface NotificationsPageProps extends RouteComponentProps<{}> {
  user: UserStore;
  notifications: NotificationsStore;
}

export interface NotificationsPageState {
}

export const NotificationsPage =
  withRouter(
    myInject(["user", "notifications"], observer(class extends React.Component<NotificationsPageProps, NotificationsPageState> {
      constructor(props: NotificationsPageProps) {
        super(props);
        this.props.notifications.load();
      }

      render() {
        return (
          <Page>
            <Helmet>
              <title>通知</title>
            </Helmet>
            <Snack
              msg={this.props.notifications.msg}
              onHide={() => this.props.notifications.clearMsg()} />
            {this.props.user.data !== null
              ? <div>
                <div>
                  <RaisedButton label="最新" onClick={() => this.props.notifications.readNew()} />
                </div>
                <div>
                  {this.props.notifications.reses.map(r => <Paper key={r.id}>
                    <Res
                      res={r}
                      update={newRes => this.props.notifications.update(newRes)} />
                  </Paper>)}
                </div>
                <div>
                  <RaisedButton label="前" onClick={() => this.props.notifications.readOld()} />
                </div>
              </div>
              : <Paper>
                ログインしてください。
    </Paper>
            }
          </Page>
        );
      }
    })));
