import * as Im from "immutable";
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
import { Snack } from "../../components";
import { client } from "../../gql/_gql/client"
import { userSwitch, UserSwitchProps } from "src/utils";
import { findClients } from "../../gql/client.gql";
import { findTokens, delTokenClient } from "../../gql/token.gql";
import { findClients as findClientsResult, findClientsVariables } from "../../gql/_gql/findClients";
import { findTokens as findTokensResult } from "../../gql/_gql/findTokens";
import { delTokenClient as delTokenClientResult, delTokenClientVariables } from "../../gql/_gql/delTokenClient";
import { useMutation, useQuery, useApolloClient } from "react-apollo-hooks";
import { tokenGeneral } from "src/gql/_gql/tokenGeneral";

type AppsSettingPageProps = RouteComponentProps<{}> & UserSwitchProps

export const AppsSettingPage = userSwitch(withRouter((props: AppsSettingPageProps) => {
  const [clients, setClients] = React.useState<Im.List<client>>(Im.List());
  const [snackMsg, setSnackMsg] = React.useState<string | null>(null);
  const delToken = useMutation<delTokenClientResult, delTokenClientVariables>(delTokenClient);
  const { data: tokens } = useQuery<findTokensResult>(findTokens, { variables: {} });
  const apolloClient = useApolloClient();
  React.useEffect(() => {
    if (tokens !== undefined) {
      apolloClient.query<findClientsResult, findClientsVariables>({
        query: findClients,
        variables: {
          query: {
            id: Array.from(new Set(tokens.tokens
              .filter((x): x is tokenGeneral => x.__typename === "TokenGeneral")
              .map(x => x.client.id)))
          }
        },
      }).then(x => {
        setClients(Im.List(x.data.clients));
      }).catch(_e => {
        setSnackMsg("クライアント情報取得に失敗しました。");
      });
    }
  }, [setClients, setSnackMsg, apolloClient, tokens]);

  return <div>
    <Helmet>
      <title>連携アプリ管理</title>
    </Helmet>
    <Snack
      msg={snackMsg}
      onHide={() => setSnackMsg(null)} />
    {clients.map(c => <Paper>
      {c.name}
      <IconButton type="button" onClick={async () => {
        try {
          await delToken({ variables: { client: c.id } });
          setClients(clients.filter(x => x.id !== c.id));
        } catch {
          setSnackMsg("削除に失敗しました");
        }
      }} >
        <FontIcon className="material-icons">delete</FontIcon>
      </IconButton>
    </Paper>)}
  </div>;
}));