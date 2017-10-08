import * as Im from 'immutable';
import { Actions } from "../actions";

export type ResStore = Im.Map<symbol, {
  id: string,
  children: { msg: string | null, reses: Im.List<symbol> } | null
}>;

const initState: ResStore = Im.Map();

export function resReducer(state = initState, action: Actions): ResStore {
  switch (action.type) {
    case "RES_HASH_SUCCESS":
    case "RES_REPLY_SUCCESS":
    case "RES_SEND_SUCCESS":
      return state.withMutations(x => {
        //レスコンポーネント追加
        const syms = (action.type === "RES_SEND_SUCCESS" ? [action.res] : action.reses).map(res => {
          const sym = Symbol();
          x.set(sym, { id: res.id, children: null });
          return sym;
        });

        state.update(action.id, res => ({ ...res, children: { msg: action.type === "RES_HASH_SUCCESS" ? "HASH抽出" : null, reses: Im.List(syms) } }))
      });
    default:
      return state
  }
}