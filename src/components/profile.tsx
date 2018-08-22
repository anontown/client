import * as React from "react";
import { Md } from "./md";
import { profile } from "../gql/_gql/profile";

export interface ProfileProps {
  profile: profile;
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
        <Md text={this.props.profile.text} />
      </div>
    );
  }
}
