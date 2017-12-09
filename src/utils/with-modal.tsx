import {
  Dialog,
} from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";

export const withModal = <P extends {}>(Page: React.ComponentType<P>) => {
  return withRouter<P>((props: P & RouteComponentProps<{}>) => {
    return <Dialog
      open={true}
      autoScrollBodyContent={true}
      onRequestClose={() => {
        props.history.goBack();
      }}>
      <Page { ...props } />
    </Dialog>;
  });
};