export * from "./user-store";
export * from "./topic-search-store";

import { inject } from "mobx-react";
import * as React from "react";
import { ObjectOmit } from "typelevel-ts";
import { UserStore } from "./user-store";
import { TopicSearchStore } from "./topic-search-store";

export const stores = {
  user: new UserStore(),
  topicSearch: new TopicSearchStore()
};

export type Stores = typeof stores;

export const myInject =
  (<P, N extends keyof Stores>(names: N[], c: React.ComponentType<P>) =>
    inject(...names)(c) as any as React.ComponentType<ObjectOmit<P, N>>);
