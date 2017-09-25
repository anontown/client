import * as api from "@anontown/api-types";
import { Storage } from "./models/storage";
import { ObjectOverwrite } from "typelevel-ts";

export type ResNormalSetedProfile = ObjectOverwrite<api.ResNormal, { profile: api.Profile | null }>;
export type ResTree = (ResNormalSetedProfile | api.ResHistory | api.ResTopic | api.ResFork | api.ResDelete)
  & { children: { msg: string, reses: ResTree[] } | null };

export interface Store {
  user: {
    token: api.TokenMaster,
    storage: Storage
  } | null,
  topics: {
    reses: ResTree[],
  }
}