import * as api from "@anontown/api-types";
import { ObjectOverwrite } from "typelevel-ts";

export type ResNormalSetedProfile = ObjectOverwrite<api.ResNormal, { profile: api.Profile | null }>;
export type ResHistorySetedHistory = ObjectOverwrite<api.ResHistory, { history: api.History }>;
export type ResTopicSetedTopic = api.ResTopic & { topicObject: api.Topic };
export type ResForkSetedHistory = ObjectOverwrite<api.ResFork, { fork: api.Topic }>;


export type ResTree = (ResNormalSetedProfile | ResHistorySetedHistory | ResTopicSetedTopic | ResForkSetedHistory | api.ResDelete)
  & { children: { msg: string | null, ids: symbol[] } | null };