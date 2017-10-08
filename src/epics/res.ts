import { Observable } from 'rxjs'

import { combineEpics } from 'redux-observable'
import { Store } from "../reducers";
import {
  Actions,
  ResActions,

  ResDeleteRequest,
  resDeleteSuccess,
  resDeleteFail,

  ResUVRequest,
  resUVSuccess,
  resUVFail,

  ResDVRequest,
  resDVSuccess,
  resDVFail,

  ResCVRequest,
  resCVSuccess,
  resCVFail,

  ResHashRequest,
  resHashSuccess,
  resHashFail,

  ResReplyRequest,
  resReplySuccess,
  resReplyFail,

  ResSendRequest,
  resSendSuccess,
  resSendFail
} from "../actions";
import { apiClient } from "../utils";
import { AtError } from "@anontown/api-client";
import { TokenMaster } from "@anontown/api-types";

function getResData(action: { id: symbol }, store: Store) {
  const resComp = store.res.get(action.id, null);
  if (resComp !== null) {
    const res = store.apiObject.reses.get(resComp.id, null);
    if (res !== null) {
      const user = store.user;
      if (user !== null) {
        return {
          id: action.id,
          res,
          token: user.token,
        };
      }
    }
  }
  throw new Error();
}

function resObs<TActionType extends ResActions, TAPIResult>(action$: Observable<Actions>,
  store: Store,
  actionFilter: (ac: Actions) => ac is TActionType,
  apiCall: (token: TokenMaster, res: string) => Observable<TAPIResult>,
  throwAction: (id: symbol, result: TAPIResult) => Actions,
  fail: (id: symbol, errors: string[]) => Actions): Observable<Actions> {
  return action$
    .filter<Actions, TActionType>(actionFilter)
    .map(ac => getResData(ac, store))
    .mergeMap(x => apiCall(x.token, x.res.id)
      .map(r => throwAction(x.id, r))
      .catch((err: AtError) => Observable.of(fail(x.id, err.errors.map(e => e.message))))
    );
}

function resDelete(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return resObs(action$,
    store,
    (ac): ac is ResDeleteRequest => ac.type === "RES_DELETE_REQUEST",
    (token, res) => apiClient.delRes(token, { id: res }),
    (id, res) => resDeleteSuccess(id, res),
    resDeleteFail
  );
}

function resUV(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return resObs(action$,
    store,
    (ac): ac is ResUVRequest => ac.type === "RES_UV_REQUEST",
    (token, res) => apiClient.uvRes(token, { id: res }),
    (id, res) => resUVSuccess(id, res),
    resUVFail
  );
}

function resDV(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return resObs(action$,
    store,
    (ac): ac is ResDVRequest => ac.type === "RES_DV_REQUEST",
    (token, res) => apiClient.dvRes(token, { id: res }),
    (id, res) => resDVSuccess(id, res),
    resDVFail
  );
}

function resCV(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return resObs(action$,
    store,
    (ac): ac is ResCVRequest => ac.type === "RES_CV_REQUEST",
    (token, res) => apiClient.cvRes(token, { id: res }),
    (id, res) => resCVSuccess(id, res),
    resCVFail
  );
}

function resHash(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return action$
    .filter<Actions, ResHashRequest>((ac): ac is ResHashRequest => ac.type === "RES_HASH_REQUEST")
    .map(ac => getResData(ac, store))
    .mergeMap(x => apiClient.findResHash(x.token, { topic: x.res.topic, hash: x.res.hash })
      .map(reses => resHashSuccess(x.id, reses))
      .catch((err: AtError) => Observable.of(resHashFail(x.id, err.errors.map(e => e.message))))
    );
}

function resReply(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return action$
    .filter<Actions, ResReplyRequest>((ac): ac is ResReplyRequest => ac.type === "RES_REPLY_REQUEST")
    .map(ac => getResData(ac, store))
    .mergeMap(x => apiClient.findResReply(x.token, { topic: x.res.topic, reply: x.res.id })
      .map(reses => resReplySuccess(x.id, reses))
      .catch((err: AtError) => Observable.of(resReplyFail(x.id, err.errors.map(e => e.message))))
    );

}

function resSend(action$: Observable<Actions>, store: Store): Observable<Actions> {
  return action$
    .filter<Actions, ResSendRequest>((ac): ac is ResSendRequest => ac.type === "RES_SEND_REQUEST")
    .map(ac => getResData(ac, store))
    .mergeMap(x => apiClient.findResOne(x.token, { id: x.res.id })
      .map(res => resSendSuccess(x.id, res))
      .catch((err: AtError) => Observable.of(resSendFail(x.id, err.errors.map(e => e.message))))
    );
}

export const mdEditorEpics = combineEpics(resDelete, resUV, resDV, resCV, resHash, resReply, resSend);