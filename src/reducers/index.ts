import { combineReducers } from "redux";
import { Actions } from "../actions";
import {
  userReducer,
  UserStore,
} from "./user";

export interface Store {
  user: UserStore;
}

export const reducer = combineReducers<Store, Actions>({
  user: userReducer,
});

export {
  UserStore,
};
