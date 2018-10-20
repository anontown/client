import * as React from "react";

export class ComponentExtra<P = {}, S = {}, SS = any> extends React.Component<P, S, SS>{
  readonly componentDidMountListener: (() => void)[] = [];

  readonly componentWillUnmountListener: (() => void)[] = [];

  readonly componentDidUpdateListener: ((prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS) => void)[] = [];

  addComponentDidMountListener(f: () => void) {
    this.componentDidMountListener.push(f);
  }

  componentDidMount() {
    this.componentDidMountListener.forEach(f => f());
  }

  addComponentWillUnmountListener(f: () => void) {
    this.componentWillUnmountListener.push(f);
  }

  componentWillUnmount() {
    this.componentWillUnmountListener.forEach(f => f());
  }

  addComponentDidUpdateListener(f: (prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS) => void) {
    this.componentDidUpdateListener.push(f);
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS) {
    this.componentDidUpdateListener.forEach(f => f(prevProps, prevState, snapshot));
  }
}