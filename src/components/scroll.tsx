import * as React from "react";
import * as rx from "rxjs";
import * as op from "rxjs/operators";
import { setTimeout } from "timers";
import { useLock, queryResultConvert, useEffectCond, useEffectRef, useValueRef } from "../utils";
import { DocumentNode } from "graphql";
import { useQuery, useSubscription, OnSubscriptionDataOptions } from "react-apollo-hooks";
import * as G from "../../generated/graphql";
import { arrayFirst, arrayLast } from "@kgtkr/utils";

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

export interface ScrollProps<T extends ListItemData, QueryResult, QueryVariables, SubscriptionResult, SubscriptionVariables> {
  newItemOrder: "top" | "bottom";
  query: DocumentNode;
  queryVariables: (dateQuery: G.DateQuery) => QueryVariables;
  queryResultConverter: (result: QueryResult) => T[];
  queryResultMapper: (result: QueryResult, f: (data: T[]) => T[]) => QueryResult;
  subscription: DocumentNode;
  subscriptionVariables: SubscriptionVariables;
  subscriptionResultConverter: (result: SubscriptionResult) => T;
  onSubscription: (item: SubscriptionResult) => void;
  width: number;
  debounceTime: number;
  autoScrollSpeed: number;
  isAutoScroll: boolean;
  // スクロール位置変更イベント
  scrollNewItemChange: (item: T) => void;
  // スクロール位置変更命令
  scrollNewItem: rx.Observable<string>;
  initDate: string;
  dataToEl: (data: T) => JSX.Element;
  style?: React.CSSProperties;
  className?: string;
  changeItems: (items: T[]) => void;
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

export const Scroll = <T extends ListItemData, QueryResult, QueryVariables, SubscriptionResult, SubscriptionVariables>(props: ScrollProps<T, QueryResult, QueryVariables, SubscriptionResult, SubscriptionVariables>) => {
  const rootEl = React.useRef<HTMLDivElement | null>(null);

  const variables = props.queryVariables({
    date: props.initDate,
    type: "lte"
  });
  const data = useQuery<QueryResult, QueryVariables>(props.query, {
    variables: variables
  });
  queryResultConvert(data);

  useEffectCond(() => {
    resetDate(props.initDate);
  }, () => data.data !== null);

  React.useEffect(() => {
    if (data.data !== undefined) {
      props.changeItems(props.queryResultConverter(data.data));
    }
  }, [data.data]);

  const idElMap = React.useMemo(() => new Map<string, HTMLDivElement>(), []);
  React.useEffect(() => {
    if (data.data !== undefined) {
      const items = new Set(props.queryResultConverter(data.data).map(x => x.id));
      for (let id of idElMap.keys()) {
        if (!items.has(id)) {
          idElMap.delete(id);
        }
      }
    } else {
      idElMap.clear();
    }

  }, [data.data, idElMap]);

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

    if (data.data === undefined) {
      return null;
    }

    const items = props.queryResultConverter(data.data);

    // 最短距離のアイテム
    const minItem = items
      .map(item => {
        const el = idElMap.get(item.id);
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

    if (data.data === undefined) {
      return null;
    }

    const items = props.queryResultConverter(data.data);

    // 最短距離のアイテム
    const minItem = items
      .map(item => {
        const el = idElMap.get(item.id);
        if (el !== undefined) {
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

  const lock = useLock();

  const findAfter = async () => {
    if (data.data === undefined) {
      return;
    }

    const items = props.queryResultConverter(data.data);

    const first = arrayFirst(items);
    if (first === undefined) {
      await resetDate(new Date().toISOString());
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

        await data.fetchMore({
          variables: props.queryVariables({
            date: first.date,
            type: "gt"
          }),
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return props.queryResultMapper(prev, data => [...props.queryResultConverter(fetchMoreResult), ...data]);
          }
        });

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
    if (data.data === undefined) {
      return;
    }

    const items = props.queryResultConverter(data.data);

    const old = arrayLast(items);
    if (old === undefined) {
      await resetDate(new Date().toISOString());
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

        await data.fetchMore({
          variables: props.queryVariables({
            date: old.date,
            type: "lt"
          }),
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return props.queryResultMapper(prev, data => [...data, ...props.queryResultConverter(fetchMoreResult)]);
          }
        });

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

  const resetDate = async (date: string) => {
    await lock(async () => {
      await data.refetch(props.queryVariables({
        date: date,
        type: "lte"
      }));
      switch (props.newItemOrder) {
        case "bottom":
          await toBottom();
          break;
        case "top":
          await toTop();
          break;
      }
    });
    await findAfter();
  };

  useEffectRef(f => {
    const el = rootEl.current;
    const subs = el !== null
      ? rx.fromEvent(el, "scroll")
        .pipe(op.map(() => el.scrollTop),
          op.filter(top => top <= props.width),
          op.debounceTime(props.debounceTime))
        .subscribe(() => f.current()) :
      null;
    return () => {
      if (subs !== null) {
        subs.unsubscribe();
      }
    };
  }, () => {
    switch (props.newItemOrder) {
      case "top":
        findAfter();
        break;
      case "bottom":
        findBefore();
        break;
    }
  }, [rootEl.current, props.debounceTime]);

  useEffectRef(f => {
    const el = rootEl.current;
    const subs = el !== null
      ? rx.fromEvent(el, "scroll")
        .pipe(op.map(() => el.scrollTop + el.clientHeight),
          op.filter(bottom => bottom >= el.scrollHeight - props.width),
          op.debounceTime(props.debounceTime))
        .subscribe(() => f.current())
      : null;
    return () => {
      if (subs !== null) {
        subs.unsubscribe();
      }
    };
  }, () => {
    switch (props.newItemOrder) {
      case "bottom":
        findAfter();
        break;
      case "top":
        findBefore();
        break;
    }
  }, [rootEl.current, props.debounceTime]);

  useEffectRef(f => {
    const el = rootEl.current;
    const subs = el !== null
      ? rx.fromEvent(el, "scroll")
        .pipe(op.debounceTime(props.debounceTime),
          op.mergeMap(() => props.newItemOrder === "top" ? getTopElement() : getBottomElement())
        )
        .subscribe(x => f.current(x))
      : null;
    return () => {
      if (subs !== null) {
        subs.unsubscribe();
      }
    };
  }, (newItem: {
    y: number;
    item: ListItem<T>;
    el: HTMLDivElement;
  } | null) => {
      if (newItem !== null) {
        props.scrollNewItemChange(newItem.item.data);
      }
    }, [rootEl.current, props.debounceTime]);

  useEffectRef(f => {
    const subs = rx
      .interval(100)
      .subscribe(() => f.current());
    return () => {
      subs.unsubscribe();
    };
  }, () => {
    const el = rootEl.current;
    if (props.isAutoScroll && el !== null) {
      el.scrollTop += props.autoScrollSpeed;
    }
  }, []);
  // TODO: autoScrollSpeedとか配列に追加しないと正常に動かないかも

  useEffectRef(f => {
    const subs = props.scrollNewItem.subscribe(x => f.current(x));
    return () => {
      subs.unsubscribe();
    };
  }, (date: string) => {
    resetDate(date);
  }, [props.scrollNewItem]);


  const onSubscriptionDataRef = useValueRef(({ client, subscriptionData }: OnSubscriptionDataOptions<SubscriptionResult>) => {
    console.log(subscriptionData);
    if (subscriptionData.data !== undefined) {
      const subsData = props.subscriptionResultConverter(subscriptionData.data);
      const data = client.readQuery<QueryResult, QueryVariables>({ query: props.query, variables: variables });
      if (data !== null) {
        client.writeQuery({
          query: props.query,
          variables: variables,
          data: props.queryResultMapper(data, x => [subsData, ...x])
        });
      }
      props.onSubscription(subscriptionData.data);
    }
  });
  useSubscription<SubscriptionResult, SubscriptionVariables>(props.subscription, {
    variables: props.subscriptionVariables,
    onSubscriptionData: props => onSubscriptionDataRef.current(props)
  });

  return <div className={props.className} style={props.style} ref={rootEl}>
    {data.data !== undefined
      ? (props.newItemOrder === "bottom"
        ? [...props.queryResultConverter(data.data)].reverse()
        : props.queryResultConverter(data.data))
        .map(item => <div
          key={item.id}
          ref={el => {
            if (el !== null) {
              idElMap.set(item.id, el);
            }
          }}>{props.dataToEl(item)}</div>)
      : null}
    {data.loading ? "Loading" : null}
    {data.error !== undefined ? "エラーが発生しました" : null}
  </div>;
};