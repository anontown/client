import * as Im from "immutable";
import * as uuid from "uuid";
import * as ngJson from "./ng-json";
import { ResSeted } from "./res-seted";

export function createDefaultBody(): NGBody {
  return {
    id: uuid.v4(),
    type: "and",
    body: Im.List(),
  };
}

export function createDefaultNG(): NG {
  return {
    id: uuid.v4(),
    name: "新規設定",
    topic: null,
    date: new Date(),
    expirationDate: null,
    chain: 1,
    transparent: false,
    body: createDefaultBody(),
  };
}

// TODO:chain
export function isNG(ng: NG, res: ResSeted) {
  if (ng.topic !== null && ng.topic !== res.topic) {
    return false;
  }

  if (ng.expirationDate !== null && ng.expirationDate.valueOf() < new Date(res.date).valueOf()) {
    return false;
  }

  return !!isBodyNG(ng.body, res);
}

function isBodyNG(ngBody: NGBody, res: ResSeted): boolean | null {
  switch (ngBody.type) {
    case "not":
      const b = isBodyNG(ngBody.body, res);
      return b !== null ? !b : null;
    case "and":
      return ngBody.body.filter(x => x !== null).size === 0 ? null : ngBody.body.every(body => !!isBodyNG(body, res));
    case "or":
      return ngBody.body.filter(x => x !== null).size === 0 ? null : ngBody.body.some(body => !!isBodyNG(body, res));
    case "profile":
      return res.type === "normal" && res.profile !== null && ngBody.profile === res.profile.id;
    case "hash":
      return res.hash === ngBody.hash;
    case "body":
      return res.type === "normal" && textMatcherTest(ngBody.matcher, res.text);
    case "name":
      return res.type === "normal" && res.name !== null && textMatcherTest(ngBody.matcher, res.name);
    case "vote":
      return res.uv - res.dv < ngBody.value;
  }
}

function textMatcherTest(matcher: NGBodyTextMatcher, text: string): boolean | null {
  if (matcher.source.length === 0) {
    return null;
  }
  switch (matcher.type) {
    case "reg":
      try {
        return new RegExp(matcher.source, [
          matcher.i ? "i" : "",
        ].join()).test(text);
      } catch {
        return null;
      }
    case "text":
      if (matcher.i) {
        return text.toLowerCase().indexOf(matcher.source.toLowerCase()) !== -1;
      } else {
        return text.indexOf(matcher.source) !== -1;
      }
  }
}

export function toJSON(ng: NG): ngJson.NGJson {
  return {
    name: ng.name,
    topic: ng.topic,
    body: toJSONBody(ng.body),
    expirationDate: ng.expirationDate !== null ? ng.expirationDate.toISOString() : null,
    date: ng.date.toISOString(),
    chain: ng.chain,
    transparent: ng.transparent,
  };
}

function toJSONMatcher(matcher: NGBodyTextMatcher): ngJson.NGBodyTextMatcherJson {
  switch (matcher.type) {
    case "reg":
      return matcher;
    case "text":
      return matcher;
  }
}

function toJSONBody(ngBody: NGBody): ngJson.NGBodyJson {
  switch (ngBody.type) {
    case "not":
      return { type: "not", body: toJSONBody(ngBody.body) };
    case "and":
      return { type: "and", body: ngBody.body.map(x => toJSONBody(x)).toArray() };
    case "or":
      return { type: "or", body: ngBody.body.map(x => toJSONBody(x)).toArray() };
    case "profile":
      return ngBody;
    case "hash":
      return ngBody;
    case "body":
      return { type: "body", matcher: toJSONMatcher(ngBody.matcher) };
    case "name":
      return { type: "name", matcher: toJSONMatcher(ngBody.matcher) };
    case "vote":
      return ngBody;
  }
}

export function fromJSON(json: ngJson.NGJson): NG {
  return {
    id: uuid.v4(),
    ...json,
    body: fromJSONBody(json.body),
    expirationDate: json.expirationDate !== null ? new Date(json.expirationDate) : null,
    date: new Date(json.date),
  };
}

function fromJSONTextMatcher(matcher: ngJson.NGBodyTextMatcherJson): NGBodyTextMatcher {
  switch (matcher.type) {
    case "reg":
      return matcher;
    case "text":
      return matcher;
  }
}

function fromJSONBody(ngBody: ngJson.NGBodyJson): NGBody {
  switch (ngBody.type) {
    case "not":
      return { id: uuid.v4(), type: "not", body: fromJSONBody(ngBody.body) };
    case "and":
      return { id: uuid.v4(), type: "and", body: Im.List(ngBody.body.map(x => fromJSONBody(x))) };
    case "or":
      return { id: uuid.v4(), type: "or", body: Im.List(ngBody.body.map(x => fromJSONBody(x))) };
    case "profile":
      return { id: uuid.v4(), ...ngBody };
    case "hash":
      return { id: uuid.v4(), ...ngBody };
    case "body":
      return { id: uuid.v4(), type: "body", matcher: fromJSONTextMatcher(ngBody.matcher) };
    case "name":
      return { id: uuid.v4(), type: "name", matcher: fromJSONTextMatcher(ngBody.matcher) };
    case "vote":
      return { id: uuid.v4(), ...ngBody };
  }
}

export interface NG {
  readonly id: string;
  readonly name: string;
  readonly topic: string | null;
  readonly date: Date;
  readonly expirationDate: Date | null;
  readonly body: NGBody;
  readonly chain: number;
  readonly transparent: boolean;
}

export type NGBody = NGBodyNot |
  NGBodyAnd |
  NGBodyOr |
  NGBodyProfile |
  NGBodyHash |
  NGBodyBody |
  NGBodyName |
  NGBodyVote;

export interface NGBodyNot {
  readonly id: string;
  readonly type: "not";
  readonly body: NGBody;
}

export interface NGBodyAnd {
  readonly id: string;
  readonly type: "and";
  readonly body: Im.List<NGBody>;
}

export interface NGBodyOr {
  readonly id: string;
  readonly type: "or";
  readonly body: Im.List<NGBody>;
}

export interface NGBodyProfile {
  readonly id: string;
  readonly type: "profile";
  readonly profile: string;
}

export interface NGBodyHash {
  readonly id: string;
  readonly type: "hash";
  readonly hash: string;
}

export type NGBodyTextMatcher = NGBodyTextMatcherReg | NGBodyTextMatcherText;
export interface NGBodyTextMatcherReg {
  readonly type: "reg";
  readonly source: string;
  readonly i: boolean;
}

export interface NGBodyTextMatcherText {
  readonly type: "text";
  readonly source: string;
  readonly i: boolean;
}

export interface NGBodyBody {
  readonly id: string;
  readonly type: "body";
  readonly matcher: NGBodyTextMatcher;
}

export interface NGBodyName {
  readonly id: string;
  readonly type: "name";
  readonly matcher: NGBodyTextMatcher;
}

export interface NGBodyVote {
  readonly id: string;
  readonly type: "vote";
  readonly value: number;
}
