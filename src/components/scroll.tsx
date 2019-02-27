import * as React from "react";
import * as rx from "rxjs";
import * as op from "rxjs/operators";
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
  el: HTMLElement;
}

export interface ScrollProps<T extends ListItemData> {
  items: T[];
  onChangeItems: (items: T[]) => void;
  newItemOrder: "top" | "bottom";
  findItem: (type: "gt" | "lt" | "gte" | "lte", date: string) => Promise<T[]>;
  width: number;
  debounceTime: number;
  autoScrollSpeed: number;
  isAutoScroll: boolean;
  scrollNewItemChange: (item: T) => void;
  scrollNewItem: rx.Observable<string | null>;
  updateItem: rx.Observable<T>;
  newItem: rx.Observable<T>;
  dataToEl: (data: T) => JSX.Element;
  style?: React.CSSProperties;
  className?: string;
}

function elHeight(el: HTMLElement) {
  return el.offsetHeight;
}

function elTop(el: HTMLElement) {
  return el.offsetTop;
}

function elY(el: HTMLElement) {
  return elTop(el) + elHeight(el) / 2;
}

function sleep(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export const Scroll = <T extends ListItemData>(props: ScrollProps<T>) => {
  const isLock = React.useRef(false);
  const rootEl = React.useRef<HTMLDivElement | null>(null);
  const idElMap = React.useRef(new Map<string, HTMLDivElement>());
  React.useEffect(() => {
    const items = new Set(props.items.map(x => x.id));
    for (let id of idElMap.current.keys()) {
      if (!items.has(id)) {
        idElMap.current.delete(id);
      }
    }
  }, [props.items, idElMap]);

  const toTop = async () => {
    await sleep(0);
    if (rootEl.current !== null) {
      rootEl.current.scrollTop = 0;
    }
  };

  const toBottom = async () => {
    await sleep(0);
    if (rootEl.current !== null) {
      rootEl.current.scrollTop = rootEl.current.scrollHeight;
    }
  };

  const onChangeItems = (items: T[]) => {
    props.onChangeItems(items
      .filter((x, i, self) => self.findIndex(y => x.id === y.id) === i)
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()));
  };

  const dataToListItem = (data: T): ListItem<T> => {
    return {
      data,
      el: props.dataToEl(data),
    };
  };

  const setTopElement = async (item: ItemScrollData<T>) => {
    await sleep(0);
    if (rootEl.current !== null) {
      rootEl.current.scrollTop += elY(item.el) - item.y;
    }
  };

  const getTopElement = async () => {
    await sleep(0);
    // 最短距離のアイテム
    const minItem = props.items
      .map(item => {
        const el = idElMap.current.get(item.id);
        if (el !== undefined) {
          return ({ item: dataToListItem(item), el });
        } else {
          return null;
        }
      }).filter((x): x is {
        item: ListItem<T>;
        el: HTMLDivElement;
      } => x !== null)
      .reduce<{
        item: ListItem<T>;
        el: HTMLDivElement;
      } | null>((min, item) => {
        if (min === null) {
          return item;
        } else if (Math.abs(min.el.getBoundingClientRect().top +
          min.el.getBoundingClientRect().height / 2) >
          Math.abs(item.el.getBoundingClientRect().top +
            item.el.getBoundingClientRect().height / 2)) {
          return item;
        } else {
          return min;
        }
      }, null);

    if (minItem !== null) {
      return { ...minItem, y: elY(minItem.el) };
    } else {
      return null;
    }
  };

  const setBottomElement = async (item: ItemScrollData<T>) => {
    await sleep(0);
    if (rootEl.current !== null) {
      rootEl.current.scrollTop += elY(item.el) - item.y;
    }
  };

  const getBottomElement = async () => {
    await sleep(0);
    // 最短距離のアイテム
    const minItem = props.items
      .map(item => {
        const el = idElMap.current.get(item.id);
        if (el !== null) {
          return ({ item: dataToListItem(item), el });
        } else {
          return null;
        }
      })
      .filter((x): x is {
        item: ListItem<T>,
        el: HTMLDivElement,
      } => x !== null)
      .reduce<{
        item: ListItem<T>;
        el: HTMLDivElement;
      } | null>((min, item) => {
        if (min === null) {
          return item;
        } else if (Math.abs(window.innerHeight -
          (min.el.getBoundingClientRect().top +
            min.el.getBoundingClientRect().height / 2)) >
          Math.abs(window.innerHeight -
            (item.el.getBoundingClientRect().top +
              item.el.getBoundingClientRect().height / 2))) {
          return item;
        } else {
          return min;
        }
      }, null);

    if (minItem !== null) {
      return { ...minItem, y: elY(minItem.el) };
    } else {
      return null;
    }
  };

  const lock = async (call: () => Promise<void>) => {
    if (isLock.current) {
      return;
    }

    isLock.current = true;
    try {
      await call();
    } catch (e) {
      throw e;
    } finally {
      isLock.current = false;
    }
  };

  const findAfter = async () => {
    const last = props.items.last();
    if (last === undefined) {
      findNew();
    } else {
      await lock(async () => {
        let ise: {
          y: number;
          item: ListItem<T>;
          el: HTMLElement;
        } | null = null;

        switch (props.newItemOrder) {
          case "bottom":
            ise = await getBottomElement();
            break;
          case "top":
            ise = await getTopElement();
            break;
        }

        if (ise === null) {
          return;
        }

        onChangeItems(props.items
          .concat(await props.findItem("gt", last.date)));

        switch (props.newItemOrder) {
          case "bottom":
            await setBottomElement(ise);
            break;
          case "top":
            await setTopElement(ise);
            break;
        }
      });
    }
  };

  const findBefore = async () => {
    const first = props.items.first();
    if (first === undefined) {
      await findNew();
    } else {
      await lock(async () => {
        let ise: {
          y: number;
          item: ListItem<T>;
          el: HTMLElement;
        } | null = null;
        switch (props.newItemOrder) {
          case "bottom":
            ise = await getTopElement();
            break;
          case "top":
            ise = await getBottomElement();
            break;
        }

        if (ise === null) {
          return;
        }

        onChangeItems(props.items
          .concat(await props.findItem("lt", first.date)));
        switch (props.newItemOrder) {
          case "bottom":
            await setTopElement(ise);
            break;
          case "top":
            await setBottomElement(ise);
            break;
        }
      });
    }
  };

  const findNew = async () => {
    await lock(async () => {
      onChangeItems(await props.findItem("lte", new Date().toISOString()));
      switch (props.newItemOrder) {
        case "bottom":
          await toBottom();
          break;
        case "top":
          await toTop();
          break;
      }
    });
  };

  React.useEffect(() => {
    const el = rootEl.current;
    const subs = el !== null
      ? rx.fromEvent(el, "scroll")
        .pipe(op.map(() => el.scrollTop),
          op.filter(top => top <= props.width),
          op.debounceTime(props.debounceTime))
        .subscribe(() => {
          switch (props.newItemOrder) {
            case "top":
              findAfter();
              break;
            case "bottom":
              findBefore();
              break;
          }
        }) :
      null;
    return () => {
      if (subs !== null) {
        subs.unsubscribe();
      }
    };
  }, [rootEl.current, props.debounceTime]);

  React.useEffect(() => {
    const el = rootEl.current;
    const subs = el !== null
      ? rx.fromEvent(el, "scroll")
        .pipe(op.map(() => el.scrollTop + el.clientHeight),
          op.filter(bottom => bottom >= el.scrollHeight - props.width),
          op.debounceTime(props.debounceTime))
        .subscribe(() => {
          switch (props.newItemOrder) {
            case "bottom":
              findAfter();
              break;
            case "top":
              findBefore();
              break;
          }
        })
      : null;
    return () => {
      if (subs !== null) {
        subs.unsubscribe();
      }
    };
  }, [rootEl.current, props.debounceTime]);

  React.useEffect(() => {
    const el = rootEl.current;
    const subs = el !== null
      ? rx.fromEvent(el, "scroll")
        .pipe(op.debounceTime(props.debounceTime),
          op.mergeMap(() => props.newItemOrder === "top" ? getTopElement() : getBottomElement())
        )
        .subscribe(newItem => {
          if (newItem !== null) {
            props.scrollNewItemChange(newItem.item.data);
          }
        })
      : null;
    return () => {
      if (subs !== null) {
        subs.unsubscribe();
      }
    };
  }, [rootEl.current, props.debounceTime]);

  React.useEffect(() => {
    const subs = rx
      .interval(100)
      .subscribe(() => {
        const el = rootEl.current;
        if (props.isAutoScroll && el !== null) {
          el.scrollTop += props.autoScrollSpeed;
        }
      });
    return () => {
      subs.unsubscribe();
    };
  }, []);
  // TODO: autoScrollSpeedとか配列に追加しないと正常に動かないかも

  React.useEffect(() => {
    const subs = props.scrollNewItem.subscribe(date => {
      if (date !== null) {
        lock(async () => {
          onChangeItems(await props.findItem("lte", date));
          switch (props.newItemOrder) {
            case "top":
              await toTop();
              break;
            case "bottom":
              await toBottom();
              break;
          }
        }).then(() => findAfter());
      } else {
        findNew();
      }
    });
    return () => {
      subs.unsubscribe();
    };
  }, [props.scrollNewItem]);

  React.useEffect(() => {
    const subs = props.updateItem.subscribe(item => {
      onChangeItems(list.update(props.items, item));
    });
    return () => {
      subs.unsubscribe();
    };
  }, [props.updateItem]);

  React.useEffect(() => {
    const subs = props.newItem.subscribe(item => {
      onChangeItems([...props.items, item]);
    });
    return () => {
      subs.unsubscribe();
    };
  }, [props.newItem]);

  return <div className={props.className} style={props.style} ref={rootEl}>
    {(props.newItemOrder === "top"
      ? props.items.reverse()
      : props.items)
      .map(item => <div
        key={item.id}
        ref={el => {
          if (el !== null) {
            idElMap.current.set(item.id, el);
          }
        }}>{props.dataToEl(item)}</div>)}
  </div>;
};