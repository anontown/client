import * as Im from 'immutable';

interface StorageJSON1 {
  ver: '1.0.0';
  topicFav: string[];
  topicRead: { topic: string, res: string }[];
}

interface StorageJSON2 {
  ver: '2';
  topicFav: string[];
  topicRead: { topic: string, res: string, count: number }[];
}

interface StorageJSON3 {
  ver: '3';
  topicFavo: string[];
  topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON4 {
  ver: '4';
  topicFavo: string[];
  boardFavo: string[];
  topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON5 {
  //バグでtopicFavoが壊れたのでリセットする用
  ver: '5';
  topicFavo: string[];
  boardFavo: string[];
  topicRead: { [key: string]: { res: string, count: number } };
}

interface StorageJSON6 {
  ver: '6';
  topicFavo: string[];
  tagsFavo: string[][];
  topicRead: { [key: string]: { res: string, count: number } };
}

export type StorageJSON = StorageJSON1 |
  StorageJSON2 |
  StorageJSON3 |
  StorageJSON4 |
  StorageJSON5 |
  StorageJSON6;

export type StorageJSONLatest = StorageJSON6;

export interface Storage {
  topicFavo: Im.Set<string>;
  tagsFavo: Im.Set<Im.Set<string>>;
  topicRead: Im.Map<string, { res: string, count: number }>;
}

export function toStorage(json: StorageJSONLatest): Storage {
  return {
    topicFavo: Im.Set(json.topicFavo),
    tagsFavo: Im.Set(json.tagsFavo.map(tags => Im.Set(tags))),
    topicRead: Im.Map(json.topicRead)
  };
}

export function toJSON(storage: Storage): StorageJSONLatest {
  return {
    ver: '6',
    topicFavo: storage.topicFavo.toArray(),
    tagsFavo: storage.tagsFavo.map(tags => tags!.toArray()).toArray(),
    topicRead: storage.topicRead.toObject()
  };
}


function convert1To2(val: StorageJSON1): StorageJSON2 {
  return {
    ver: '2',
    topicFav: val.topicFav,
    topicRead: val.topicRead.map(x => {
      return {
        topic: x.topic,
        res: x.res,
        count: 0
      };
    })
  };
}

function convert2To3(val: StorageJSON2): StorageJSON3 {
  let read: { [key: string]: { res: string, count: number } } = {};
  val.topicRead.forEach(x => read[x.topic] = { res: x.res, count: x.count });
  return {
    ver: '3',
    topicFavo: val.topicFav,
    topicRead: read
  };
}

function convert3To4(val: StorageJSON3): StorageJSON4 {
  return {
    ver: '4',
    boardFavo: [],
    topicFavo: val.topicFavo,
    topicRead: val.topicRead
  };
}

function convert4To5(val: StorageJSON4): StorageJSON5 {
  return {
    ver: '5',
    boardFavo: val.boardFavo,
    topicFavo: [],
    topicRead: val.topicRead
  };
}

function convert5To6(val: StorageJSON5): StorageJSON6 {
  return {
    ver: '6',
    tagsFavo: val.boardFavo.map(x => x.split('/')),
    topicFavo: [],
    topicRead: val.topicRead
  };
}

export function convert(storage: StorageJSON): StorageJSONLatest {
  let s1 = storage;
  let s2 = s1.ver === '1.0.0' ? convert1To2(s1) : s1;
  let s3 = s2.ver === '2' ? convert2To3(s2) : s2;
  let s4 = s3.ver === '3' ? convert3To4(s3) : s3;
  let s5 = s4.ver === '4' ? convert4To5(s4) : s4;
  let s6 = s5.ver === '5' ? convert5To6(s5) : s5;

  return s6;
}