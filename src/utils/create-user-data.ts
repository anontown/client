import { TokenMaster } from "@anontown/api-types";
import { UserData } from "../models";
import { apiClient } from "./api-client";
import * as storageAPI from "./storage-api";

export async function createUserData(token: TokenMaster): Promise<UserData> {
  const [storage, profiles] = await Promise.all([
    storageAPI.load(token),
    apiClient.findProfileAll(token),
  ]);

  return { storage, profiles, token };
}
