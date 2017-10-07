import { Observable } from 'rxjs'

import { combineEpics } from 'redux-observable'
import { Store } from "../reducers";
import {
  Actions,
  ResWriteRequest,
  resWriteSuccess,
  resWriteFAIL,
  mdEditorChange
} from "../actions";
import { apiClient } from "../utils";
import { AtError } from "@anontown/api-client";

function resWrite(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return action$
    .filter<Actions, ResWriteRequest>((ac): ac is ResWriteRequest => ac.type === "RES_WRITE_REQUEST")
    .map(ac => {
      const resWrite = store.resWrite.get(ac.id, null);
      if (resWrite !== null) {
        const mdEditor = store.mdEditors.get(resWrite.mdEditorID, null);
        if (mdEditor !== null) {
          const user = store.user;
          if (user !== null) {
            return { ac, body: mdEditor.body, mdEditorID: resWrite.mdEditorID, token: user.token };
          }
        }
      }
      throw new Error();
    })
    .mergeMap(x => apiClient.createRes(x.token, {
      topic: x.ac.id.topic,
      name: x.ac.name,
      text: x.body,
      reply: x.ac.id.reply,
      profile: x.ac.profile,
      age: x.ac.age
    })
      .mergeMap(res => Observable.of<Actions>(resWriteSuccess(x.ac.id, res), mdEditorChange(x.mdEditorID, '')))
      .catch((err: AtError) => Observable.of(resWriteFAIL(x.ac.id, err.errors.map(x => x.message))))
    );
}

export const mdEditorEpics = combineEpics(resWrite);