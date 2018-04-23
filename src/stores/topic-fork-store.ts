import * as api from "@anontown/api-types";
import { observable } from "mobx";
import {
  apiClient,
} from "../utils";

export class TopicForkStore {
  @observable topic: api.TopicNormal | null = null;
  @observable msg: null | string = null;

  async load(id: string) {
    try {
      const topic = await apiClient.findTopicOne({
        id: id,
      });
      if (topic.type === "normal") {
        this.topic = topic;
      } else {
        this.msg = "通常トピックではありません";
      }
    } catch {
      this.msg = "トピック取得に失敗しました";
    }
  }

  clearMsg() {
    this.msg = null;
  }
}