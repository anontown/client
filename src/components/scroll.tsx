import * as React from 'react';
import * as ReactDOM from "react-dom";
import {
  Observable,
  Subscription,
  Subject
} from "rxjs";

export interface ListItem {
  id: string,
  date: string,
  el: JSX.Element
}

interface ItemScrollData {
  item: ListItem;
  y: number;
  el: HTMLElementData,
}

export interface ScrollProps {
  items: ListItem[],
  onChangeItems: (items: ListItem[]) => void;
  newItemOrder: 'top' | 'bottom',
  findNewItem: () => Observable<ListItem[]>,
  findItem: (type: 'before' | 'after', date: string, equal: boolean) => Observable<ListItem[]>
  width: number;
  debounceTime: number;
  autoScrollSpeed: number;
  isAutoScroll: number;
  scrollNewItemChange: (item: ListItem) => void;
  scrollNewItem: Observable<ListItem | null>,
  updateItem: Observable<ListItem>,
  newItem: Observable<ListItem>,
}

export interface ScrollState {
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

export class Scroll extends React.Component<ScrollProps, ScrollState> {
  constructor(props: ScrollProps) {
    super(props);
  }

  getItemEl(id: string) {
    return new HTMLElementData(ReactDOM.findDOMNode(this.refs[`item-${id}`]) as HTMLElement);
  }

  get el() {
    return ReactDOM.findDOMNode(this.refs["list"]) as HTMLElement;
  }

  toTop() {
    return Observable
      .timer(0)
      .do(() => {
        this.el.scrollTop = 0;
      });
  }

  toBottom() {
    return Observable
      .timer(0)
      .do(() => {
        this.el.scrollTop = this.el.scrollHeight;
      });
  }

  setTopElement(item: ItemScrollData) {
    return Observable
      .timer(0)
      .do(() => {
        this.el.scrollTop += (item.el.raw.offsetTop + item.el.raw.offsetHeight / 2) - item.y;
      });
  }

  getTopElement() {
    return Observable
      .timer(0)
      .map(() => {
        //最短距離のアイテム
        let minItem = this.props.items
          .map(item => ({ item, el: this.getItemEl(item.id) }))
          .reduce<{
            item: ListItem;
            el: HTMLElementData;
          } | null>((min, item) => {
            if (min === null) {
              return item;
            } else if (Math.abs(min.el.raw.getBoundingClientRect().top + min.el.raw.getBoundingClientRect().height / 2) >
              Math.abs(item.el.raw.getBoundingClientRect().top + item.el.raw.getBoundingClientRect().height / 2)) {
              return item;
            } else {
              return min;
            }
          }, null);

        if (minItem !== null) {
          return { ...minItem, y: minItem.el.raw.offsetTop + minItem.el.raw.offsetHeight / 2 }
        } else {
          return null;
        }
      });
  }

  setBottomElement(item: ItemScrollData) {
    return Observable
      .timer(0)
      .do(() => {
        this.el.scrollTop += (item.el.raw.offsetTop + item.el.raw.offsetHeight / 2) - item.y;
      });
  }

  getBottomElement() {
    return Observable
      .timer(0)
      .map(() => {
        //最短距離のアイテム
        let minItem = this.props.items
          .map(item => ({ item, el: this.getItemEl(item.id) }))
          .reduce<{
            item: ListItem;
            el: HTMLElementData;
          } | null>((min, item) => {
            if (min === null) {
              return item;
            } else if (Math.abs(window.innerHeight - (min.el.raw.getBoundingClientRect().top + min.el.raw.getBoundingClientRect().height / 2)) >
              Math.abs(window.innerHeight - (item.el.raw.getBoundingClientRect().top + item.el.raw.getBoundingClientRect().height / 2))) {
              return item;
            } else {
              return min;
            }
          }, null);

        if (minItem !== null) {
          return { ...minItem, y: minItem.el.raw.offsetTop + minItem.el.raw.offsetHeight / 2 }
        } else {
          return null;
        }
      });
  }

  render() {
    return (
      <div ref="list">
        {this.props.items.map(item => <div ref={`item-${item.id}`}>{item.el}</div>)}
      </div>
    );
  }

  subscriptions: Subscription[] = [];

