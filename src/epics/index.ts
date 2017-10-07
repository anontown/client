import { combineEpics } from 'redux-observable'
import { mdEditorEpics } from "./md-editor";
import { resEpics } from "./res";


export const epics = combineEpics(mdEditorEpics, mdEditorEpics, resEpics);