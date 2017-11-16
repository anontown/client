import * as React from "react";
import { Paper } from "material-ui";
import { Page } from "../components";
import {
  RouteComponentProps,
  withRouter
} from "react-router-dom";

interface NotFoundProps extends RouteComponentProps<{}> {

}

export const NotFoundPage = withRouter<{}>(function (_props: NotFoundProps) {
  return <Page column={1}>
    <Paper>ページが見つかりません</Paper>
  </Page>;
});