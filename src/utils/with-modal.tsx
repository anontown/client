import {
  Dialog,
} from "material-ui";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";

export const withModal = <P extends {}>(Page: React.ComponentType<P>, title: string) => {
  return withRouter((props: P & RouteComponentProps<{}>) => {
    return <Dialog
      title={title}
      open={true}
      autoScrollBodyContent={true}
      onRequestClose={() => {
        props.history.goBack();
      }}>
      <Page { ...props } />
    </Dialog>;
  });
};
