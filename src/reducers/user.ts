import * as Im from 'immutable';
import { Actions } from "../actions";
import * as api from "@anontown/api-types";

export type UserStore = {
  token: api.TokenMaster,
  storage: Storage,
  notices: {
    reses: Im.List<{ id: string }>
  },
  msgs: {
    msgs: Im.List<{ id: string }>
  },
  apps: {
    client: Im.List<{ id: string }>
  },
  devApps: {
    client: Im.List<{ id: string }>
  },
  profiles: Im.List<string>;
} | null;

const initState: UserStore = null;

export function userReducer(state = initState, action: Actions): UserStore {
  switch (action.type) {
    default:
      return state
  }
}