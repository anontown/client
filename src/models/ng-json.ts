export interface NGJson {
  name: string
  topic: string | null,
  transparent: boolean,
  date: string,
  expirationDate: string,
  body: NGBodyJson
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
  type: "not",
  body: NGBodyJson
}

export interface NGBodyAndJson {
  type: "and",
  body: NGBodyJson[]
}

export interface NGBodyOrJson {
  type: "or",
  body: NGBodyJson[]
}

export interface NGBodyProfileJson {
  type: "profile",
  id: string
}

export interface NGBodyHashJson {
  type: "hash",
  hash: string
}

export interface NGBodyRegJson {
  reg: string,
  g: boolean,
  i: boolean,
  m: boolean,
  y: boolean
}

export interface NGBodyBodyJson extends NGBodyRegJson {
  type: "body"
}

export interface NGBodyNameJson extends NGBodyRegJson {
  type: "name"
}

export interface NGBodyVoteJson {
  type: "vote",
  value: number
}