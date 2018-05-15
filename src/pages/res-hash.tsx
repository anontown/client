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
  ResHashStore,
  UserStore,
} from "../stores";
import {
  withModal,
} from "../utils";

interface ResHashBaseProps extends RouteComponentProps<{ hash: string }> {
  user: UserStore;
  resHash: ResHashStore;
}

interface ResHashBaseState {
}

const ResHashBase = withRouter(myInject(["user", "resHash"],
  observer(class extends React.Component<ResHashBaseProps, ResHashBaseState> {
    constructor(props: ResHashBaseProps) {
      super(props);

      this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps: ResHashBaseProps) {
      this.props.resHash.load(nextProps.match.params.hash);
    }

    render() {
      return <div>
        <Helmet>
          <title>HASH:{this.props.match.params.hash}</title>
        </Helmet>
        <Snack
          msg={this.props.resHash.msg}
          onHide={() => this.props.resHash.clearMsg()} />
        {this.props.resHash.data !== null
          ? this.props.resHash.data.reses.map(res => <Paper key={res.id}>
            <Res
              res={res}
              update={updateRes => this.props.resHash.update(updateRes)} />
          </Paper>)
          : null}
      </div>;
    }
  })));

export function ResHashPage() {
  return <Page><ResHashBase /></Page>;
}

export const ResHashModal = withModal(() => <ResHashBase />, "ハッシュ");
