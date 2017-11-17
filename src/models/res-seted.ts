import * as api from "@anontown/api-types";
import { ObjectOverwrite } from "typelevel-ts";

export type ResNormalSetedProfile = ObjectOverwrite<api.ResNormal, { profile: api.Profile | null }>;
export type ResHistorySetedHistory = ObjectOverwrite<api.ResHistory, { history: api.History }>;
export type ResTopicSetedTopic = api.ResTopic & { topicObject: api.Topic };
export type ResForkSetedTopic = ObjectOverwrite<api.ResFork, { fork: api.Topic }>;

export type ResSeted =
  ResNormalSetedProfile |
  ResHistorySetedHistory |
  ResTopicSetedTopic |
  ResForkSetedTopic |
  api.ResDelete;
