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

export function apiObjectReducer(state = initState, action: Actions): APIObjectStore {
  switch (action.type) {
    default:
      return state
  }
}