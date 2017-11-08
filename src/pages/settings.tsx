import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Page } from "../components";
import { Route, Switch, Link } from 'react-router-dom'
import { AccountSettingPage } from './account-setting';
import { DevSettingPage } from './dev-setting';
import { AppsSettingPage } from './apps-setting';
import { List, ListItem } from "material-ui";

export type SettingsPageProps = RouteComponentProps<{}>;

interface SettingsPageState {
}

export class SettingsPage extends React.Component<SettingsPageProps, SettingsPageState> {
  constructor(props: SettingsPageProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Page column={2}>
        <aside>
          <List>
            <ListItem><Link to="/settings/account">アカウント設定</Link></ListItem>
            <ListItem><Link to="/settings/apps">連携アプリ</Link></ListItem>
            <ListItem><Link to="/settings/dev">開発者向け</Link></ListItem>
          </List>
        </aside>
        <main>
          <Switch>
            <Route path="/settings/account" component={AccountSettingPage} />
            <Route path="/settings/apps" component={AppsSettingPage} />
            <Route path="/settings/dev" component={DevSettingPage} />
          </Switch>
        </main>
      </Page>
    );
  }
}