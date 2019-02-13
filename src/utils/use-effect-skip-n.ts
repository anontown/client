import * as React from "react";

export function useEffectSkipN(effect: React.EffectCallback, deps?: React.DependencyList, n = 1) {
  const countRef = React.useRef(0);

  React.useEffect(() => {
    if (countRef.current >= n) {
      effect();
    } else {
      countRef.current++;
    }
  }, deps);
}