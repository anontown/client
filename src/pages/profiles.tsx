import * as React from 'react';
import { UserData } from "../models";
import { apiClient, list } from "../utils";
import { connect } from "react-redux";
import { Store } from "../reducers";
import { ObjectOmit } from "typelevel-ts";
import { RouteComponentProps } from "react-router-dom";
import {
  Snack,
  Res,
  Page,
  ProfileEditor
} from "../components";
import {
  Paper,
  RaisedButton
} from "material-ui";
import * as Im from 'immutable';
import * as api from "@anontown/api-types";

type _ProfilesPageProps = RouteComponentProps<{}> & { user: UserData | null };
export type ProfilesPageProps = ObjectOmit<_ProfilesPageProps, "user">;

export interface ProfilesPageState {
  profiles: Im.List<api.Profile>
  snackMsg: null | string,
}

class _ProfilesPage extends React.Component<_ProfilesPageProps, ProfilesPageState> {
  constructor(props: _ProfilesPageProps) {
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
}

export const ProfilesPage = connect((state: Store) => ({ user: state.user }))(_ProfilesPage);