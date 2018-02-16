export interface NGJson {
  readonly name: string;
  readonly topic: string | null;
  readonly date: string;
  readonly expirationDate: string | null;
  readonly body: NGBodyJson;
}

export type NGBodyJson = NGBodyNotJson |
  NGBodyAndJson |
  NGBodyOrJson |
  NGBodyProfileJson |
  NGBodyHashJson |
  NGBodyBodyJson |
  NGBodyNameJson |
  NGBodyVoteJson;

export interface NGBodyNotJson {
  readonly type: "not";
  readonly body: NGBodyJson;
}

export interface NGBodyAndJson {
  readonly type: "and";
  readonly body: NGBodyJson[];
}

export interface NGBodyOrJson {
  readonly type: "or";
  readonly body: NGBodyJson[];
}

export interface NGBodyProfileJson {
  readonly type: "profile";
  readonly profile: string;
}

export interface NGBodyHashJson {
  readonly type: "hash";
  readonly hash: string;
}

export interface NGBodyRegJson {
  readonly source: string;
  readonly i: boolean;
}

export interface NGBodyBodyJson {
  readonly type: "body";
  readonly reg: NGBodyRegJson;
}

export interface NGBodyNameJson {
  readonly type: "name";
  readonly reg: NGBodyRegJson;
}

export interface NGBodyVoteJson {
  readonly type: "vote";
  readonly value: number;
}
