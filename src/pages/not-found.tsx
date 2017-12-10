import { Paper } from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page } from "../components";

interface NotFoundProps extends RouteComponentProps<{}> {

}

export const NotFoundPage = withRouter((_props: NotFoundProps) => {
  return <Page>
    <Paper>ページが見つかりません</Paper>
  </Page>;
});
