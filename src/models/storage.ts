import * as Im from "immutable";
import * as ng from "./ng";
import * as ngJson from "./ng-json";
import { gqlClient } from "../utils";
import * as G from "../../generated/graphql";

interface StorageJSON1 {
  readonly ver: "1.0.0";
  readonly topicFav: string[];
  readonly topicRead: Array<{ topic: string, res: string }>;
}

interface StorageJSON2 {
  readonly ver: "2";
  readonly topicFav: string[];
  readonly topicRead: Array<{ topic: string, res: string, count: number }>;
}

interface StorageJSON3 {
  readonly ver: "3";
  readonly topicFavo: string[];
  readonly topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON4 {
  readonly ver: "4";
  readonly topicFavo: string[];
  readonly boardFavo: string[];
  readonly topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON5 {
  // バグでtopicFavoが壊れたのでリセットする用
  readonly ver: "5";
  readonly topicFavo: string[];
  readonly boardFavo: string[];
  readonly topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON6 {
  readonly ver: "6";
  readonly topicFavo: string[];
  readonly tagsFavo: string[][];
  readonly topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON7 {
  readonly ver: "7";
  readonly topicFavo: string[];
  readonly tagsFavo: string[][];
  readonly topicRead: { [key: string]: { res: string, count: number } };
  readonly ng: ngJson.NGJson[];
}

interface StorageJSON8 {
  readonly ver: "8";
  readonly topicFavo: string[];
  readonly tagsFavo: string[][];
  readonly topicRead: { [key: string]: { date: string, count: number } };
  readonly ng: ngJson.NGJson[];
}

interface StorageJSON9 {
  readonly ver: "9";
  readonly topicFavo: string[];
  readonly tagsFavo: string[][];
  readonly topicRead: {
    [key: string]: {
      date: string,
      count: number,
    },
  };
  readonly topicWrite: {
    [key: string]: {
      name: string,
      profile: string | null,
      text: string,
      age: boolean,
      replyText: { [key: string]: string },
    },
  };
  readonly ng: ngJson.NGJson[];
}

export type StorageJSON = StorageJSON1 |
  StorageJSON2 |
  StorageJSON3 |
  StorageJSON4 |
  StorageJSON5 |
  StorageJSON6 |
  StorageJSON7 |
  StorageJSON8 |
  StorageJSON9;

export type StorageJSONLatest = StorageJSON9;
export const initStorage: StorageJSONLatest = {
  ver: "9",
  topicFavo: [],
  tagsFavo: [],
  topicRead: {},
  topicWrite: {},
  ng: [],
};
export const verArray: Array<StorageJSON["ver"]> = ["9", "8", "7", "6", "5", "4", "3", "2", "1.0.0"];

export interface Storage {
  readonly topicFavo: Im.Set<string>;
  readonly tagsFavo: Im.Set<Im.Set<string>>;
  readonly topicRead: Im.Map<string, {
    date: string,
    count: number,
  }>;
  readonly topicWrite: Im.Map<string, {
    name: string,
    profile: string | null,
    text: string,
    replyText: Im.Map<string, string>,
    age: boolean,
  }>;
  readonly ng: Im.List<ng.NG>;
}

export function toStorage(json: StorageJSONLatest): Storage {
  return {
    topicFavo: Im.Set(json.topicFavo),
    tagsFavo: Im.Set(json.tagsFavo.map(tags => Im.Set(tags))),
    topicRead: Im.Map(json.topicRead),
    topicWrite: Im.Map(json.topicWrite).map(x => ({ ...x, replyText: Im.Map(x.replyText) })),
    ng: Im.List(json.ng.map(x => ng.fromJSON(x))),
  };
}

export function toJSON(storage: Storage): StorageJSONLatest {
  return {
    ver: "9",
    topicFavo: storage.topicFavo.toArray(),
    tagsFavo: storage.tagsFavo.map(tags => tags.toArray()).toArray(),
    topicRead: storage.topicRead.toObject(),
    topicWrite: storage.topicWrite.map(x => ({ ...x, replyText: x.replyText.toObject() })).toObject(),
    ng: storage.ng.map(x => ng.toJSON(x)).toArray(),
  };
}

function convert1To2(val: StorageJSON1): StorageJSON2 {
  return {
    ver: "2",
    topicFav: val.topicFav,
    topicRead: val.topicRead.map(x => {
      return {
        topic: x.topic,
        res: x.res,
        count: 0,
      };
    }),
  };
}

function convert2To3(val: StorageJSON2): StorageJSON3 {
  const read: { [key: string]: { res: string, count: number } } = {};
  val.topicRead.forEach(x => read[x.topic] = { res: x.res, count: x.count });
  return {
    ver: "3",
    topicFavo: val.topicFav,
    topicRead: read,
  };
}

function convert3To4(val: StorageJSON3): StorageJSON4 {
  return {
    ver: "4",
    boardFavo: [],
    topicFavo: val.topicFavo,
    topicRead: val.topicRead,
  };
}

function convert4To5(val: StorageJSON4): StorageJSON5 {
  return {
    ver: "5",
    boardFavo: val.boardFavo,
    topicFavo: [],
    topicRead: val.topicRead,
  };
}

function convert5To6(val: StorageJSON5): StorageJSON6 {
  return {
    ver: "6",
    tagsFavo: val.boardFavo.map(x => x.split("/")),
    topicFavo: [],
    topicRead: val.topicRead,
  };
}

function convert6To7(val: StorageJSON6): StorageJSON7 {
  return {
    ...val,
    ver: "7",
    ng: [],
  };
}

async function convert7To8(val: StorageJSON7): Promise<StorageJSON8> {
  const topicRead: StorageJSON8["topicRead"] = {};
  const dates = new Map((await gqlClient.query<G.FindReses.Query, G.FindReses.Variables>({
    query: G.FindReses.Document,
    variables: {
      query: {
        id: Object.entries(val.topicRead)
          .map(([_l, { res }]) => res)
      }
    }
  }))
    .data
    .reses
    .map<[string, string]>(x => [x.id, x.date]));
  for (const topic of Object.keys(val.topicRead)) {
    const data = val.topicRead[topic];
    topicRead[topic] = { count: data.count, date: dates.get(data.res)! };
  }
  return {
    ...val,
    ver: "8",
    topicRead,
  };
}

function convert8To9(val: StorageJSON8): StorageJSON9 {
  return {
    ...val,
    ver: "9",
    topicWrite: {},
  };
}

export async function convert(storage: StorageJSON): Promise<StorageJSONLatest> {
  const s1 = storage;
  const s2 = s1.ver === "1.0.0" ? convert1To2(s1) : s1;
  const s3 = s2.ver === "2" ? convert2To3(s2) : s2;
  const s4 = s3.ver === "3" ? convert3To4(s3) : s3;
  const s5 = s4.ver === "4" ? convert4To5(s4) : s4;
  const s6 = s5.ver === "5" ? convert5To6(s5) : s5;
  const s7 = s6.ver === "6" ? convert6To7(s6) : s6;
  const s8 = s7.ver === "7" ? await convert7To8(s7) : s7;
  const s9 = s8.ver === "8" ? convert8To9(s8) : s8;

  const json = s9.ver === "9" ? s9 : initStorage;

  return json;
}
