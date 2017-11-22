import * as Im from "immutable";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Observable,
  Subscription,
} from "rxjs";
import { list } from "../utils";
import { setTimeout } from "timers";

interface ListItemData {
  id: string;
  date: string;
}

interface ListItem<T extends ListItemData> {
  data: T;
  el: JSX.Element;
}

interface ItemScrollData<T extends ListItemData> {
  item: ListItem<T>;
  y: number;
  el: HTMLElementData;
}

export interface ScrollProps<T extends ListItemData> {
  items: Im.List<T>;
  onChangeItems: (items: Im.List<T>) => void;
  newItemOrder: "top" | "bottom";
  findNewItem: () => Observable<Im.List<T>>;
  findItem: (type: "before" | "after", date: string, equal: boolean) => Observable<Im.List<T>>;
  width: number;
  debounceTime: number;
  autoScrollSpeed: number;
  isAutoScroll: boolean;
  scrollNewItemChange: (item: T) => void;
  scrollNewItem: Observable<string | null>;
  updateItem: Observable<T>;
  newItem: Observable<T>;
  dataToEl: (data: T) => JSX.Element;
  style?: React.CSSProperties;
  className?:string;
}

interface ScrollState {
}

class HTMLElementData {
  constructor(public raw: HTMLElement) { }

  get height() {
    return this.raw.offsetHeight;
  }

  get top() {
    return this.raw.offsetTop;
  }

  get bottom() {
    return this.top + this.height;
  }

