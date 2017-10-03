import { connect } from 'react-redux'
import { Dispatch } from "redux";
import { MdEditor } from '../components/md-editor'
import {
  MdEditorActions,
  mdEditorUploadImageRequest,
  mdEditorChange
} from '../actions'
import { Store } from "../reducers";
import * as React from "react";

export interface Props {
  id: symbol,
  preview?: boolean,
  maxRows?: number,
  minRows?: number,
}

function mapStateToProps(state: Store, ownProps: Props): Props & { value: string, errors?: string[] } {
  return {
    ...ownProps,
    value: state.mdEditors.get(ownProps.id).body,
    errors: state.mdEditors.get(ownProps.id).errors
  };
}

function mapDispatchToProps(dispatch: Dispatch<MdEditorActions>, ownProps: Props): {
  onUploadImage?: (data: Blob | FormData) => void;
  onChange?: (_e: React.FormEvent<{}>, newValue: string) => void;
} {
  return {
    onUploadImage: (data: Blob | FormData) => { dispatch(mdEditorUploadImageRequest(ownProps.id, data)) },
    onChange: (_e: React.FormEvent<{}>, newValue: string) => { dispatch(mdEditorChange(ownProps.id, newValue)) }
  }
}


export const MdEditorContainer = connect(mapStateToProps, mapDispatchToProps)(MdEditor);