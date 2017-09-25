import { Observable } from 'rxjs'

import { Store } from 'redux'
import { combineEpics } from 'redux-observable'
import { Store as StoreType } from "../store";
import { Actions } from "../actions/type";

export function epic(action$: Observable<Actions>, store: Store<StoreType>): Observable<Actions> {

}

export const epics = combineEpics(epic);