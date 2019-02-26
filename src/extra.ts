interface Array<T> {
  first(): T | undefined;
  last(): T | undefined;
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