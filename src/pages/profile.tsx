import * as api from "@anontown/api-types";
import { Paper } from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Profile, Snack } from "../components";
import {
  apiClient,
  withModal,
} from "../utils";
import { UserStore, appInject } from "../stores";

interface ProfileBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  zDepth?: number;
}

interface ProfileBaseState {
  profile: api.Profile | null;
  snackMsg: null | string;
}

const ProfileBase = withRouter(appInject(class extends React.Component<ProfileBaseProps, ProfileBaseState> {
  constructor(props: ProfileBaseProps) {
    super(props);
    this.state = {
      profile: null,
      snackMsg: null,
    };

    const token = this.props.user.data !== null ? this.props.user.data.token : null;

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
    return <div>
      <Snack
        msg={this.state.snackMsg}
        onHide={() => this.setState({ snackMsg: null })} />
      {this.state.profile !== null
        ? <Paper zDepth={this.props.zDepth}>
          <Profile profile={this.state.profile} />
        </Paper>
        : null}
    </div>;
  }
}));

export function ProfilePage() {
  return <Page><ProfileBase /></Page>;
}

export const ProfileModal = withModal(() => <ProfileBase zDepth={0} />, "プロフィール");
