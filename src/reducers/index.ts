import { combineReducers } from "redux";
import { mdEditorReducer, MdEditorStore } from "./md-editor";
import { userReducer, UserStore } from "./user";
import { resWriteReducer, ResWriteStore } from "./res-write";
import { apiObjectReducer, APIObjectStore } from "./api-object";

export interface Store {
  mdEditors: MdEditorStore,
  user: UserStore,
  resWrite: ResWriteStore,
  apiObject: APIObjectStore
}

export const reducer = combineReducers<Store>({
  mdEditors: mdEditorReducer,
  user: userReducer,
  resWrite: resWriteReducer,
  apiObject: apiObjectReducer
});

export {
  MdEditorStore,
  UserStore,
  ResWriteStore,
  APIObjectStore
};