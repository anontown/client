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

type ResHashBaseProps = RouteComponentProps<{ hash: string }> & UserSwitchProps;

interface ResHashBaseState {
}

const ResHashBase = userSwitch(withRouter(class extends React.Component<ResHashBaseProps, ResHashBaseState> {
  constructor(props: ResHashBaseProps) {
    super(props);
  }

  render() {
    const hash = decodeURIComponent(this.props.match.params.hash);

    return <div>
      <Helmet>
        <title>HASH:{hash}</title>
      </Helmet>
      <G.FindReses.Component
        variables={{ query: { hash } }}>
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

export function ResHashPage() {
  return <Page><ResHashBase /></Page>;
}

export const ResHashModal = withModal(() => <ResHashBase />, "ハッシュ");
