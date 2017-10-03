export interface MdEditorUploadImageRequest {
  type: 'MD_EDITOR_UPLOAD_IMAGE_REQUEST',
  id: symbol,
  data: Blob | FormData
}

export interface MdEditorUploadImageSuccess {
  type: 'MD_EDITOR_UPLOAD_IMAGE_SUCCESS'
  id: symbol,
  url: string
}

export interface MdEditorUploadImageFAIL {
  type: 'MD_EDITOR_UPLOAD_IMAGE_FAIL'
  id: symbol,
  errors: string[]
}

export interface MdEditorChange {
  type: 'MD_EDITOR_CHANGE'
  id: symbol,
  value: string
}

export type MdEditorActions = MdEditorUploadImageRequest |
  MdEditorUploadImageSuccess |
  MdEditorUploadImageFAIL |
  MdEditorChange;

export function mdEditorUploadImageRequest(id: symbol, data: Blob | FormData): MdEditorUploadImageRequest {
  return {
    type: 'MD_EDITOR_UPLOAD_IMAGE_REQUEST',
    id,
    data
  };
}

export function mdEditorUploadImageSuccess(id: symbol, url: string): MdEditorUploadImageSuccess {
  return {
    type: 'MD_EDITOR_UPLOAD_IMAGE_SUCCESS',
    id,
    url
  };
}

export function mdEditorUploadImageFAIL(id: symbol, errors: string[]): MdEditorUploadImageFAIL {
  return {
    type: 'MD_EDITOR_UPLOAD_IMAGE_FAIL',
    id,
    errors
  };
}

export function mdEditorChange(id: symbol, value: string): MdEditorChange {
  return {
    type: 'MD_EDITOR_CHANGE',
    id,
    value
  };
}