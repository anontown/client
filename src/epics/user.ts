import {
  ActionsObservable,
  combineEpics,
} from "redux-observable";
import { Observable } from "rxjs";
import { Actions } from "../actions";
import {
  storageAPI,
} from "../utils";

function updateUserData(action$: ActionsObservable<Actions>): Observable<Actions> {
  return action$
    .ofType("UPDATE_USER_DATA")
    .debounceTime(5000)
    .mergeMap(action => {
      const { data } = action;
      if (data !== null) {
        localStorage.setItem("token", JSON.stringify({
          id: data.token.id,
          key: data.token.key,
        }));
        return storageAPI
          .save(data.token, data.storage)
          .mergeMap(() => Observable.empty());
      } else {
        localStorage.removeItem("token");
        return Observable.empty();
      }
    });
}

export const userEpics = combineEpics(updateUserData);
