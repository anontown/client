import * as Im from "immutable";

export class Command<T> {
  constructor(private readonly history: Im.List<T>,
              private readonly index: number) {
  }

  public static fromValue<T>(val: T) {
    return new Command(Im.List<T>([val]), 0);
  }

  get value(): T {
    return this.history.get(this.index)!;
  }

  public undo() {
    if (this.index === 0) {
      return this;
    } else {
      return new Command(this.history, this.index - 1);
    }
  }

  public redo() {
    if (this.index === this.history.size - 1) {
      return this;
    } else {
      return new Command(this.history, this.index + 1);
    }
  }

  public change(val: T) {
    return new Command(this.history.slice(0, this.index + 1).toList().push(val), this.index + 1);
  }
}
