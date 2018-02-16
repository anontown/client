export interface NGJson {
  readonly name: string;
  readonly topic: string | null;
  readonly date: string;
  readonly expirationDate: string | null;
  readonly body: NGBodyJson;
  readonly chain: number;
  readonly transparent: boolean;
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

export type NGBodyTextMatcherJson = NGBodyTextMatcherRegJson | NGBodyTextMatcherTextJson;

export interface NGBodyTextMatcherRegJson {
  readonly type: "reg";
  readonly source: string;
  readonly i: boolean;
}

export interface NGBodyTextMatcherTextJson {
  readonly type: "text";
  readonly source: string;
  readonly i: boolean;
}

export interface NGBodyBodyJson {
  readonly type: "body";
  readonly matcher: NGBodyTextMatcherJson;
}

export interface NGBodyNameJson {
  readonly type: "name";
  readonly matcher: NGBodyTextMatcherJson;
}

export interface NGBodyVoteJson {
  readonly type: "vote";
  readonly value: number;
}
