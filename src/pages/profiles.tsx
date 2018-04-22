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
import { myInject, UserStore, ProfilesStore } from "../stores";

interface ProfilesPageProps extends RouteComponentProps<{}> {
  user: UserStore;
  profiles: ProfilesStore
}

export interface ProfilesPageState {
}

export const ProfilesPage = withRouter(myInject(["user", "profiles"],
  observer(class extends React.Component<ProfilesPageProps, ProfilesPageState> {
    constructor(props: ProfilesPageProps) {
      super(props);

      this.props.profiles.load();
    }

    render() {
      return (
        <Page>
          <Helmet>
            <title>プロフィール管理</title>
          </Helmet>
          <Snack
            msg={this.props.profiles.msg}
            onHide={() => this.props.profiles.clearMsg()} />
          {this.props.user.data !== null
            ? <Tabs>
              <Tab label="編集">
                {this.props.profiles.profiles.map(p =>
                  <ProfileEditor
                    key={p.id}
                    profile={p}
                    onUpdate={newProfile => this.props.profiles.update(newProfile)} />)}
              </Tab>
              <Tab label="新規">
                <ProfileEditor
                  profile={null}
                  onAdd={p => this.props.profiles.add(p)} />
              </Tab>
            </Tabs>
            : <Paper>
              ログインしてください。
        </Paper>
          }
        </Page>
      );
    }
  })));
