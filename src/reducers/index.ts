import { combineReducers } from "redux";
import { mdEditorReducer as mdEditors, MdEditorStore } from "./md-editor";

export interface Store {
  mdEditors: MdEditorStore
}

export const reducer = combineReducers<Store>({
  mdEditors
});

export {
  MdEditorStore
};