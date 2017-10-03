import { combineEpics } from 'redux-observable'
import { mdEditorEpics } from "./md-editor";

export const epics = combineEpics(mdEditorEpics);