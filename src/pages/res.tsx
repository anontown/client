import { Paper } from "material-ui";
import { observer } from "mobx-react";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import { myInject, UserStore } from "../stores";
import {
  withModal,
} from "../utils";
import { findReses } from "../gql/res.gql";
import { findReses as findResesResult, findResesVariables } from "../gql/_gql/findReses";
import { Query } from "react-apollo";

interface ResBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
  zDepth?: number;
}

interface ResBaseState {
}

const ResBase = withRouter(myInject(["user"],
  observer(class extends React.Component<ResBaseProps, ResBaseState> {
    constructor(props: ResBaseProps) {
      super(props);
    }

    render() {
      return <div>
        <Helmet>
          <title>レス</title>
        </Helmet>
        <Query<findResesResult, findResesVariables>
          query={findReses}
          variables={{ query: { id: this.props.match.params.id } }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error || !data || data.reses.length === 0) return (<Snack msg="レス取得に失敗しました" />);

            return (
              <Paper zDepth={this.props.zDepth}>
                <Res res={data.reses[0]} />
              </Paper>
            );
          }}
        </Query>
      </div>;
    }
  })));

export function ResPage() {
  return <Page><ResBase /></Page>;
}

export const ResModal = withModal(() => <ResBase zDepth={0} />, "レス詳細");
