import { UserData } from "../models";

export interface UpdateUserData {
  type: "UPDATE_USER_DATA";
  data: UserData | null;
}

export type UserActions = UpdateUserData;

export function updateUserData(data: UserData | null): UpdateUserData {
  return {
    type: "UPDATE_USER_DATA",
    data,
  };
}
