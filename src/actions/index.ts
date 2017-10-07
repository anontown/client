import { MdEditorActions } from './md-editor';
export * from './md-editor';

import { ResWriteActions } from './res-write';
export * from './res-write';

export type Actions = MdEditorActions | ResWriteActions;
