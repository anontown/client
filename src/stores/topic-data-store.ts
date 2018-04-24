import * as api from "@anontown/api-types";
import { observable } from "mobx";
import {
  apiClient,
} from "../utils";

export class TopicDataStore {
  @observable topic: api.Topic | null = null;
  @observable msg: null | string = null;

  async load(id: string) {
    this.topic = null;
    try {
      this.topic = await apiClient.findTopicOne({
        id: id,
      });
    } catch {
      this.msg = "トピック取得に失敗しました";
    }
  }

  clearMsg() {
    this.msg = null;
  }
}