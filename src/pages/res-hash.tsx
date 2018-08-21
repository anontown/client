import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import {
  myInject,
  UserStore,
} from "../stores";
import {
  withModal,
} from "../utils";
import { findResHash } from "./res-hash.gql";
import { findResHash as findResHashResult, findResHashVariables } from "./_gql/findResHash";
import { Query } from "react-apollo";

interface ResHashBaseProps extends RouteComponentProps<{ hash: string }> {
  user: UserStore;
}

interface ResHashBaseState {
}

const ResHashBase = withRouter(myInject(["user"],
  observer(class extends React.Component<ResHashBaseProps, ResHashBaseState> {
    constructor(props: ResHashBaseProps) {
      super(props);
    }

    render() {
      const hash = decodeURIComponent(this.props.match.params.hash);

      return <div>
        <Helmet>
          <title>HASH:{hash}</title>
        </Helmet>
        <Query<findResHashResult, findResHashVariables>
          query={findResHash}
          variables={{ hash }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error || !data) return (<Snack msg="レス取得に失敗しました" />);
            return data.reses.map(res => <Paper key={res.id}>
              <Res res={res} />
            </Paper>)
          }}
        </Query>
      </div>;
    }
  })));

export function ResHashPage() {
  return <Page><ResHashBase /></Page>;
}

export const ResHashModal = withModal(() => <ResHashBase />, "ハッシュ");
