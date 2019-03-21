import {
  Tab,
  Tabs,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Page,
  ProfileEditor,
  Snack,
  ProfileAdd,
} from "../components";
import * as G from "../../generated/graphql";
import { UserSwitchProps, userSwitch } from "../utils";
import { RouteComponentProps, withRouter } from "react-router";

type ProfilesPageProps = RouteComponentProps & UserSwitchProps;

export interface ProfilesPageState {
}

export const ProfilesPage = userSwitch(withRouter(class extends React.Component<ProfilesPageProps, ProfilesPageState> {
  constructor(props: ProfilesPageProps) {
    super(props);
  }

  render() {
    return (
      <Page>
        <Helmet>
          <title>プロフィール管理</title>
        </Helmet>
        <Tabs>
          <Tab label="編集">
            <G.FindProfilesComponent variables={{ query: { self: true } }}>
              {({ loading, error, data }) => {
                if (loading) return "Loading...";
                if (error || !data) return (<Snack msg="プロフィール取得に失敗しました" />);

                return (
                  data.profiles.map(p =>
                    <ProfileEditor
                      style={{ marginBottom: 10 }}
                      key={p.id}
                      profile={p}
                      userData={this.props.userData} />)
                );
              }}</G.FindProfilesComponent>
          </Tab>
          <Tab label="新規">
            <ProfileAdd
              userData={this.props.userData} />
          </Tab>
        </Tabs>
      </Page>
    );
  }
}));
