export * from './user-store';
import { UserStore } from "./user-store";
import { inject } from 'mobx-react';
import { ObjectOmit } from "typelevel-ts";
import * as React from "react";

export const stores = {
  user: new UserStore(),
};

export type Stores = typeof stores;

export const appInject:<P>(c:React.ComponentType<P>)=>React.ComponentType<ObjectOmit<P,keyof Stores>> 
= inject((s: Stores) => s) as any;