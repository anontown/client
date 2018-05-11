import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Profile, Snack } from "../components";
import {
  myInject,
  ProfileStore,
  UserStore,
} from "../stores";
import {
  withModal,
} from "../utils";

interface ProfileBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  zDepth?: number;
  profile: ProfileStore;
}

interface ProfileBaseState {
}

const ProfileBase = withRouter(myInject(["user", "profile"],
  observer(class extends React.Component<ProfileBaseProps, ProfileBaseState> {
    constructor(props: ProfileBaseProps) {
      super(props);
      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps: ProfileBaseProps) {
      this.props.profile.load(nextProps.match.params.id);
    }

    render() {
      return <div>
        <Helmet>
          <title>プロフィール</title>
        </Helmet>
        <Snack
          msg={this.props.profile.msg}
          onHide={() => this.props.profile.clearMsg()} />
        {this.props.profile.profile !== null
          ? <Paper zDepth={this.props.zDepth}>
            <Helmet>
              <title>●{this.props.profile.profile.sn}</title>
            </Helmet>
            <Profile profile={this.props.profile.profile} />
          </Paper>
          : null}
      </div>;
    }
  })));

export function ProfilePage() {
  return <Page><ProfileBase /></Page>;
}

export const ProfileModal = withModal(() => <ProfileBase zDepth={0} />, "プロフィール");
