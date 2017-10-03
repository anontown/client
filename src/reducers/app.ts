import { Actions } from "../actions/type";
import * as Im from 'immutable';

import * as api from "@anontown/api-types";
import { Storage } from "./models";
import * as Im from 'immutable';

export interface Store {
  api: {
    clients: Im.Map<string, api.Client>;
    histories: Im.Map<string, api.History>;
    reses: Im.Map<string, api.Res>;
    profiles: Im.Map<string, api.Profile>;
    topics: Im.Map<string, api.Topic>;
    msgs: Im.Map<string, api.Msg>;
  },
  comp: {
    reses: Im.Map<symbol, {
      id: string,
      children: { msg: string, reses: Im.List<symbol> } | null
    }>;
    mdEditors: Im.Map<symbol, {
      body: string;
      errors?: string[],
      isUploading: boolean
    }>;
  },
  user: {
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
    }
  } | null,
  topics: Im.Map<string, {
    reses: Im.List<symbol>
  }>,
  search: {
    topics: Im.List<{ id: string }>
  }
}

const initState: Store = {
  api: {
    clients: Im.Map(),
    histories: Im.Map(),
    reses: Im.Map(),
    profiles: Im.Map(),
    topics: Im.Map(),
    msgs: Im.Map(),
  },
  comp: {
    reses: Im.Map(),
    mdEditors: Im.Map(),
  },
  user: null,
  topics: Im.Map(),
  search: {
    topics: Im.List()
  }
}

export function app(state = initState, action: Actions): Store {
  switch (action.type) {
    case 'MD_EDITOR_UPLOAD_IMAGE_REQUEST':
      return {
        ...state,
        comp: {
          ...state.comp,
          mdEditors: state.comp.mdEditors.update(action.id, editor => ({
            ...editor,
            isUploading: true
          }))
        }
      };
    case 'MD_EDITOR_UPLOAD_IMAGE_SUCCESS':
      return {
        ...state,
        comp: {
          ...state.comp,
          mdEditors: state.comp.mdEditors.update(action.id, editor => ({
            ...editor,
            body: state.comp.mdEditors.get(action.id).body + `![](${action.url})`,
            isUploading: false,
            errors: []
          }))
        }
      };
    case 'MD_EDITOR_UPLOAD_IMAGE_ERROR':
      return {
        ...state,
        comp: {
          ...state.comp,
          mdEditors: state.comp.mdEditors.update(action.id, editor => ({
            ...editor,
            isUploading: false,
            errors: action.errors
          }))
        }
      };
    case 'MD_EDITOR_CHANGE':
      return {
        ...state,
        comp: {
          ...state.comp,
          mdEditors: state.comp.mdEditors.update(action.id, editor => ({
            ...editor,
            body: action.value
          }))
        }
      };
    default:
      return state
  }
}