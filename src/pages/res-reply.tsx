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
import { findReses } from "../gql/res.gql";
import { findReses as findResesResult, findResesVariables } from "../gql/_gql/findReses";
import { Query } from "react-apollo";

interface ResReplyBaseProps extends RouteComponentProps<{ id: string }> {
  user: UserStore;
}

interface ResReplyBaseState {
}

const ResReplyBase = withRouter(myInject(["user"],
  observer(class extends React.Component<ResReplyBaseProps, ResReplyBaseState> {
    constructor(props: ResReplyBaseProps) {
      super(props);
    }

    render() {
      return <div>
        <Helmet>
          <title>リプライ</title>
        </Helmet>
        <Query<findResesResult, findResesVariables>
          query={findReses}
          variables={{ query: { reply: this.props.match.params.id } }}>
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

export function ResReplyPage() {
  return <Page><ResReplyBase /></Page>;
}

export const ResReplyModal = withModal(() => <ResReplyBase />, "リプライ");
