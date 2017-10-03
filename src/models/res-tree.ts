import * as api from "@anontown/api-types";
import { ObjectOverwrite } from "typelevel-ts";

export type ResNormalSetedProfile = ObjectOverwrite<api.ResNormal, { profile: api.Profile | null }>;
export type ResHistorySetedHistory = ObjectOverwrite<api.ResHistory, { history: api.History }>;
export type ResTopicSetedTopic = api.ResTopic & { topicObject: api.TopicOne | api.TopicFork };
export type ResForkSetedHistory = ObjectOverwrite<api.ResFork, { fork: api.TopicFork }>;


export type ResTree = (ResNormalSetedProfile | ResHistorySetedHistory | ResTopicSetedTopic | ResForkSetedHistory | api.ResDelete)
  & { children: { msg: string, resIDs: string[] } | null };