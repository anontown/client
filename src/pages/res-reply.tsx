import { Paper } from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Page, Res, Snack } from "../components";
import {
  withModal, UserSwitchProps, userSwitch,
} from "../utils";
import * as G from "../../generated/graphql";

type ResReplyBaseProps = RouteComponentProps<{ id: string }> & UserSwitchProps;

interface ResReplyBaseState {
}

const ResReplyBase = userSwitch(withRouter(class extends React.Component<ResReplyBaseProps, ResReplyBaseState> {
  constructor(props: ResReplyBaseProps) {
    super(props);
  }

  render() {
    return <div>
      <Helmet>
        <title>リプライ</title>
      </Helmet>
      <G.FindReses.Component
        variables={{ query: { reply: this.props.match.params.id } }}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error || !data) return (<Snack msg="レス取得に失敗しました" />);
          return data.reses.map(res => <Paper key={res.id}>
            <Res res={res} />
          </Paper>)
        }}
      </G.FindReses.Component>
    </div>;
  }
}));

export function ResReplyPage() {
  return <Page><ResReplyBase /></Page>;
}

export const ResReplyModal = withModal(() => <ResReplyBase />, "リプライ");
