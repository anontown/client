import { UserData } from "../models";
import * as storageAPI from "./storage-api";
import * as G from "../../generated/graphql";

export async function createUserData(token: G.TokenMaster.Fragment): Promise<UserData> {
  const storage = await storageAPI.load(token);

  return { storage, token };
}
