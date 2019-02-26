interface Array<T> {
  first(): T | undefined;
  last(): T | undefined;
  set(i: number, item: T): T[];
}

Array.prototype.first = function () {
  if (this.length === 0) {
    return undefined;
  } else {
    return this[0];
  }
};

Array.prototype.last = function () {
  if (this.length === 0) {
    return undefined;
  } else {
    return this[this.length - 1];
  }
};

Array.prototype.set = function (i, item) {
  const res = [...this];
  res[i] = item;
  return res;
};