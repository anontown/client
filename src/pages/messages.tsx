import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
  RaisedButton,
} from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import {
  Md,
  Page,
  Snack,
  UserSwitch,
} from "../components";
import { myInject, UserStore } from "../stores";
import { apiClient, dateFormat } from "../utils";

interface MessagesPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface MessagesPageState {
  msgs: Im.List<api.Msg>;
  snackMsg: null | string;
}

export const MessagesPage = withRouter(myInject(["user"],
  observer(class extends React.Component<MessagesPageProps, MessagesPageState> {
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
          <Helmet>
            <title>お知らせ</title>
          </Helmet>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          <UserSwitch userData={this.props.user.data} render={() => <div>
            <div>
              <RaisedButton label="最新" onClick={() => this.readNew()} />
            </div>
            <div>
              {this.state.msgs.map(m =>
                <Paper key={m.id}>
                  <div>{dateFormat.format(m.date)}</div>
                  <Md text={m.text} />
                </Paper>)}
            </div>
            <div>
              <RaisedButton label="前" onClick={() => this.readOld()} />
            </div>
          </div>} />
        </Page>
      );
    }

    async findNew() {
      if (this.props.user.data === null) {
        return;
      }

      try {
        const msgs = await apiClient.findMsg(this.props.user.data.token,
          {
            limit: this.limit,
            date: new Date().toISOString(),
            type: "lte"
          });
        this.setState({ msgs: Im.List(msgs) });
      } catch {
        this.setState({ snackMsg: "メッセージ取得に失敗" });
      }
    }

    async readNew() {
      if (this.props.user.data === null) {
        return;
      }

      const first = this.state.msgs.first();
      if (first === undefined) {
        await this.findNew();
      } else {
        try {
          const msgs = await apiClient.findMsg(this.props.user.data.token,
            {
              type: "gt",
              date: first.date,
              limit: this.limit,
            });
          this.setState({ msgs: Im.List(msgs).concat(this.state.msgs) });
        } catch {
          this.setState({ snackMsg: "メッセージ取得に失敗" });
        }
      }
    }

    async readOld() {
      if (this.props.user.data === null) {
        return;
      }
      const last = this.state.msgs.last();

      if (last === undefined) {
        await this.findNew();
      } else {
        try {
          const msgs = await apiClient.findMsg(this.props.user.data.token,
            {
              type: "lt",
              date: last.date,
              limit: this.limit,
            });

          this.setState({ msgs: this.state.msgs.concat(msgs) });
        } catch {
          this.setState({ snackMsg: "メッセージ取得に失敗" });
        }
      }
    }
  })));
