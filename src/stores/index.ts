export * from "./user-store";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { UserStore } from "./user-store";

export const stores = {
  user: new UserStore(),
};

export type Stores = typeof stores;

export const appInject: <P>(c: React.ComponentType<P>) => React.ComponentType<ObjectOmit<P, keyof Stores>>
  = ((c: any) => inject((s: Stores) => s)(observer(c))) as any;
