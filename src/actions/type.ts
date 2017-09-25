export interface Inc {
  type: 'INC'
}

export interface Dec {
  type: 'DEC'
}

export type Actions = Inc | Dec;