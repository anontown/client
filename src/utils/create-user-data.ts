import { UserData } from "../models";
import * as storageAPI from "./storage-api";
import * as G from "../../generated/graphql";
import { gqlClient, createHeaders } from "./gql-client";

export async function createUserData(token: G.TokenMaster.Fragment): Promise<UserData> {
  const storage = await storageAPI.load(token);
  const user = await gqlClient.query<G.FindUser.Query, G.FindUser.Variables>({
    query: G.FindUser.Document,
    variables: {},
    context: {
      headers: createHeaders(token.id, token.key)
    }
  });

  return { storage, token, id: user.data.user.id };
}
