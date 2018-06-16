import * as api from "@anontown/api-types";
import { observable } from "mobx";
import {
  apiClient,
} from "../utils";

export class TopicDataStore {
  @observable.ref topic: api.Topic | null = null;
  @observable.ref msg: null | string = null;

  async load(id: string) {
    if (this.topic === null || this.topic.id !== id) {
      this.topic = null;
      try {
        this.topic = await apiClient.findTopicOne({
          id,
        });
      } catch {
        this.msg = "トピック取得に失敗しました";
      }
    }
  }

  clearMsg() {
    this.msg = null;
  }
}
