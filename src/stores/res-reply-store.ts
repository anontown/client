import * as Im from "immutable";
import { observable } from "mobx";
import { ResSeted } from "../models";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";
import { UserStore } from "./user-store";

export class ResReplyStore {
  @observable data: { id: string, reses: Im.List<ResSeted> } | null = null;
  @observable msg: null | string = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    if (this.data === null || this.data.id !== id) {
      this.data = null;
      try {
        const token = this.user.data !== null ? this.user.data.token : null;
        this.data = {
          reses: Im.List(await resSetedCreate.resSet(token, await apiClient.findResReply(token, {
            reply: id,
          }))),
          id,
        };
      } catch {
        this.msg = "レス取得に失敗しました";
      }
    }
  }

  update(res: ResSeted) {
    if (this.data !== null) {
      this.data.reses = list.update(this.data.reses, res);
    }
  }

  clearMsg() {
    this.msg = null;
  }
}
