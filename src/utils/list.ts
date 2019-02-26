export function update<T extends { id: string }>(list: T[], item: T) {
  const index = list.findIndex(x => x.id === item.id);
  if (index !== -1) {
    return list.set(index, item);
  } else {
    return list;
  }
}
