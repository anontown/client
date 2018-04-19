import * as api from "@anontown/api-types";
import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Profile, Snack } from "../components";
import { myInject, UserStore } from "../stores";
import {
  apiClient,
  withModal,
} from "../utils";

interface ProfileBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  zDepth?: number;
}

interface ProfileBaseState {
  profile: api.Profile | null;
  snackMsg: null | string;
}

const ProfileBase = withRouter(myInject(["user"],
  observer(class extends React.Component<ProfileBaseProps, ProfileBaseState> {
    constructor(props: ProfileBaseProps) {
      super(props);
      this.state = {
        profile: null,
        snackMsg: null,
      };

      const token = this.props.user.data !== null ? this.props.user.data.token : null;

      (async () => {
        try {
          this.setState({
            profile: await apiClient.findProfileOne(token, {
              id: this.props.match.params.id,
            }),
          });
        } catch {
          this.setState({ snackMsg: "プロフィール取得に失敗しました" });
        }
      })();
    }

    render() {
      return <div>
        <Helmet>
          <title>プロフィール</title>
        </Helmet>
        <Snack
          msg={this.state.snackMsg}
          onHide={() => this.setState({ snackMsg: null })} />
        {this.state.profile !== null
          ? <Paper zDepth={this.props.zDepth}>
            <Helmet>
              <title>●{this.state.profile.sn}</title>
            </Helmet>
            <Profile profile={this.state.profile} />
          </Paper>
          : null}
      </div>;
    }
  })));

export function ProfilePage() {
  return <Page><ProfileBase /></Page>;
}

export const ProfileModal = withModal(() => <ProfileBase zDepth={0} />, "プロフィール");
