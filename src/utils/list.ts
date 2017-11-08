import * as Im from 'immutable';

export function update<T extends { id: string }>(list: Im.List<T>, item: T) {
  return list.set(list.findIndex(x => x.id === item.id), item);
}