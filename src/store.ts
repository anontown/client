import * as api from "@anontown/api-types";
import { Storage, ResTree } from "./models";

export interface Store {
  db: {
    clients: { [id: string]: api.Client };
    histories: { [id: string]: api.History };
    reses: { [id: string]: api.Res };
    profiles: { [id: string]: api.Profile };
    topics: { [id: string]: api.Topic };
    msgs: { [id: string]: api.Msg };
  },
  user: {
    token: api.TokenMaster,
    storage: Storage,
    notices: {
      reses: { id: string }[]
    },
    msgs: {
      msgs: { id: string }[]
    },
    apps: {
      client: { id: string }[]
    },
    devApps: {
      client: { id: string }[]
    }
  } | null,
  topics: {
    [id: string]: {
      reses: { id: string }[]
    }
  },
  search: {
    topics: { id: string }[]
  }
}