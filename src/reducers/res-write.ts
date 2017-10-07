import * as Im from 'immutable';
import { Actions } from "../actions";
import { DataClass } from "data-class";

export type ResWriteStoreKey = DataClass<{ topic: string, reply: string | null }>;

export type ResWriteStore = Im.Map<ResWriteStoreKey, {
  mdEditorID: symbol;
  errors?: string[]
}>;

const initState: ResWriteStore = Im.Map();

export function resWriteReducer(state = initState, action: Actions): ResWriteStore {
  switch (action.type) {
    case "RES_WRITE_FAIL":
      return state.update(action.id, val => ({ ...val, errors: action.errors }));
    default:
      return state
  }
}