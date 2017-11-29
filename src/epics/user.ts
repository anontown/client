import {
  combineEpics,
  ActionsObservable
} from 'redux-observable'
import { Actions } from "../actions";
import { Store } from "../reducers";
import { Observable } from 'rxjs';
import {
  storageAPI
} from "../utils";

function updateUserData(action$: ActionsObservable<Actions>): Observable<Actions> {
  return action$
    .ofType("UPDATE_USER_DATA")
    .debounceTime(5000)
    .mergeMap(action => {
      let { data } = action;
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