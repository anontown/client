import { TokenMaster } from "@anontown/api-types";
import { Observable } from "rxjs";
import { UserData } from "../models";
import { apiClient } from "./api-client";
import * as storageAPI from "./storage-api";

export function createUserData(token: TokenMaster): Observable<UserData> {
  return Observable.forkJoin(
    storageAPI.load(token),
    apiClient.findProfileAll(token),
  )
    .map(([storage, profiles]) => ({ storage, profiles, token }));
}