  componentDidMount() {
    this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
      .map(() => this.el.scrollTop)
      .filter(top => top <= this.props.width)
      .debounceTime(this.props.debounceTime)
      .subscribe(() => {
        switch (this.props.newItemOrder) {
          case 'top':
            this.findAfter();
            break;
          case 'bottom':
            this.findBefore();
            break;
        }
      }));

    this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
      .map(() => this.el.scrollTop + this.el.clientHeight)
      .filter(bottom => bottom >= this.el.scrollHeight - this.props.width)
      .debounceTime(this.props.debounceTime)
      .subscribe(() => {
        switch (this.props.newItemOrder) {
          case 'bottom':
            this.findAfter();
            break;
          case 'top':
            this.findBefore();
            break;
        }
      }));

    this.subscriptions.push(Observable.fromEvent(this.el, 'scroll')
      .debounceTime(this.props.debounceTime)
      .mergeMap(() => this.props.newItemOrder === 'top' ? this.getTopElement() : this.getBottomElement())
      .subscribe(newItem => {
        if (newItem !== null) {
          this.props.scrollNewItemChange(newItem.item);
        }
      }));

    this.subscriptions.push(Observable
      .interval(100)
      .subscribe(() => {
        if (this.props.isAutoScroll) {
          this.el.scrollTop += this.props.autoScrollSpeed;
        }
      }));
  }

  afterViewChecked = new Subject<void>();
  componentDidUpdate() {
    this.afterViewChecked.next();
  }

  componentWillUnmount() {
    this.subscriptions.forEach(x => x.unsubscribe());
    this.afterViewChecked.complete();
  }

  _isLock = false;
  async _lock(call: () => Observable<void>) {
    if (this._isLock) {
      return;
    }

    this._isLock = true;
    call()
      .subscribe(undefined,
      e => {
        console.log(e)
        this._isLock = false;
      },
      () => {
        this._isLock = false;
      });
  }

  findAfter() {
    if (this.props.items.length === 0) {
      this.findNew();
    } else {
      this._lock(() => Observable.fromPromise((async () => {
        let ise: {
          y: number;
          item: ListItem;
          el: HTMLElementData;
        } | null = null;

        switch (this.props.newItemOrder) {
          case 'bottom':
            ise = await this.getBottomElement().toPromise();
            break;
          case 'top':
            ise = await this.getTopElement().toPromise();
            break;
        }

        if (ise === null) {
          return;
        }

        this.props.onChangeItems(this.props.items
          .concat(await this.props.findItem('after', this.props.items[this.props.items.length - 1].date, false).toPromise()));

        await this.afterViewChecked.first().toPromise();

        switch (this.props.newItemOrder) {
          case 'bottom':
            await this.setBottomElement(ise);
            break;
          case 'top':
            await this.setTopElement(ise);
            break;
        }
      })()));
    }
  }

  findBefore() {
    if (this.props.items.length === 0) {
      this.findNew();
    } else {
      this._lock(() => Observable.fromPromise((async () => {
        let ise: {
          y: number;
          item: ListItem;
          el: HTMLElementData;
        } | null = null;
        switch (this.props.newItemOrder) {
          case 'bottom':
            ise = await this.getTopElement().toPromise();
            break;
          case 'top':
            ise = await this.getBottomElement().toPromise();
            break;
        }

        if (ise === null) {
          return;
        }

        this.props.onChangeItems(this.props.items
          .concat(await this.props.findItem('before', this.props.items[0].date, false).toPromise()));

        await this.afterViewChecked.first().toPromise();

        switch (this.props.newItemOrder) {
          case 'bottom':
            await this.setTopElement(ise).toPromise();
            break;
          case 'top':
            await this.setBottomElement(ise).toPromise();
            break;
        }
      })()));
    }
  }

  findNew() {
    this._lock(() => Observable.fromPromise((async () => {
      this.props.onChangeItems(await this.props.findNewItem().toPromise());

      await this.afterViewChecked.first().toPromise();

      switch (this.props.newItemOrder) {
        case 'bottom':
          await this.toBottom().toPromise();
          break;
        case 'top':
          await this.toTop().toPromise();
          break;
      }
    })()));
  }
}