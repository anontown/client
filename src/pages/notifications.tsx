import * as Im from "immutable";
import {
  Paper,
  RaisedButton,
} from "material-ui";
import * as React from "react";
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
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";
import { UserStore, appInject } from "../stores";


interface NotificationsPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface NotificationsPageState {
  reses: Im.List<ResSeted>;
  snackMsg: null | string;
}

export const NotificationsPage = withRouter(appInject(class extends React.Component<NotificationsPageProps, NotificationsPageState> {
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

  findNew() {
    if (this.props.user.data === null) {
      return;
    }
    const token = this.props.user.data.token;

    apiClient.findResNoticeNew(token,
      {
        limit: this.limit,
      })
      .mergeMap(reses => resSetedCreate.resSet(token, reses))
      .map(reses => Im.List(reses))
      .subscribe(reses => {
        this.setState({ reses });
      }, () => {
        this.setState({ snackMsg: "レス取得に失敗" });
      });
  }

  readNew() {
    if (this.props.user.data === null) {
      return;
    }

    const token = this.props.user.data.token;

    const first = this.state.reses.first();
    if (first === undefined) {
      this.findNew();
    } else {
      apiClient.findResNotice(token,
        {
          type: "after",
          equal: false,
          date: first.date,
          limit: this.limit,
        })
        .mergeMap(reses => resSetedCreate.resSet(token, reses))
        .map(reses => Im.List(reses))
        .map(reses => reses.concat(this.state.reses))
        .subscribe(reses => {
          this.setState({ reses });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗" });
        });
    }
  }

  readOld() {
    if (this.props.user.data === null) {
      return;
    }

    const token = this.props.user.data.token;

    const last = this.state.reses.last();

    if (last === undefined) {
      this.findNew();
    } else {
      apiClient.findResNotice(token,
        {
          type: "before",
          equal: false,
          date: last.date,
          limit: this.limit,
        })
        .mergeMap(reses => resSetedCreate.resSet(token, reses))
        .map(reses => this.state.reses.concat(reses))
        .subscribe(reses => {
          this.setState({ reses });
        }, () => {
          this.setState({ snackMsg: "レス取得に失敗" });
        });
    }
  }
}));
