import { combineReducers } from "redux";
import {
  userReducer,
  UserStore,
} from "./user";

export interface Store {
  user: UserStore;
}

export const reducer = combineReducers<Store>({
  // とりあえず通らないので
  // redux v4なら通るけど他のライブラリとの相性的な問題が
  user: userReducer as any,
});

export {
  UserStore,
};
