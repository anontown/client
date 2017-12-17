import * as api from "@anontown/api-types";
import * as Im from "immutable";
import {
  Paper,
  Tab,
  Tabs,
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import {
  Page,
  ProfileEditor,
  Snack,
} from "../components";
import { UserData } from "../models";
import { Store } from "../reducers";
import { apiClient, list } from "../utils";

interface ProfilesPageProps extends RouteComponentProps<{}> {
  user: UserData | null;
}

export interface ProfilesPageState {
  profiles: Im.List<api.Profile>;
  snackMsg: null | string;
}

export const ProfilesPage = withRouter(connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<ProfilesPageProps, ProfilesPageState> {
    constructor(props: ProfilesPageProps) {
      super(props);
      this.state = {
        profiles: Im.List(),
        snackMsg: null,
      };

      if (this.props.user !== null) {
        apiClient.findProfileAll(this.props.user.token)
          .subscribe(profiles => {
            this.setState({ profiles: Im.List(profiles) });
          }, () => {
            this.setState({ snackMsg: "プロフィール取得に失敗" });
          });
      }
    }

    render() {
      return (
        <Page>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.props.user !== null
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
  }));
