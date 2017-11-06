import * as React from "react";
import { Paper } from "material-ui";
import { Page } from "../components";
import { RouteComponentProps } from "react-router-dom";

export type NotFoundProps = RouteComponentProps<{}>:

export function NotFoundPage(_props: NotFoundProps) {
  return <Page column={1}>
    <Paper>ページが見つかりません</Paper>
  </Page>;
}