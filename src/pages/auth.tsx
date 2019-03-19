import { RaisedButton } from "material-ui";
import * as qs from "query-string";
import * as React from "react";
import {
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Snack, Page, Errors } from "../components";
import { userSwitch, UserSwitchProps, queryResultConvert } from "../utils";
import * as G from "../../generated/graphql";
import { useTitle } from "react-use";

type AuthPageProps = RouteComponentProps<{}> & UserSwitchProps;

export const AuthPage = userSwitch(withRouter((props: AuthPageProps) => {
  const [snackMsg, setSnackMsg] = React.useState<string | null>(null);
  const id: string | string[] | undefined = qs.parse(props.location.search).client;
  const clients = G.FindClients.use({
    skip: typeof id !== "string",
    variables: { query: { id: typeof id === "string" ? [id] : [] } }
  });
  queryResultConvert(clients);
  const submit = G.CreateTokenGeneral.use();

  useTitle("アプリ認証");


  return <Page>
    <Snack
      msg={snackMsg}
      onHide={() => setSnackMsg(null)} />
    {clients.loading
      ? <div>loading</div>
      : null}
    {typeof id !== "string"
      ? <div>パラメーターが不正です</div>
      : null}
    {clients.error !== undefined
      ? <Errors errors={["クライアント取得に失敗しました。"]} />
      : null}
    {clients.data !== undefined
      ? <div>
        認証しますか？
          <RaisedButton type="button" label="OK" onClick={async () => {
          if (clients.data !== undefined) {
            const client = clients.data.clients[0];
            try {
              const data = await submit({ variables: { client: client.id } });
              if (data.data !== undefined) {
                location.href = client.url + "?" + "id=" + data.data.createTokenGeneral.req.token + "&key=" + encodeURI(data.data.createTokenGeneral.req.key);
              }
            } catch{
              setSnackMsg("エラーが発生しました");
            }
          }
        }} />
      </div>
      : null}
  </Page>;
}));