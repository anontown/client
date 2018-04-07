import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
  RaisedButton,
} from "material-ui";
import * as React from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import {
  Md,
  Page,
  Snack,
} from "../components";
import { appInject, UserStore } from "../stores";
import { apiClient, dateFormat } from "../utils";

interface MessagesPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface MessagesPageState {
  msgs: Im.List<api.Msg>;
  snackMsg: null | string;
}

export const MessagesPage = withRouter(appInject(class extends React.Component<MessagesPageProps, MessagesPageState> {
  private limit = 50;

  constructor(props: MessagesPageProps) {
    super(props);
    this.state = {
      msgs: Im.List(),
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
              {this.state.msgs.map(m =>
                <Paper>
                  <div>{dateFormat.format(m.date)}</div>
                  <Md text={m.text} />
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

  findNew() {
    if (this.props.user.data === null) {
      return;
    }

    apiClient.findMsgNew(this.props.user.data.token,
      {
        limit: this.limit,
      })
      .map(msgs => Im.List(msgs))
      .subscribe(msgs => {
        this.setState({ msgs });
      }, () => {
        this.setState({ snackMsg: "メッセージ取得に失敗" });
      });
  }

  readNew() {
    if (this.props.user.data === null) {
      return;
    }

    const first = this.state.msgs.first();
    if (first === undefined) {
      this.findNew();
    } else {
      apiClient.findMsg(this.props.user.data.token,
        {
          type: "after",
          equal: false,
          date: first.date,
          limit: this.limit,
        })
        .map(msgs => Im.List(msgs))
        .map(msgs => msgs.concat(this.state.msgs))
        .subscribe(msgs => {
          this.setState({ msgs });
        }, () => {
          this.setState({ snackMsg: "メッセージ取得に失敗" });
        });
    }
  }

  readOld() {
    if (this.props.user.data === null) {
      return;
    }
    const last = this.state.msgs.last();

    if (last === undefined) {
      this.findNew();
    } else {
      apiClient.findMsg(this.props.user.data.token,
        {
          type: "before",
          equal: false,
          date: last.date,
          limit: this.limit,
        })
        .map(msgs => this.state.msgs.concat(msgs))
        .subscribe(msgs => {
          this.setState({ msgs });
        }, () => {
          this.setState({ snackMsg: "メッセージ取得に失敗" });
        });
    }
  }
}));
