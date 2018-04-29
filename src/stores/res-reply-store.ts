import { observable } from "mobx";
import { UserStore } from "./user-store";
import * as Im from "immutable";
import { ResSeted } from "../models";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";

export class ResReplyStore {
  @observable reses: Im.List<ResSeted> | null = null;
  @observable msg: null | string = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    this.reses = null;
    try {
      const token = this.user.data !== null ? this.user.data.token : null;
      this.reses = Im.List(await resSetedCreate.resSet(token, await apiClient.findResReply(token, {
        reply: id,
      })));
    } catch {
      this.msg = "レス取得に失敗しました";
    }
  }

  update(res: ResSeted) {
    if (this.reses !== null) {
      this.reses = list.update(this.reses, res);
    };
  }

  clearMsg() {
    this.msg = null;
  }
}
