import * as Im from "immutable";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Observable,
  Subscription,
} from "rxjs";
import { setTimeout } from "timers";
import { list } from "../utils";

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
  findItem: (type: "gt" | "lt" | "gte" | "lte", date: string) => Promise<Im.List<T>>;
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
  className?: string;
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
  newItemSubs: Subscription | null = null;
  scrollNewItemSubs: Subscription | null = null;
  updateItemSubs: Subscription | null = null;
  _isLock = false;

  constructor(props: ScrollProps<T>) {
    super(props);
  }

  getItemEl(id: string) {
    const dom = ReactDOM.findDOMNode(this.refs[`item-${id}`]) as HTMLElement | null;
    if (dom !== null) {
      return new HTMLElementData(dom);
    } else {
      return null;
    }
  }

  get el() {
    return ReactDOM.findDOMNode(this.refs.list) as HTMLElement | null;
  }

  async toTop() {
    await sleep(0);
    const el = this.el;
    if (el !== null) {
      el.scrollTop = 0;
    }
  }

  async toBottom() {
    await sleep(0);
    const el = this.el;
    if (el !== null) {
      el.scrollTop = el.scrollHeight;
    }
  }

  onChangeItems(items: Im.List<T>) {
    this.props.onChangeItems(items
      .filter((x, i, self) => self.findIndex(y => x.id === y.id) === i)
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()));
  }

  dataToListItem(data: T): ListItem<T> {
    return {
      data,
      el: this.props.dataToEl(data),
    };
  }

  async setTopElement(item: ItemScrollData<T>) {
    await sleep(0);
    const el = this.el;
    if (el !== null) {
      el.scrollTop += (item.el.raw.offsetTop + item.el.raw.offsetHeight / 2) - item.y;
    }
  }

  async getTopElement() {
    await sleep(0);
    // 最短距離のアイテム
    const minItem = this.props.items
      .map(item => {
        const el = this.getItemEl(item.id);
        if (el !== null) {
          return ({ item: this.dataToListItem(item), el });
        } else {
          return null;
        }
      })
      .filter<{
        item: ListItem<T>,
        el: HTMLElementData,
      }>((x): x is {
        item: ListItem<T>;
        el: HTMLElementData;
      } => x !== null)
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
    const el = this.el;
    if (el !== null) {
      el.scrollTop += (item.el.raw.offsetTop + item.el.raw.offsetHeight / 2) - item.y;
    }
  }

  async getBottomElement() {
    await sleep(0);
    // 最短距離のアイテム
    const minItem = this.props.items
      .map(item => {
        const el = this.getItemEl(item.id);
        if (el !== null) {
          return ({ item: this.dataToListItem(item), el });
        } else {
          return null;
        }
      })
      .filter<{
        item: ListItem<T>,
        el: HTMLElementData,
      }>((x): x is {
        item: ListItem<T>,
        el: HTMLElementData,
      } => x !== null)
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
      {(this.props.newItemOrder === "top"
        ? this.props.items.reverse()
        : this.props.items)
        .map(item => <div
          key={item.id}
          ref={`item-${item.id}`}>{this.props.dataToEl(item)}</div>)}
    </div>;
  }

  componentDidMount() {
    this.subscriptions.push(Observable.fromEvent(this.el!, "scroll")
      .map(() => this.el!.scrollTop)
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

    this.subscriptions.push(Observable.fromEvent(this.el!, "scroll")
      .map(() => this.el!.scrollTop + this.el!.clientHeight)
      .filter(bottom => bottom >= this.el!.scrollHeight - this.props.width)
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

    this.subscriptions.push(Observable.fromEvent(this.el!, "scroll")
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
        const el = this.el;
        if (this.props.isAutoScroll && el !== null) {
          el.scrollTop += this.props.autoScrollSpeed;
        }
      }));

    this.subscribeScrollNewItem(this.props.scrollNewItem);
    this.subscribeUpdateItem(this.props.updateItem);
    this.subscribeNewItem(this.props.newItem);
  }

  componentWillUnmount() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  subscribeScrollNewItem(obs: Observable<string | null>) {
    this.scrollNewItemSubs = obs.subscribe(date => {
      if (date !== null) {
        this._lock(async () => {
          this.onChangeItems(await this.props.findItem("lte", date));
          switch (this.props.newItemOrder) {
            case "top":
              await this.toTop();
              break;
            case "bottom":
              await this.toBottom();
              break;
          }
        }).then(() => this.findAfter());
      } else {
        this.findNew();
      }
    });
  }

  subscribeNewItem(obs: Observable<T>) {
    this.newItemSubs = obs.subscribe(item => {
      this.onChangeItems(this.props.items.push(item));
    });
  }

  subscribeUpdateItem(obs: Observable<T>) {
    this.updateItemSubs = obs.subscribe(item => {
      this.onChangeItems(list.update(this.props.items, item));
    });
  }

  componentWillReceiveProps(nextProps: ScrollProps<T>) {
    if (this.props.newItem !== nextProps.newItem) {
      if (this.newItemSubs !== null) {
        this.newItemSubs.unsubscribe();
      }
      this.subscribeNewItem(nextProps.newItem);
    }

    if (this.props.scrollNewItem !== nextProps.scrollNewItem) {
      if (this.scrollNewItemSubs !== null) {
        this.scrollNewItemSubs.unsubscribe();
      }
      this.subscribeScrollNewItem(nextProps.scrollNewItem);
    }

    if (this.props.updateItem !== nextProps.updateItem) {
      if (this.updateItemSubs !== null) {
        this.updateItemSubs.unsubscribe();
      }
      this.subscribeUpdateItem(nextProps.updateItem);
    }
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

  async findAfter() {
    const last = this.props.items.last();
    if (last === undefined) {
      this.findNew();
    } else {
      await this._lock(async () => {
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

        this.onChangeItems(this.props.items
          .concat(await this.props.findItem("gt", last.date)));

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

  async findBefore() {
    const first = this.props.items.first();
    if (first === undefined) {
      await this.findNew();
    } else {
      await this._lock(async () => {
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

        this.onChangeItems(this.props.items
          .concat(await this.props.findItem("lt", first.date)));
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

  async findNew() {
    await this._lock(async () => {
      this.onChangeItems(await this.props.findItem("lte", new Date().toISOString()));
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
