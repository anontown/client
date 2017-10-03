import { Observable } from 'rxjs'

import { Store } from 'redux'
import { combineEpics } from 'redux-observable'
import { MdEditorStore } from "../reducers";
import {
  Actions,
  MdEditorUploadImageRequest,
  mdEditorUploadImageSuccess,
  mdEditorUploadImageFAIL
} from "../actions";
import { imgur } from "../utils";

function uploadImage(action$: Observable<Actions>, _store: Store<MdEditorStore>): Observable<Actions> {
  return action$
    .filter<Actions, MdEditorUploadImageRequest>((ac): ac is MdEditorUploadImageRequest => ac.type === "MD_EDITOR_UPLOAD_IMAGE_REQUEST")
    .mergeMap(ac => imgur.upload(ac.data)
      .map(url => ({ id: ac.id, url }))
      .map(data => mdEditorUploadImageSuccess(data.id, data.url))
      .catch(() => Observable.of(mdEditorUploadImageFAIL(ac.id, ['画像のアップロードに失敗しました'])))
    );
}

export const mdEditorEpics = combineEpics(uploadImage);