import * as api from "@anontown/api-types";
import * as Im from "immutable";
import { computed, observable } from "mobx";
import { apiClient } from "../utils";

export class TopicSearchStore {
  @observable.ref msg: null | string = null;
  @observable.ref topics: Im.List<api.Topic> = Im.List();
  @observable.ref tags: string[] = [];
  @observable.ref title = "";
  @observable.ref dead = false;
  @observable.ref count = 0;
  @observable.ref page = 0;

  readonly limit = 100;

  async search(tags: string[], title: string, dead: boolean) {
    this.tags = tags;
    this.title = title;
    this.dead = dead;

    this.update();
  }

  async update() {
    this.topics = Im.List();
    this.count = 0;
    this.page = 0;
    this.msg = null;

    this.more();
  }

  async more() {
    try {
      const topics = await apiClient.findTopic({
        title: this.title,
        tags: this.tags,
        skip: this.page * this.limit,
        limit: this.limit,
        activeOnly: !this.dead,
      });

      this.count = topics.length;
      this.topics = this.topics.concat(topics);
      this.page++;
    } catch {
      this.msg = "トピック取得に失敗しました。";
    }
  }

  clearMsg() {
    this.msg = null;
  }

  @computed get isMore() {
    return this.count === this.limit;
  }
}
