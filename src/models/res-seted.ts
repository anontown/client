import * as api from "@anontown/api-types";
import { Overwrite } from "type-zoo";

export type ResNormalSetedProfile = Overwrite<api.ResNormal, { profile: api.Profile | null }>;
export type ResHistorySetedHistory = Overwrite<api.ResHistory, { history: api.History }>;
export type ResTopicSetedTopic = api.ResTopic & { topicObject: api.Topic };
export type ResForkSetedTopic = Overwrite<api.ResFork, { fork: api.Topic }>;

export type ResSeted =
  ResNormalSetedProfile |
  ResHistorySetedHistory |
  ResTopicSetedTopic |
  ResForkSetedTopic |
  api.ResDelete;
