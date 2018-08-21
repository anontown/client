export * from "./user-store";
export * from "./topic-search-store";
export * from "./profiles-store";
export * from "./res-store";
export * from "./topic-fork-store";
export * from "./notifications-store";
export * from "./res-reply-store";
export * from "./topic-store";

import { inject } from "mobx-react";
import * as React from "react";
import { Omit } from "type-zoo";
import { NotificationsStore } from "./notifications-store";
import { ProfilesStore } from "./profiles-store";
import { ResReplyStore } from "./res-reply-store";
import { ResStore } from "./res-store";
import { TopicForkStore } from "./topic-fork-store";
import { TopicSearchStore } from "./topic-search-store";
import { TopicStore } from "./topic-store";
import { UserStore } from "./user-store";

const userStore = new UserStore();

export const stores = {
  user: userStore,
  topicSearch: new TopicSearchStore(),
  profiles: new ProfilesStore(userStore),
  res: new ResStore(userStore),
  topicFork: new TopicForkStore(),
  notifications: new NotificationsStore(userStore),
  resReply: new ResReplyStore(userStore),
  topic: new TopicStore(userStore),
};

export type Stores = typeof stores;

export const myInject =
  (<P, N extends keyof Stores>(names: N[], c: React.ComponentType<P>) =>
    inject(...names)(c) as any as React.ComponentType<Omit<P, N>>);
