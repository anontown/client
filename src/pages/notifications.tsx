import * as Im from "immutable";
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
  ResSeted,
} from "../models";
import { myInject, UserStore } from "../stores";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";

interface NotificationsPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface NotificationsPageState {
  reses: Im.List<ResSeted>;
  snackMsg: null | string;
}

export const NotificationsPage =
  withRouter(
    myInject(["user"], observer(class extends React.Component<NotificationsPageProps, NotificationsPageState> {
      private limit = 50;

      constructor(props: NotificationsPageProps) {
        super(props);
        this.state = {
          reses: Im.List(),
          snackMsg: null,
        };

        this.findNew();
      }

      render() {
        return (
          <Page>
            <Helmet>
              <title>通知</title>
            </Helmet>
            <Snack
              msg={this.state.snackMsg}
              onHide={() => this.setState({ snackMsg: null })} />
            {this.props.user.data !== null
              ? <div>
                <div>
                  <RaisedButton label="最新" onClick={() => this.readNew()} />
                </div>
                <div>
                  {this.state.reses.map(r => <Paper key={r.id}>
                    <Res
                      res={r}
                      update={newRes => this.update(newRes)} />
                  </Paper>)}
                </div>
                <div>
                  <RaisedButton label="前" onClick={() => this.readOld()} />
                </div>
              </div>
              : <Paper>
                ログインしてください。
    </Paper>
            }
          </Page>
        );
      }

      update(res: ResSeted) {
        this.setState({ reses: list.update(this.state.reses, res) });
      }

      async findNew() {
        if (this.props.user.data === null) {
          return;
        }
        const token = this.props.user.data.token;
        try {
          const reses = await resSetedCreate.resSet(token, await apiClient.findResNoticeNew(token,
            {
              limit: this.limit,
            }));
          this.setState({ reses: Im.List(reses) });
        } catch {
          this.setState({ snackMsg: "レス取得に失敗" });
        }
      }

      async readNew() {
        if (this.props.user.data === null) {
          return;
        }

        const token = this.props.user.data.token;

        const first = this.state.reses.first();
        if (first === undefined) {
          await this.findNew();
        } else {
          try {
            const reses = await resSetedCreate.resSet(token, await apiClient.findResNotice(token,
              {
                type: "after",
                equal: false,
                date: first.date,
                limit: this.limit,
              }));
            this.setState({ reses: Im.List(reses).concat(this.state.reses) });
          } catch {
            this.setState({ snackMsg: "レス取得に失敗" });
          }
        }
      }

      async readOld() {
        if (this.props.user.data === null) {
          return;
        }

        const token = this.props.user.data.token;

        const last = this.state.reses.last();

        if (last === undefined) {
          await this.findNew();
        } else {
          try {
            const reses = await resSetedCreate.resSet(token, await apiClient.findResNotice(token,
              {
                type: "before",
                equal: false,
                date: last.date,
                limit: this.limit,
              }));
            this.setState({ reses: this.state.reses.concat(reses) });
          } catch {
            this.setState({ snackMsg: "レス取得に失敗" });
          }
        }
      }
    })));
