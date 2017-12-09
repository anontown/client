import * as api from "@anontown/api-types";
import { Paper } from "material-ui";
import * as React from "react";
import { connect } from "react-redux";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Profile, Snack } from "../components";
import { UserData } from "../models";
import { Store } from "../reducers";
import {
  apiClient,
} from "../utils";

interface ProfilePageProps extends RouteComponentProps<{ id: string }> {
  user: UserData | null;
}

interface ProfilePageState {
  profile: api.Profile | null;
  snackMsg: null | string;
}

export const ProfilePage = withRouter<{}>(connect((state: Store) => ({ user: state.user }))
  (class extends React.Component<ProfilePageProps, ProfilePageState> {
    constructor(props: ProfilePageProps) {
      super(props);
      this.state = {
        profile: null,
        snackMsg: null,
      };

      const token = this.props.user !== null ? this.props.user.token : null;

      apiClient.findProfileOne(token, {
        id: this.props.match.params.id,
      })
        .subscribe(profile => {
          this.setState({ profile });
        }, () => {
          this.setState({ snackMsg: "プロフィール取得に失敗しました" });
        });
    }

    render() {
      return (
        <Page>
          <Snack
            msg={this.state.snackMsg}
            onHide={() => this.setState({ snackMsg: null })} />
          {this.state.profile !== null
            ? <Paper>
              <Profile profile={this.state.profile} />
            </Paper>
            : null}
        </Page>
      );
    }
  }));
