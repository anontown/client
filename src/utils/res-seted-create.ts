import {
  ResForkSetedTopic,
  ResHistorySetedHistory,
  ResNormalSetedProfile,
  ResSeted,
  ResTopicSetedTopic,
} from "../models";

import * as api from "@anontown/api-types";
import { Observable } from "rxjs";
import { apiClient } from "./api-client";

export async function resForkSet(reses: api.ResFork[]): Promise<ResForkSetedTopic[]> {
  if (reses.length === 0) {
    return [];
  }

  const topics = await apiClient
    .findTopicIn({ ids: Array.from(new Set(reses.map(r => r.fork))) });

  const topicMap = new Map(topics.map<[string, api.Topic]>(t => [t.id, t]));
  return reses.map(r => ({ ...r, fork: topicMap.get(r.fork)! }))
}

export async function resHistorySet(reses: api.ResHistory[]): Promise<ResHistorySetedHistory[]> {
  if (reses.length === 0) {
    return [];
  }

  const hs = await apiClient
    .findHistoryIn({ ids: Array.from(new Set(reses.map(r => r.history))) });
  const hMap = new Map(hs.map<[string, api.History]>(h => [h.id, h]));
  return reses.map(r => ({ ...r, history: hMap.get(r.history)! }))
}

export async function resTopicSet(reses: api.ResTopic[]): Promise<ResTopicSetedTopic[]> {
  if (reses.length === 0) {
    return [];
  }

  const ts = await apiClient
    .findTopicIn({ ids: Array.from(new Set(reses.map(r => r.topic))) });

  const tMap = new Map(ts.map<[string, api.Topic]>(t => [t.id, t]));

  return reses.map(r => ({ ...r, topicObject: tMap.get(r.topic)! }));
}

export async function resNormalSet(token: api.Token | null, reses: api.ResNormal[]): Promise<ResNormalSetedProfile[]> {
  if (reses.length === 0) {
    return [];
  }

  if (reses.every(r => r.profile === null)) {
    return reses as ResNormalSetedProfile[];
  }

  const ps = await apiClient
    .findProfileIn(token, {
      ids: Array.from(new Set(reses.map(r => r.profile).filter<string>((p): p is string => p !== null))),
    });

  const pMap = new Map(ps.map<[string, api.Profile]>(p => [p.id, p]));

  return reses.map(r => ({ ...r, profile: r.profile !== null ? pMap.get(r.profile)! : null }));
}

export async function resSet(token: api.Token | null, reses: api.Res[]): Promise<ResSeted[]> {
  const resNormals = reses.filter<api.ResNormal>((r): r is api.ResNormal => r.type === "normal");
  const resHistories = reses.filter<api.ResHistory>((r): r is api.ResHistory => r.type === "history");
  const resTopics = reses.filter<api.ResTopic>((r): r is api.ResTopic => r.type === "topic");
  const resForks = reses.filter<api.ResFork>((r): r is api.ResFork => r.type === "fork");
  const resDeletes = reses.filter<api.ResDelete>((r): r is api.ResDelete => r.type === "delete");

  const rs = (await Promise.all<ResSeted[]>([
    resNormalSet(token, resNormals),
    resHistorySet(resHistories),
    resTopicSet(resTopics),
    resForkSet(resForks),
    Promise.resolve(resDeletes),
  ]))
    .reduce((a, b) => a.concat(b), []);

  const rMap = new Map(rs.map<[string, ResSeted]>(r => [r.id, r]));
  return reses.map(r => rMap.get(r.id)!);
}
