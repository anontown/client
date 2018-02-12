import { ResSeted } from "./res-seted";
import * as ngJson from "./ng-json";

export function isNG(ng: ngJson.NGJson, res: ResSeted) {
  if (ng.topic !== null && ng.topic !== res.topic) {
    return false;
  }

  if (new Date(ng.expirationDate).valueOf() < new Date(res.date).valueOf()) {
    return false;
  }

  return isBodyNG(ng.body, res);
}

function isBodyNG(ngBody: ngJson.NGBodyJson, res: ResSeted): boolean {
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
      return res.type === "normal" && isRegNG(ngBody, res.text);
    case "name":
      return res.type === "normal" && res.name !== null && isRegNG(ngBody, res.name);
    case "vote":
      return res.uv - res.dv < ngBody.value;
  }
}

function isRegNG(reg: ngJson.NGBodyRegJson, str: string) {
  return !!str.match(new RegExp(reg.reg, [
    reg.g ? "g" : "",
    reg.i ? "i" : "",
    reg.m ? "m" : "",
    reg.y ? "y" : ""
  ].join()));
}