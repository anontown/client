import { Actions } from "../actions";
import { UserData } from "../models";

export type UserStore = UserData | null;

const initState: UserStore = null;

export function userReducer(state = initState, action: Actions): UserStore {
  switch (action.type) {
    case "UPDATE_USER_DATA":
      return action.data;
    default:
      return state
  }
}