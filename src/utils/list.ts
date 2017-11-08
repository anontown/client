import * as Im from 'immutable';

export function update<T extends { id: string }>(list: Im.List<T>, item: T) {
  const index = list.findIndex(x => x.id === item.id);
  if (index !== -1) {
    list.set(index, item);
  } else {
    list;
  }
}