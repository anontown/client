import * as React from "react";
import { UserData } from "../models";
import { observer } from "mobx-react";

interface UserSwitchProps {
  userData: UserData | null;
  render: (userData: UserData) => React.ReactNode;
}

interface UserSwitchState {

}

export const UserSwitch=observer(class extends React.Component<UserSwitchProps, UserSwitchState> {
  constructor(props: UserSwitchProps) {
    super(props);
  }

  render() {
    return this.props.userData !== null
      ? this.props.render(this.props.userData)
      : <div>ログインして下さい</div>;
  }
});
