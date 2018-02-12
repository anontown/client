export interface NG {
  topic: string | null,
  transparent: boolean,
  date: string,
  expirationDate: string,
  body: NGBody
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
  type: "not",
  body: NGBody
}

export interface NGBodyAnd {
  type: "and",
  body: NGBody[]
}

export interface NGBodyOr {
  type: "or",
  body: NGBody[]
}

export interface NGBodyProfile {
  type: "profile",
  id: string
}

export interface NGBodyHash {
  type: "hash",
  id: string
}

export interface NGBodyReg {
  reg: string,
  g: boolean,
  i: boolean,
  m: boolean,
  y: boolean
}

export interface NGBodyBody extends NGBodyReg {
  type: "body"
}

export interface NGBodyName extends NGBodyReg {
  type: "name"
}

export interface NGBodyVote {
  type: "vote",
  value: number
}