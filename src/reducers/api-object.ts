import * as Im from 'immutable';
import { Actions } from "../actions";
import * as api from "@anontown/api-types";

export type APIObjectStore = {
  clients: Im.Map<string, api.Client>;
  histories: Im.Map<string, api.History>;
  reses: Im.Map<string, api.Res>;
  profiles: Im.Map<string, api.Profile>;
  topics: Im.Map<string, api.Topic>;
  msgs: Im.Map<string, api.Msg>;
};

const initState: APIObjectStore = {
  clients: Im.Map(),
  histories: Im.Map(),
  reses: Im.Map(),
  profiles: Im.Map(),
  topics: Im.Map(),
  msgs: Im.Map(),
};

function resReducer(state: APIObjectStore["reses"], action: Actions): APIObjectStore["reses"] {
  switch (action.type) {
    case "RES_DELETE_SUCCESS":
    case "RES_UV_SUCCESS":
    case "RES_DV_SUCCESS":
    case "RES_CV_SUCCESS":
    case "RES_SEND_SUCCESS":
      return state.set(action.res.id, action.res);
    case "RES_HASH_SUCCESS":
    case "RES_REPLY_SUCCESS":
      return state.withMutations(x => {
        for (let res of action.reses) {
          x.set(res.id, res);
        }
      });
    default:
      return state;
  }
}

export function apiObjectReducer(state = initState, action: Actions): APIObjectStore {
  return {
    ...state,
    reses: resReducer(state.reses, action)
  };
}