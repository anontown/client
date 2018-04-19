import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
  Tab,
  Tabs,
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
  ProfileEditor,
  Snack,
} from "../components";
import { myInject, UserStore } from "../stores";
import { apiClient, list } from "../utils";

interface ProfilesPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface ProfilesPageState {
  profiles: Im.List<api.Profile>;
  snackMsg: null | string;
}

export const ProfilesPage = withRouter(myInject(["user"],
  observer(class extends React.Component<ProfilesPageProps, ProfilesPageState> {
    constructor(props: ProfilesPageProps) {
      super(props);
      this.state = {
        profiles: Im.List(),
        snackMsg: null,
      };

      (async () => {
        try {
          if (this.props.user.data !== null) {
            this.setState({
              profiles: Im.List(await apiClient.findProfileAll(this.props.user.data.token)),
            });
          }
        } catch {
          this.setState({
            snackMsg: "プロフィール取得に失敗",
          });
        }
      })();
    }

    render() {
      return (
        <Page>
          <Helmet>
            <title>プロフィール管理</title>
          </Helmet>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.props.user.data !== null
            ? <Tabs>
              <Tab label="編集">
                {this.state.profiles.map(p =>
                  <ProfileEditor
                    key={p.id}
                    profile={p}
                    onUpdate={newProfile => this.update(newProfile)} />)}
              </Tab>
              <Tab label="新規">
                <ProfileEditor
                  profile={null}
                  onAdd={p => this.add(p)} />
              </Tab>
            </Tabs>
            : <Paper>
              ログインしてください。
        </Paper>
          }
        </Page>
      );
    }

    update(profile: api.Profile) {
      this.setState({
        profiles: list.update(this.state.profiles, profile),
      });
    }

    add(profile: api.Profile) {
      this.setState({
        profiles: this.state.profiles.push(profile),
      });
    }
  })));
