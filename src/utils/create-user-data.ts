import { UserData } from "../models";
import * as storageAPI from "./storage-api";
import { getToken_token_TokenMaster } from "../components/_gql/getToken";

export async function createUserData(token: getToken_token_TokenMaster): Promise<UserData> {
  const storage = await storageAPI.load(token);

  return { storage, token };
}
