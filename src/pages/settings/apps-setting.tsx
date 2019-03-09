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
import * as G from "../../../generated/graphql";

type AppsSettingPageProps = RouteComponentProps<{}> & UserSwitchProps;

export const AppsSettingPage = userSwitch(withRouter((_props: AppsSettingPageProps) => {
  const [snackMsg, setSnackMsg] = React.useState<string | null>(null);
  const tokens = G.FindTokens.use({ variables: {} });
  const variables: G.FindClients.Variables = {
    query: {
      id: tokens.data !== undefined
        ? Array.from(new Set(tokens.data.tokens
          .filter((x): x is G.TokenGeneral.Fragment => x.__typename === "TokenGeneral")
          .map(x => x.client.id)))
        : []
    }
  };
  const clients = G.FindClients.use({
    skip: tokens === undefined,
    variables,
  });
  const delToken = G.DelTokenClient.use();

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
                const clients = cache.readQuery<G.FindClients.Query, G.FindClients.Variables>({ query: G.FindClients.Document, variables });
                if (clients !== null) {
                  cache.writeQuery<G.FindClients.Query, G.FindClients.Variables>({
                    query: G.FindClients.Document,
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