  get y() {
    return this.top + this.height / 2;
  }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export class Scroll<T extends ListItemData> extends React.Component<ScrollProps<T>, ScrollState> {
  subscriptions: Subscription[] = [];
  _isLock = false;

  constructor(props: ScrollProps<T>) {
    super(props);
  }

  getItemEl(id: string) {
    return new HTMLElementData(ReactDOM.findDOMNode(this.refs[`item-${id}`]) as HTMLElement);
  }

  get el() {
    return ReactDOM.findDOMNode(this.refs.list) as HTMLElement;
  }

  async toTop() {
    await sleep(0);
    this.el.scrollTop = 0;
  }

  async toBottom() {
    await sleep(0);
    this.el.scrollTop = this.el.scrollHeight;
  }

  dataToListItem(data: T): ListItem<T> {
    return {
      data,
      el: this.props.dataToEl(data),
    };
  }

  async setTopElement(item: ItemScrollData<T>) {
    await sleep(0);
    this.el.scrollTop += (item.el.raw.offsetTop + item.el.raw.offsetHeight / 2) - item.y;
  }

  async getTopElement() {
    sleep(0);
    // 最短距離のアイテム
    const minItem = this.props.items
      .map(item => ({ item: this.dataToListItem(item), el: this.getItemEl(item.id) }))
      .reduce<{
        item: ListItem<T>;
        el: HTMLElementData;
      } | null>((min, item) => {
        if (min === null) {
          return item;
        } else if (Math.abs(min.el.raw.getBoundingClientRect().top +
          min.el.raw.getBoundingClientRect().height / 2) >
          Math.abs(item.el.raw.getBoundingClientRect().top +
            item.el.raw.getBoundingClientRect().height / 2)) {
          return item;
        } else {
          return min;
        }
      }, null);

    if (minItem !== null) {
      return { ...minItem, y: minItem.el.raw.offsetTop + minItem.el.raw.offsetHeight / 2 };
    } else {
      return null;
    }
  }

  async setBottomElement(item: ItemScrollData<T>) {
    await sleep(0);
    this.el.scrollTop += (item.el.raw.offsetTop + item.el.raw.offsetHeight / 2) - item.y;
  }

  async getBottomElement() {
    await sleep(0);
    // 最短距離のアイテム
    const minItem = this.props.items
      .map(item => ({ item: this.dataToListItem(item), el: this.getItemEl(item.id) }))
      .reduce<{
        item: ListItem<T>;
        el: HTMLElementData;
      } | null>((min, item) => {
        if (min === null) {
          return item;
        } else if (Math.abs(window.innerHeight -
          (min.el.raw.getBoundingClientRect().top +
            min.el.raw.getBoundingClientRect().height / 2)) >
          Math.abs(window.innerHeight -
            (item.el.raw.getBoundingClientRect().top +
              item.el.raw.getBoundingClientRect().height / 2))) {
          return item;
        } else {
          return min;
        }
      }, null);

    if (minItem !== null) {
      return { ...minItem, y: minItem.el.raw.offsetTop + minItem.el.raw.offsetHeight / 2 };
    } else {
      return null;
    }
  }

  render() {
    return <div className={this.props.className} style={this.props.style} ref="list">
      {this.props.items
        .filter((x, i, self) => self.findIndex(y => x.id === y.id) === i)
        .sort((a, b) => this.props.newItemOrder === "top"
          ? new Date(b.date).valueOf() - new Date(a.date).valueOf()
          : new Date(a.date).valueOf() - new Date(b.date).valueOf())
        .map(item => <div
          key={item.id}
          ref={`item-${item.id}`}>{this.props.dataToEl(item)}</div>)}
    </div>;
  }

  componentDidMount() {
    this.subscriptions.push(Observable.fromEvent(this.el, "scroll")
      .map(() => this.el.scrollTop)
      .filter(top => top <= this.props.width)
      .debounceTime(this.props.debounceTime)
      .subscribe(() => {
        switch (this.props.newItemOrder) {
          case "top":
            this.findAfter();
            break;
          case "bottom":
            this.findBefore();
            break;
        }
      }));

    this.subscriptions.push(Observable.fromEvent(this.el, "scroll")
      .map(() => this.el.scrollTop + this.el.clientHeight)
      .filter(bottom => bottom >= this.el.scrollHeight - this.props.width)
      .debounceTime(this.props.debounceTime)
      .subscribe(() => {
        switch (this.props.newItemOrder) {
          case "bottom":
            this.findAfter();
            break;
          case "top":
            this.findBefore();
            break;
        }
      }));

    this.subscriptions.push(Observable.fromEvent(this.el, "scroll")
      .debounceTime(this.props.debounceTime)
      .mergeMap(() => this.props.newItemOrder === "top" ? this.getTopElement() : this.getBottomElement())
      .subscribe(newItem => {
        if (newItem !== null) {
          this.props.scrollNewItemChange(newItem.item.data);
        }
      }));

    this.subscriptions.push(Observable
      .interval(100)
      .subscribe(() => {
        if (this.props.isAutoScroll) {
          this.el.scrollTop += this.props.autoScrollSpeed;
        }
      }));

    this.subscriptions.push(this.props.scrollNewItem.subscribe(date => {
      if (date !== null) {
        this._lock(async () => {
          this.props.onChangeItems(await this.props.findItem("before", date, true).first().toPromise());
          switch (this.props.newItemOrder) {
            case "top":
              await this.toTop();
              break;
            case "bottom":
              await this.toBottom();
              break;
          }
        }).then(() => {
          this.findAfter();
        });
      } else {
        this.findNew();
      }
    }));
    this.subscriptions.push(this.props.updateItem.subscribe(item => {
      this.props.onChangeItems(list.update(this.props.items, item));
    }));
    this.subscriptions.push(this.props.newItem.subscribe(item => {
      this.props.onChangeItems(this.props.items.push(item));
    }));
  }

  componentWillUnmount() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  async _lock(call: () => Promise<void>) {
    if (this._isLock) {
      return;
    }

    this._isLock = true;
    try {
      await call();
    } catch (e) {
      console.error(e);
    }
    this._isLock = false;
  }

  findAfter() {
    const last = this.props.items.last();
    if (last === undefined) {
      this.findNew();
    } else {
      this._lock(async () => {
        let ise: {
          y: number;
          item: ListItem<T>;
          el: HTMLElementData;
        } | null = null;

        switch (this.props.newItemOrder) {
          case "bottom":
            ise = await this.getBottomElement();
            break;
          case "top":
            ise = await this.getTopElement();
            break;
        }

        if (ise === null) {
          return;
        }

        this.props.onChangeItems(this.props.items
          .concat(await this.props.findItem("after", last.date, false).first().toPromise()));

        switch (this.props.newItemOrder) {
          case "bottom":
            await this.setBottomElement(ise);
            break;
          case "top":
            await this.setTopElement(ise);
            break;
        }
      });
    }
  }

  findBefore() {
    const first = this.props.items.first();
    if (first === undefined) {
      this.findNew();
    } else {
      this._lock(async () => {
        let ise: {
          y: number;
          item: ListItem<T>;
          el: HTMLElementData;
        } | null = null;
        switch (this.props.newItemOrder) {
          case "bottom":
            ise = await this.getTopElement();
            break;
          case "top":
            ise = await this.getBottomElement();
            break;
        }

        if (ise === null) {
          return;
        }

        this.props.onChangeItems(this.props.items
          .concat(await this.props.findItem("before", first.date, false).first().toPromise()));
        switch (this.props.newItemOrder) {
          case "bottom":
            await this.setTopElement(ise);
            break;
          case "top":
            await this.setBottomElement(ise);
            break;
        }
      });
    }
  }

  findNew() {
    this._lock(async () => {
      this.props.onChangeItems(await this.props.findNewItem().first().toPromise());
      switch (this.props.newItemOrder) {
        case "bottom":
          await this.toBottom();
          break;
        case "top":
          await this.toTop();
          break;
      }
    });
  }
}
