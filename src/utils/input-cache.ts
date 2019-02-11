import * as React from "react";
import * as rx from "rxjs";
import * as op from "rxjs/operators";


export function useInputCache<T>(init: T, update: (x: T) => void, dueTime = 1000): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [subject] = React.useState(new rx.Subject<T>());
  const [cache, setCache] = React.useState(init);

  React.useEffect(() => {
    subject.next(cache);
  }, [subject, cache]);

  React.useEffect(() => {
    const subs = subject
      .pipe(op.debounceTime(dueTime))
      .subscribe(update);

    return () => {
      subs.unsubscribe();
    };
  }, [subject]);

  return [cache, setCache];
}