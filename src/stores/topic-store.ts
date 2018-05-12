import * as api from "@anontown/api-types";
import * as Im from "immutable";
import { observable } from "mobx";
import { apiClient, resSetedCreate } from "../utils";
import { UserStore } from "./user-store";
import { ResSeted } from "../models";
import { ReplaySubject, Subject, Observable } from "rxjs";

export class TopicStateData {
  readonly limit = 50;

  reses: Im.List<ResSeted> = Im.List();
  autoScrollSpeed = 15;
  isAutoScroll = false;
  scrollNewItem = new ReplaySubject<string | null>(1);
  updateItem = new Subject<ResSeted>();
  newItem = Observable.empty<ResSeted>();
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
      .do(x => {
        this.topic = { ...this.topic, resCount: x.count };
        this.storageSaveDate(null);
      })
      .flatMap(x => resSetedCreate.resSet(user.data !== null ? user.data.token : null, [x.res]).then(reses => reses[0]));
  }

  static async create(topicID: string, user: UserStore, setMsg: (x: string) => void): Promise<TopicStateData | null> {
    try {
      return new TopicStateData(setMsg, user, await apiClient.findTopicOne({ id: topicID }));
    } catch {
      setMsg("トピック取得に失敗");
      return null;
    }
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
    this.user.setData({
      ...this.user.data,
      storage: {
        ...storage,
        topicRead: storage.topicRead.set(this.topic.id, {
          date,
          count: this.topic.resCount,
        }),
      },
    });
  }

  favo() {
    if (this.user.data === null) {
      return;
    }
    const storage = this.user.data.storage;
    const tf = storage.topicFavo;
    this.user.setData({
      ...this.user.data,
      storage: {
        ...storage,
        topicFavo: this.isFavo ? tf.delete(this.topic.id) : tf.add(this.topic.id),
      },
    });
  }

  get isFavo() {
    if (this.user.data === null) {
      return false;
    }

    return this.user.data.storage.topicFavo.has(this.topic.id);
  }

  async findNewItem() {
    const token = this.user.data !== null ? this.user.data.token : null;
    return Im.List(await resSetedCreate.resSet(token, await apiClient.findResNew(token, {
      topic: this.topic.id,
      limit: this.limit,
    })));
  }

  async findItem(type: "before" | "after", date: string, equal: boolean) {
    const token = this.user.data !== null ? this.user.data.token : null;
    return Im.List(await resSetedCreate.resSet(token, await apiClient.findRes(token, {
      topic: this.topic.id,
      type,
      equal,
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

  @observable msg: string | null = null;
  @observable data: TopicStateData | null = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    this.data = await TopicStateData.create(id, this.user, x => this.msg = x);
  }

  clearMsg() {
    this.msg = null;
  }
}