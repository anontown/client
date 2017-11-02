import { UserData } from "../models";

export interface UpdateUserData {
  type: 'UPDATE_USER_DATA',
  data: UserData | null
}

export type UserActions = UpdateUserData;;

export function updateUserData(data: UserData | null): UpdateUserData {
  if (data !== null) {
    localStorage.setItem('token', JSON.stringify({
      id: data.token.id,
      key: data.token.key
    }));
  } else {
    localStorage.removeItem('token');
  }

  return {
    type: 'UPDATE_USER_DATA',
    data
  };
}