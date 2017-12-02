import { combineEpics } from "redux-observable";
import { userEpics } from "./user";

export const epics = combineEpics(userEpics);
