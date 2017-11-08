import * as React from 'react';
import * as api from '@anontown/api-types'
import { Md } from './md';

export interface ProfileProps {
  profile: api.Profile
}

interface ProfileState {
}

export class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.profile.name}●{this.props.profile.sn}
        <hr />
        <Md body={this.props.profile.text} />
      </div>
    );
  }
}