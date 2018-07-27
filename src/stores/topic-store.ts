import * as api from "@anontown/api-types";
import * as Im from "immutable";
import { observable } from "mobx";
import * as rx from "rxjs";
import * as op from "rxjs/operators";

import { ResSeted } from "../models";
import { apiClient, resSetedCreate } from "../utils";
import { UserStore } from "./user-store";

export class TopicStateData {
  static async create(topicID: string,
    user: UserStore,
    setMsg: (x: string) => void): Promise<TopicStateData | null> {
    try {
      return new TopicStateData(setMsg, user, await apiClient.findTopicOne({ id: topicID }));
    } catch {
      setMsg("トピック取得に失敗");
      return null;
    }
  }

  readonly limit = 50;

  @observable.ref reses: Im.List<ResSeted> = Im.List();
  @observable.ref autoScrollSpeed = 15;
  @observable.ref isAutoScroll = false;
  @observable.ref scrollNewItem = new rx.ReplaySubject<string | null>(1);
  @observable.ref updateItem = new rx.Subject<ResSeted>();
  @observable.ref newItem = rx.of<ResSeted>();

  private constructor(public setMsg: (x: string) => void,
    public user: UserStore,
    public topic: api.Topic) {
    this.storageSaveDate(null);

    if (user.data !== null) {
      const topicRead = user.data.storage.topicRead.get(topic.id);
      if (topicRead !== undefined) {
        this.scrollNewItem.next(topicRead.date);
      } else {
        this.scrollNewItem.next(null);
      }
    } else {
      this.scrollNewItem.next(null);
    }

    this.newItem = apiClient.streamUpdateTopic(user.data !== null ? user.data.token : null, {
      id: topic.id,
    })
      .pipe(
        op.tap(x => {
          this.topic = { ...this.topic, resCount: x.count };
          this.storageSaveDate(null);
        }),
        op.flatMap(x => resSetedCreate.resSet(user.data !== null
          ? user.data.token
          : null, [x.res])
        ),
        op.map(x => x[0])
      );
  }

  storageSaveDate(date: string | null) {
    if (this.user.data === null) {
      return;
    }
    const storage = this.user.data.storage;
    if (date === null) {
      const storageRes = storage.topicRead.get(this.topic.id);
      if (storageRes !== undefined) {
        date = storageRes.date;
      } else {
        const first = this.reses.first();
        if (first === undefined) {
          return;
        }
        date = first.date;
      }
    }
    const dateNonNull = date;
    this.user.setStorage({
      ...storage,
      topicRead: storage.topicRead.update(this.topic.id, x => ({
        ...x,
        date: dateNonNull,
        count: this.topic.resCount,
      })),
    });
  }

  favo() {
    if (this.user.data === null) {
      return;
    }
    const storage = this.user.data.storage;
    const tf = storage.topicFavo;
    this.user.setStorage({
      ...storage,
      topicFavo: this.isFavo ? tf.delete(this.topic.id) : tf.add(this.topic.id),
    });
  }

  get isFavo() {
    if (this.user.data === null) {
      return false;
    }

    return this.user.data.storage.topicFavo.has(this.topic.id);
  }

  async findItem(type: "gt" | "lt" | "gte" | "lte", date: string) {
    const token = this.user.data !== null ? this.user.data.token : null;
    return Im.List(await resSetedCreate.resSet(token, await apiClient.findRes(token, {
      query: {
        topic: this.topic.id,
      },
      type,
      date,
      limit: this.limit,
    })));
  }

  setIsAutoScroll(x: boolean) {
    this.isAutoScroll = x;
  }

  setAutoScrollSpeed(x: number) {
    this.autoScrollSpeed = x;
  }

  onChangeItems(x: Im.List<ResSeted>) {
    this.reses = x;
  }
}

export class TopicStore {

  @observable.ref msg: string | null = null;
  @observable data: TopicStateData | null = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    this.data = null;
    this.data = await TopicStateData.create(id, this.user, x => this.msg = x);
  }

  clearMsg() {
    this.msg = null;
  }
}
