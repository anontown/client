import { connect } from 'react-redux'
import { Dispatch } from "redux";
import { MdEditor } from '../components'
import {
  MdEditorActions,
  mdEditorUploadImageRequest,
  mdEditorChange
} from '../actions'
import { Store } from "../reducers";
import * as React from "react";

export interface MdEditorContainerProps {
  preview?: boolean,
  maxRows?: number,
  minRows?: number,
  id: symbol
}

function mapStateToProps(state: Store, ownProps: MdEditorContainerProps): {
  preview?: boolean,
  maxRows?: number,
  minRows?: number,
  value: string,
  errors?: string[]
} {
  const editor = state.mdEditors.get(ownProps.id, null);
  if (editor !== null) {
    return {
      preview: ownProps.preview,
      maxRows: ownProps.maxRows,
      minRows: ownProps.minRows,
      value: editor.body,
      errors: editor.errors
    };
  } else {
    throw new Error();
  }

}

function mapDispatchToProps(dispatch: Dispatch<MdEditorActions>, ownProps: MdEditorContainerProps): {
  onUploadImage?: (data: Blob | FormData) => void;
  onChange?: (_e: React.FormEvent<{}>, newValue: string) => void;
} {
  return {
    onUploadImage: (data: Blob | FormData) => { dispatch(mdEditorUploadImageRequest(ownProps.id, data)) },
    onChange: (_e: React.FormEvent<{}>, newValue: string) => { dispatch(mdEditorChange(ownProps.id, newValue)) }
  }
}

export const MdEditorContainer = connect(mapStateToProps, mapDispatchToProps)(MdEditor);