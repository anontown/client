import * as Im from 'immutable';
import { Actions } from "../actions";

export type MdEditorStore = Im.Map<symbol, {
  body: string;
  errors?: string[],
  isUploading: boolean
}>;

const initState: MdEditorStore = Im.Map();

export function mdEditorReducer(state = initState, action: Actions): MdEditorStore {
  switch (action.type) {
    case 'MD_EDITOR_UPLOAD_IMAGE_REQUEST':
      return state.update(action.id, editor => ({
        ...editor,
        isUploading: true
      }));
    case 'MD_EDITOR_UPLOAD_IMAGE_SUCCESS':
      return state.update(action.id, editor => ({
        ...editor,
        body: editor.body + `![](${action.url})`,
        isUploading: false,
        errors: []
      }));
    case 'MD_EDITOR_UPLOAD_IMAGE_FAIL':
      return state.update(action.id, editor => ({
        ...editor,
        isUploading: false,
        errors: action.errors
      }));
    case 'MD_EDITOR_CHANGE':
      return state.update(action.id, editor => ({
        ...editor,
        body: action.value
      }));
    default:
      return state
  }
}