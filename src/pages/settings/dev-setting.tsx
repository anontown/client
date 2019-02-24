import {
  Paper,
} from "material-ui";
import * as React from "react";
import { Helmet } from "react-helmet";
import {
  RouteComponentProps,
} from "react-router-dom";
import {
  ClientEditor,
  ClientAdd,
  Errors,
} from "../../components";
import {
  userSwitch,
  UserSwitchProps,
} from "../../utils";
import { findClients as findClientsResult, findClientsVariables } from "../../gql/_gql/findClients";
import { findClients } from "../../gql/client.gql";
import { useQuery } from "react-apollo-hooks";

type DevSettingPageProps = RouteComponentProps<{}> & UserSwitchProps

export const DevSettingPage = userSwitch((props: DevSettingPageProps) => {
  const variables: findClientsVariables = { query: { self: true } };
  const clients = useQuery<findClientsResult, findClientsVariables>(findClients, { variables });

  return <Paper>
    <Helmet>
      <title>開発者向け</title>
    </Helmet>
    <Paper>
      クライアント管理
    </Paper>
    <ClientAdd
      onAddUpdate={(cache, data) => {
        const clients = cache.readQuery<findClientsResult, findClientsVariables>({ query: findClients, variables });
        if (clients !== null && data.data !== undefined) {
          cache.writeQuery<findClientsResult, findClientsVariables>({
            query: findClients,
            variables,
            data: { clients: clients.clients.concat([data.data.createClient]) },
          });
        }
      }}
      userData={props.userData} />
    {clients.error !== undefined
      ? <Errors errors={["クライアント取得に失敗しました。"]} />
      : null}
    {clients.loading
      ? <div>loading</div>
      : null}
    {clients.data !== undefined
      ? <>
        {clients.data.clients.length === 0
          ? <Paper>クライアントがありません</Paper>
          : null}
        {clients.data.clients.map(c => <ClientEditor
          key={c.id}
          client={c}
          userData={props.userData} />)}
      </>
      : null}
  </Paper>
});