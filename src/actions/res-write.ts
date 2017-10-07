import { DataClass } from "data-class";
import * as api from '@anontown/api-types'

type ID = DataClass<{ topic: string, reply: string | null }>;

export interface ResWriteRequest {
  type: 'RES_WRITE_REQUEST',
  id: ID,
  name: string | null;
  profile: string | null;
  age: boolean;
}

export interface ResWriteSuccess {
  type: 'RES_WRITE_SUCCESS'
  id: ID,
  res: api.Res
}

export interface ResWriteFAIL {
  type: 'RES_WRITE_FAIL'
  id: ID,
  errors: string[]
}

export type ResWriteActions = ResWriteRequest |
  ResWriteSuccess |
  ResWriteFAIL;

export function resWriteRequest(id: ID, name: string | null, profile: string | null, age: boolean): ResWriteRequest {
  return {
    type: 'RES_WRITE_REQUEST',
    id,
    name,
    profile,
    age
  };
}

export function resWriteSuccess(id: ID, res: api.Res): ResWriteSuccess {
  return {
    type: 'RES_WRITE_SUCCESS',
    id,
    res
  };
}

export function resWriteFAIL(id: ID, errors: string[]): ResWriteFAIL {
  return {
    type: 'RES_WRITE_FAIL',
    id,
    errors
  };
}