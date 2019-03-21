import { UserData } from "../models";
import * as storageAPI from "./storage-api";
import * as G from "../../generated/graphql";
import { gqlClient, createHeaders } from "./gql-client";

export async function createUserData(token: G.TokenMasterFragment): Promise<UserData> {
  const storage = await storageAPI.load(token);
  const user = await gqlClient.query<G.FindUserQuery, G.FindUserQueryVariables>({
    query: G.FindUserDocument,
    variables: {},
    context: {
      headers: createHeaders(token.id, token.key)
    }
  });

  return { storage, token, id: user.data.user.id };
}
