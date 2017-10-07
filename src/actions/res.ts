import * as api from "@anontown/api-types";

export interface ResDeleteRequest {
  type: 'RES_DELETE_REQUEST',
  id: symbol
}

export interface ResDeleteSuccess {
  type: 'RES_DELETE_SUCCESS',
  id: symbol,
  res: api.Res
}

export interface ResDeleteFail {
  type: 'RES_DELETE_FAIL',
  id: symbol,
  errors: string[]
}

export interface ResUVRequest {
  type: 'RES_UV_REQUEST',
  id: symbol
}

export interface ResUVSuccess {
  type: 'RES_UV_SUCCESS',
  id: symbol,
  res: api.Res
}

export interface ResUVFail {
  type: 'RES_UV_FAIL',
  id: symbol,
  errors: string[]
}

export interface ResDVRequest {
  type: 'RES_DV_REQUEST',
  id: symbol
}

export interface ResDVSuccess {
  type: 'RES_DV_SUCCESS',
  id: symbol,
  res: api.Res
}

export interface ResDVFail {
  type: 'RES_DV_FAIL',
  id: symbol,
  errors: string[]
}

export interface ResCVRequest {
  type: 'RES_CV_REQUEST',
  id: symbol
}

export interface ResCVSuccess {
  type: 'RES_CV_SUCCESS',
  id: symbol,
  res: api.Res
}

export interface ResCVFail {
  type: 'RES_CV_FAIL',
  id: symbol,
  errors: string[]
}

export interface ResHashRequest {
  type: 'RES_HASH_REQUEST',
  id: symbol,
}

export interface ResHashSuccess {
  type: 'RES_HASH_SUCCESS',
  id: symbol,
  reses: api.Res[]
}

export interface ResHashFail {
  type: 'RES_HASH_FAIL',
  id: symbol,
  errors: string[]
}

export interface ResReplyRequest {
  type: 'RES_REPLY_REQUEST',
  id: symbol
}

export interface ResReplySuccess {
  type: 'RES_REPLY_SUCCESS',
  id: symbol,
  reses: api.Res[]
}

export interface ResReplyFail {
  type: 'RES_REPLY_FAIL',
  id: symbol,
  errors: string[]
}

export interface ResSendRequest {
  type: 'RES_SEND_REQUEST',
  id: symbol,
}

export interface ResSendSuccess {
  type: 'RES_SEND_SUCCESS',
  id: symbol,
  res: api.Res
}

export interface ResSendFail {
  type: 'RES_SEND_FAIL',
  id: symbol,
  errors: string[]
}

export type ResActions = ResDeleteRequest | ResDeleteSuccess | ResDVFail |
  ResUVRequest | ResUVSuccess | ResUVFail |
  ResDVRequest | ResDVSuccess | ResDVFail |
  ResCVRequest | ResCVSuccess | ResCVFail |
  ResHashRequest | ResHashSuccess | ResHashFail |
  ResReplyRequest | ResReplySuccess | ResReplyFail |
  ResSendRequest | ResSendSuccess | ResSendFail;

export function resDeleteRequest(id: symbol): ResDeleteRequest {
  return {
    type: 'RES_DELETE_REQUEST',
    id
  };
}

export function resDeleteSuccess(id: symbol, res: api.Res): ResDeleteSuccess {
  return {
    type: 'RES_DELETE_SUCCESS',
    id,
    res
  }
}

export function resDeleteFail(id: symbol, errors: string[]): ResDeleteFail {
  return {
    type: 'RES_DELETE_FAIL',
    id,
    errors
  }
}

export function resUVRequest(id: symbol): ResUVRequest {
  return {
    type: 'RES_UV_REQUEST',
    id
  };
}

export function resUVSuccess(id: symbol, res: api.Res): ResUVSuccess {
  return {
    type: 'RES_UV_SUCCESS',
    id,
    res
  }
}

export function resUVFail(id: symbol, errors: string[]): ResUVFail {
  return {
    type: 'RES_UV_FAIL',
    id,
    errors
  }
}

export function resDVequest(id: symbol): ResDVRequest {
  return {
    type: 'RES_DV_REQUEST',
    id
  };
}

export function resDVSuccess(id: symbol, res: api.Res): ResDVSuccess {
  return {
    type: 'RES_DV_SUCCESS',
    id,
    res
  }
}

export function resDVFail(id: symbol, errors: string[]): ResDVFail {
  return {
    type: 'RES_DV_FAIL',
    id,
    errors
  }
}

export function resCVequest(id: symbol): ResCVRequest {
  return {
    type: 'RES_CV_REQUEST',
    id
  };
}

export function resCVSuccess(id: symbol, res: api.Res): ResCVSuccess {
  return {
    type: 'RES_CV_SUCCESS',
    id,
    res
  }
}

export function resCVFail(id: symbol, errors: string[]): ResCVFail {
  return {
    type: 'RES_CV_FAIL',
    id,
    errors
  }
}

export function resHashequest(id: symbol): ResHashRequest {
  return {
    type: 'RES_HASH_REQUEST',
    id
  };
}

export function resHashSuccess(id: symbol, reses: api.Res[]): ResHashSuccess {
  return {
    type: 'RES_HASH_SUCCESS',
    id,
    reses
  }
}

export function resHashFail(id: symbol, errors: string[]): ResHashFail {
  return {
    type: 'RES_HASH_FAIL',
    id,
    errors
  }
}

export function resReplyRquest(id: symbol): ResReplyRequest {
  return {
    type: 'RES_REPLY_REQUEST',
    id
  };
}

export function resReplySuccess(id: symbol, reses: api.Res[]): ResReplySuccess {
  return {
    type: 'RES_REPLY_SUCCESS',
    id,
    reses
  }
}

export function resReplyFail(id: symbol, errors: string[]): ResReplyFail {
  return {
    type: 'RES_REPLY_FAIL',
    id,
    errors
  }
}

export function resSendRquest(id: symbol): ResSendRequest {
  return {
    type: 'RES_SEND_REQUEST',
    id
  };
}

export function resSendSuccess(id: symbol, res: api.Res): ResSendSuccess {
  return {
    type: 'RES_SEND_SUCCESS',
    id,
    res
  }
}

export function resSendFail(id: symbol, errors: string[]): ResSendFail {
  return {
    type: 'RES_SEND_FAIL',
    id,
    errors
  }
}