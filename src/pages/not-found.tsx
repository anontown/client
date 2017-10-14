import * as React from "react";
import { Paper } from "material-ui";
import { Page } from "../components";

export interface NotFoundProps {

}

export function NotFound(_props: NotFoundProps) {
  return <Page column={1}>
    <Paper>ページが見つかりません</Paper>
  </Page>;
}