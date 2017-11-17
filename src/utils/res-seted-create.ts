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

export function resForkSet(reses: api.ResFork[]): Observable<ResForkSetedTopic[]> {
  return apiClient
    .findTopicIn({ ids: Array.from(new Set(reses.map((r) => r.fork))) })
    .map((topics) => new Map(topics.map<[string, api.Topic]>((t) => [t.id, t])))
    .map((topics) => reses.map((r) => ({ ...r, fork: topics.get(r.fork)! })));
}

export function resHistorySet(reses: api.ResHistory[]): Observable<ResHistorySetedHistory[]> {
  return apiClient
    .findHistoryIn({ ids: Array.from(new Set(reses.map((r) => r.history))) })
    .map((hs) => new Map(hs.map<[string, api.History]>((h) => [h.id, h])))
    .map((hs) => reses.map((r) => ({ ...r, history: hs.get(r.history)! })));
}

export function resTopicSet(reses: api.ResTopic[]): Observable<ResTopicSetedTopic[]> {
  return apiClient
    .findTopicIn({ ids: Array.from(new Set(reses.map((r) => r.topic))) })
    .map((ts) => new Map(ts.map<[string, api.Topic]>((t) => [t.id, t])))
    .map((ts) => reses.map((r) => ({ ...r, topicObject: ts.get(r.topic)! })));
}

export function resNormalSet(token: api.Token | null, reses: api.ResNormal[]): Observable<ResNormalSetedProfile[]> {
  return apiClient
    .findProfileIn(token, { ids: Array.from(new Set(reses.map((r) => r.profile).filter<string>((p): p is string => p !== null))) })
    .map((ps) => new Map(ps.map<[string, api.Profile]>((p) => [p.id, p])))
    .map((ps) => reses.map((r) => ({ ...r, profile: r.profile !== null ? ps.get(r.profile)! : null })));
}

export function resSet(token: api.Token | null, reses: api.Res[]): Observable<ResSeted[]> {
  const resNormals = reses.filter<api.ResNormal>((r): r is api.ResNormal => r.type === "normal");
  const resHistories = reses.filter<api.ResHistory>((r): r is api.ResHistory => r.type === "history");
  const resTopics = reses.filter<api.ResTopic>((r): r is api.ResTopic => r.type === "topic");
  const resForks = reses.filter<api.ResFork>((r): r is api.ResFork => r.type === "fork");
  const resDeletes = reses.filter<api.ResDelete>((r): r is api.ResDelete => r.type === "delete");

  return Observable.merge(
    resNormalSet(token, resNormals),
    resHistorySet(resHistories),
    resTopicSet(resTopics),
    resForkSet(resForks),
    Observable.of(resDeletes),
  )
    .reduce<ResSeted[]>((acc, value) => [...acc, ...value], [])
    //ソート
    .map((rs) => new Map(rs.map<[string, ResSeted]>((r) => [r.id, r])))
    .map((rs) => reses.map((r) => rs.get(r.id)!));
}
