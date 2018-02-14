import * as ngJson from "./ng-json";
import { ResSeted } from "./res-seted";
import * as Im from "immutable";

export function isNG(ng: NG, res: ResSeted) {
  if (ng.topic !== null && ng.topic !== res.topic) {
    return false;
  }

  if (ng.expirationDate.valueOf() < new Date(res.date).valueOf()) {
    return false;
  }

  return isBodyNG(ng.body, res);
}

function isBodyNG(ngBody: NGBody, res: ResSeted): boolean {
  switch (ngBody.type) {
    case "not":
      return !isBodyNG(ngBody.body, res);
    case "and":
      return ngBody.body.every(body => isBodyNG(body, res));
    case "or":
      return ngBody.body.some(body => isBodyNG(body, res));
    case "profile":
      return res.type === "normal" && res.profile !== null && ngBody.id === res.profile.id;
    case "hash":
      return res.hash === ngBody.hash;
    case "body":
      return res.type === "normal" && ngBody.reg.test(res.text);
    case "name":
      return res.type === "normal" && res.name !== null && ngBody.reg.test(res.name);
    case "vote":
      return res.uv - res.dv < ngBody.value;
  }
}

export function toJSON(ng: NG): ngJson.NGJson {
  return {
    ...ng,
    body: toJSONBody(ng.body),
    expirationDate: ng.expirationDate.toISOString(),
    date: ng.date.toISOString()
  };
}

export function toJSONReg(reg: RegExp): ngJson.NGBodyRegJson {
  return {
    source: reg.source,
    i: reg.ignoreCase,
  };
}

export function toJSONBody(ngBody: NGBody): ngJson.NGBodyJson {
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
      return { type: "body", reg: toJSONReg(ngBody.reg) };
    case "name":
      return { type: "name", reg: toJSONReg(ngBody.reg) };
    case "vote":
      return ngBody;
  }
}

export function fromJSON(ngJson: ngJson.NGJson): NG {
  return {
    ...ngJson,
    body: fromJSONBody(ngJson.body),
    expirationDate: new Date(ngJson.expirationDate),
    date: new Date(ngJson.date)
  };
}

export function fromJSONReg(reg: ngJson.NGBodyRegJson): RegExp {
  return new RegExp(reg.source, [
    reg.i ? "i" : ""
  ].join());
}

export function fromJSONBody(ngBody: ngJson.NGBodyJson): NGBody {
  switch (ngBody.type) {
    case "not":
      return { type: "not", body: fromJSONBody(ngBody.body) };
    case "and":
      return { type: "and", body: Im.List(ngBody.body.map(x => fromJSONBody(x))) };
    case "or":
      return { type: "or", body: Im.List(ngBody.body.map(x => fromJSONBody(x))) };
    case "profile":
      return ngBody;
    case "hash":
      return ngBody;
    case "body":
      return { type: "body", reg: fromJSONReg(ngBody.reg) };
    case "name":
      return { type: "name", reg: fromJSONReg(ngBody.reg) };
    case "vote":
      return ngBody;
  }
}

export interface NG {
  readonly name: string;
  readonly topic: string | null;
  readonly transparent: boolean;
  readonly date: Date;
  readonly expirationDate: Date;
  readonly body: NGBody;
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
  readonly type: "not";
  readonly body: NGBody;
}

export interface NGBodyAnd {
  readonly type: "and";
  readonly body: Im.List<NGBody>;
}

export interface NGBodyOr {
  readonly type: "or";
  readonly body: Im.List<NGBody>;
}

export interface NGBodyProfile {
  readonly type: "profile";
  readonly id: string;
}

export interface NGBodyHash {
  readonly type: "hash";
  readonly hash: string;
}

export interface NGBodyReg {
  readonly reg: RegExp;
}

export interface NGBodyBody {
  readonly type: "body";
  readonly reg: RegExp;
}

export interface NGBodyName {
  readonly type: "name";
  readonly reg: RegExp;
}

export interface NGBodyVote {
  readonly type: "vote";
  readonly value: number;
}
