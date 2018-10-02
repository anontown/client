import {
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
  UserSwitch,
  ProfileAdd,
} from "../components";
import { myInject, UserStore } from "../stores";
import { findProfiles } from "../gql/profile.gql";
import { findProfiles as findProfilesResult, findProfilesVariables } from "../gql/_gql/findProfiles";
import { Query } from "react-apollo";

interface ProfilesPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

export interface ProfilesPageState {
}

export const ProfilesPage = withRouter(myInject(["user"],
  observer(class extends React.Component<ProfilesPageProps, ProfilesPageState> {
    constructor(props: ProfilesPageProps) {
      super(props);
    }

    render() {
      return (
        <Page>
          <Helmet>
            <title>プロフィール管理</title>
          </Helmet>
          <UserSwitch userData={this.props.user.data} render={userData => <Tabs>
            <Tab label="編集">
              <Query<findProfilesResult, findProfilesVariables> query={findProfiles} variables={{ query: { self: true } }}>
                {({ loading, error, data }) => {
                  if (loading) return "Loading...";
                  if (error || !data) return (<Snack msg="プロフィール取得に失敗しました" />);

                  return (
                    data.profiles.map(p =>
                      <ProfileEditor
                        style={{ marginBottom: 10 }}
                        key={p.id}
                        profile={p}
                        userData={userData} />)
                  );
                }}</Query>
            </Tab>
            <Tab label="新規">
              <ProfileAdd
                userData={userData} />
            </Tab>
          </Tabs>} />
        </Page>
      );
    }
  })));
