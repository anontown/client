import {
  FontIcon,
  IconButton,
  Paper,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack, Errors } from "../../components";
import { userSwitch, UserSwitchProps } from "src/utils";
import { findClients } from "../../gql/client.gql";
import { findTokens, delTokenClient } from "../../gql/token.gql";
import { findClients as findClientsResult, findClientsVariables } from "../../gql/_gql/findClients";
import { findTokens as findTokensResult } from "../../gql/_gql/findTokens";
import { delTokenClient as delTokenClientResult, delTokenClientVariables } from "../../gql/_gql/delTokenClient";
import { useMutation, useQuery } from "react-apollo-hooks";
import { tokenGeneral } from "src/gql/_gql/tokenGeneral";

type AppsSettingPageProps = RouteComponentProps<{}> & UserSwitchProps

export const AppsSettingPage = userSwitch(withRouter((_props: AppsSettingPageProps) => {
  const [snackMsg, setSnackMsg] = React.useState<string | null>(null);
  const tokens = useQuery<findTokensResult>(findTokens, { variables: {} });
  const variables: findClientsVariables = {
    query: {
      id: tokens.data !== undefined
        ? Array.from(new Set(tokens.data.tokens
          .filter((x): x is tokenGeneral => x.__typename === "TokenGeneral")
          .map(x => x.client.id)))
        : []
    }
  };
  const clients = useQuery<findClientsResult, findClientsVariables>(findClients, {
    skip: tokens === undefined,
    variables,
  });
  const delToken = useMutation<delTokenClientResult, delTokenClientVariables>(delTokenClient);

  return <div>
    <Helmet>
      <title>連携アプリ管理</title>
    </Helmet>
    <Snack
      msg={snackMsg}
      onHide={() => setSnackMsg(null)} />
    {tokens.error !== undefined || clients.error !== undefined
      ? <Errors errors={["エラーが発生しました。"]} />
      : null}
    {tokens.loading || clients.loading
      ? <div>loading</div>
      : null}
    {clients.data !== undefined
      ? clients.data.clients.map(c => <Paper>
        {c.name}
        <IconButton type="button" onClick={async () => {
          try {
            await delToken({
              variables: { client: c.id }, update: (cache) => {
                const clients = cache.readQuery<findClientsResult, findClientsVariables>({ query: findClients, variables });
                if (clients !== null) {
                  cache.writeQuery<findClientsResult, findClientsVariables>({
                    query: findClients,
                    variables,
                    data: { clients: clients.clients.filter(x => x.id !== c.id) },
                  });
                }
              }
            });
          } catch {
            setSnackMsg("削除に失敗しました");
          }
        }} >
          <FontIcon className="material-icons">delete</FontIcon>
        </IconButton>
      </Paper>)
      : null}
  </div>;
}));