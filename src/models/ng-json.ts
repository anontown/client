export interface NGJson {
  readonly name: string;
  readonly topic: string | null;
  readonly date: string;
  readonly expirationDate: string | null;
  readonly node: NGNodeJson;
  readonly chain: number;
  readonly transparent: boolean;
}

export type NGNodeJson = NGNodeNotJson |
  NGNodeAndJson |
  NGNodeOrJson |
  NGNodeProfileJson |
  NGNodeHashJson |
  NGNodeBodyJson |
  NGNodeNameJson |
  NGNodeVoteJson;

export interface NGNodeNotJson {
  readonly type: "not";
  readonly child: NGNodeJson;
}

export interface NGNodeAndJson {
  readonly type: "and";
  readonly children: NGNodeJson[];
}

export interface NGNodeOrJson {
  readonly type: "or";
  readonly children: NGNodeJson[];
}

export interface NGNodeProfileJson {
  readonly type: "profile";
  readonly profile: string;
}

export interface NGNodeHashJson {
  readonly type: "hash";
  readonly hash: string;
}

export type NGNodeTextMatcherJson = NGNodeTextMatcherRegJson | NGNodeTextMatcherTextJson;

export interface NGNodeTextMatcherRegJson {
  readonly type: "reg";
  readonly source: string;
  readonly i: boolean;
}

export interface NGNodeTextMatcherTextJson {
  readonly type: "text";
  readonly source: string;
  readonly i: boolean;
}

export interface NGNodeBodyJson {
  readonly type: "text";
  readonly matcher: NGNodeTextMatcherJson;
}

export interface NGNodeNameJson {
  readonly type: "name";
  readonly matcher: NGNodeTextMatcherJson;
}

export interface NGNodeVoteJson {
  readonly type: "vote";
  readonly value: number;
}
