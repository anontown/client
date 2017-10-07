import { combineReducers } from "redux";
import { mdEditorReducer, MdEditorStore } from "./md-editor";
import { userReducer, UserStore } from "./user";
import { resWriteReducer, ResWriteStore } from "./res-write";
import { apiObjectReducer, APIObjectStore } from "./api-object";
import { resReducer, ResStore } from "./res";

export interface Store {
  mdEditors: MdEditorStore,
  user: UserStore,
  resWrite: ResWriteStore,
  apiObject: APIObjectStore,
  res: ResStore,
}

export const reducer = combineReducers<Store>({
  mdEditors: mdEditorReducer,
  user: userReducer,
  resWrite: resWriteReducer,
  apiObject: apiObjectReducer,
  res: resReducer
});

export {
  MdEditorStore,
  UserStore,
  ResWriteStore,
  APIObjectStore,
  ResStore
};