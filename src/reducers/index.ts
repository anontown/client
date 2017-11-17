import { combineReducers } from "redux";
import { userReducer, UserStore } from "./user";

export interface Store {
  user: UserStore;
}

export const reducer = combineReducers<Store>({
  user: userReducer,
});

export {
  UserStore,
};
