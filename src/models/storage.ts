import * as Im from "immutable";
import * as ng from "./ng";
import * as ngJson from "./ng-json";


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
  readonly ng: ngJson.NGJson[]
}

export type StorageJSON = StorageJSON1 |
  StorageJSON2 |
  StorageJSON3 |
  StorageJSON4 |
  StorageJSON5 |
  StorageJSON6 |
  StorageJSON7;

export type StorageJSONLatest = StorageJSON7;
export const initStorage: StorageJSONLatest = {
  ver: "7",
  topicFavo: [],
  tagsFavo: [],
  topicRead: {},
  ng: []
};
export const verArray: StorageJSON["ver"][] = ["7", "6", "5", "4", "3", "2", "1.0.0"];

export interface Storage {
  readonly topicFavo: Im.Set<string>;
  readonly tagsFavo: Im.Set<Im.Set<string>>;
  readonly topicRead: Im.Map<string, { res: string, count: number }>;
  readonly ng: Im.List<ng.NG>
}

export function toStorage(json: StorageJSONLatest): Storage {
  return {
    topicFavo: Im.Set(json.topicFavo),
    tagsFavo: Im.Set(json.tagsFavo.map(tags => Im.Set(tags))),
    topicRead: Im.Map(json.topicRead),
    ng: Im.List(json.ng.map(x => ng.fromJSON(x)))
  };
}

export function toJSON(storage: Storage): StorageJSONLatest {
  return {
    ver: "7",
    topicFavo: storage.topicFavo.toArray(),
    tagsFavo: storage.tagsFavo.map(tags => tags.toArray()).toArray(),
    topicRead: storage.topicRead.toObject(),
    ng: storage.ng.map(x => ng.toJSON(x)).toArray()
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
    ng: []
  };
}

export function convert(storage: StorageJSON): StorageJSONLatest {
  const s1 = storage;
  const s2 = s1.ver === "1.0.0" ? convert1To2(s1) : s1;
  const s3 = s2.ver === "2" ? convert2To3(s2) : s2;
  const s4 = s3.ver === "3" ? convert3To4(s3) : s3;
  const s5 = s4.ver === "4" ? convert4To5(s4) : s4;
  const s6 = s5.ver === "5" ? convert5To6(s5) : s5;
  const s7 = s6.ver === "6" ? convert6To7(s6) : s6;

  const json = s6.ver === "7" ? s7 : initStorage;

  return json;
}
