import { Inc, Dec } from "./type";

export function inc(): Inc {
  return { type: 'INC' };
}

export function dec(): Dec {
  return { type: 'DEC' };
}