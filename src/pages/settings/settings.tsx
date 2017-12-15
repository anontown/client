import { List, ListItem } from "material-ui";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Link, Route, Switch } from "react-router-dom";
import { Page } from "../../components";
import { AccountSettingPage } from "./account-setting";
import { AppsSettingPage } from "./apps-setting";
import { DevSettingPage } from "./dev-setting";

interface SettingsPageProps extends RouteComponentProps<{}> {

}

interface SettingsPageState {
}

export const SettingsPage = withRouter(class extends React.Component<SettingsPageProps, SettingsPageState> {
  constructor(props: SettingsPageProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <Page
      sidebar={<List>
        <ListItem containerElement={<Link to="/settings/account" />}>アカウント設定</ListItem>
        <ListItem containerElement={<Link to="/settings/apps" />}>連携アプリ</ListItem>
        <ListItem containerElement={<Link to="/settings/dev" />}>開発者向け</ListItem>
      </List>}>
      <Switch>
        <Route path="/settings/account" component={AccountSettingPage} />
        <Route path="/settings/apps" component={AppsSettingPage} />
        <Route path="/settings/dev" component={DevSettingPage} />
      </Switch>
    </Page>;
  }
});
