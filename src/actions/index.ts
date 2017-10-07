import { MdEditorActions } from './md-editor';
export * from './md-editor';

import { ResWriteActions } from './res-write';
export * from './res-write';

import { ResActions } from "./res";
export * from './res';

export type Actions = MdEditorActions | ResWriteActions | ResActions;
