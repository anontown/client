import { RaisedButton } from "material-ui";
import { observer } from "mobx-react";
import * as qs from "query-string";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack } from "../components";
import { Page } from "../components";
import {
  myInject,
  UserStore,
} from "../stores";
import { Query, Mutation } from "react-apollo";
import { getClient, createToken } from "./auth.gql";
import { getClient as getClientResult, getClientVariables } from "./_gql/getClient";
import { createToken as createTokenResult, createTokenVariables } from "./_gql/createToken";

interface AuthPageProps extends RouteComponentProps<{}> {
  user: UserStore;
}

interface AuthPageState {
}

export const AuthPage = withRouter(myInject(["user"],
  observer(class extends React.Component<AuthPageProps, AuthPageState> {
    constructor(props: AuthPageProps) {
      super(props);
    }

    render() {
      const id: string | string[] | undefined = qs.parse(this.props.location.search).client;


      return <Page>
        <Helmet>
          <title>アプリ認証</title>
        </Helmet>
        {this.props.user.data !== null ? typeof id === "string"
          ? <Query<getClientResult, getClientVariables>
            query={getClient}
            variables={{ id: id }}>
            {({ loading, error, data }) => {
              if (loading) return "Loading...";
              if (error || !data || data.clients.length === 0) return (<Snack msg="クライアント取得に失敗しました。" />);
              const client = data.clients[0];
              return (<Mutation<createTokenResult, createTokenVariables>
                mutation={createToken}
                variables={{ client: client.id }}>
                {(create, { error }) => {
                  return <div>
                    認証しますか？
                  <RaisedButton type="button" label="OK" onClick={async () => {
                      const data = await create();
                      if (data && data.data) {
                        location.href = client.url + "?" + "id=" + data.data.createTokenGeneral.createReq.token + "&key=" + encodeURI(data.data.createTokenGeneral.createReq.key);
                      }
                    }} />
                    {error && <Snack msg="エラーが発生しました" />}
                  </div>;
                }}
              </Mutation>);
            }}
          </Query>
          : <div>パラメーターが不正です</div>
          : <div>ログインして下さい</div>}
      </Page>;
    }
  })));
