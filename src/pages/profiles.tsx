import * as React from 'react';
import { UserData } from "../models";
import { apiClient, list } from "../utils";
import { connect } from "react-redux";
import { Store } from "../reducers";
import {
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import {
  Snack,
  Page,
  ProfileEditor
} from "../components";
import {
  Paper
} from "material-ui";
import * as Im from 'immutable';
import * as api from "@anontown/api-types";

interface ProfilesPageProps extends RouteComponentProps<{}> {
  user: UserData | null
};

export interface ProfilesPageState {
  profiles: Im.List<api.Profile>
  snackMsg: null | string,
}

export const ProfilesPage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))(class extends React.Component<ProfilesPageProps, ProfilesPageState> {
  constructor(props: ProfilesPageProps) {
    super(props);
    this.state = {
      profiles: Im.List(),
      snackMsg: null
    };

    if (this.props.user !== null) {
      apiClient.findProfileAll(this.props.user.token)
        .subscribe(profiles => {
          this.setState({ profiles: Im.List(profiles) });
        }, () => {
          this.setState({ snackMsg: 'プロフィール取得に失敗' });
        });
    }
  }

  render() {
    return (
      <Page column={1}>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.props.user !== null
          ? <div>
            <ProfileEditor
              profile={null}
              onAdd={p => this.add(p)} />
            <div>
              {this.state.profiles.map(p =>
                <ProfileEditor
                  profile={p}
                  onUpdate={p => this.update(p)} />)}
            </div>
          </div>
          : <Paper>
            ログインしてください。
        </Paper>
        }
      </Page>
    );
  }

  update(profile: api.Profile) {
    this.setState({
      profiles: list.update(this.state.profiles, profile)
    });
  }

  add(profile: api.Profile) {
    this.setState({
      profiles: this.state.profiles.push(profile)
    });
  }
}));