import { UserStore } from "./user-store";
import { observable } from "mobx";
import { apiClient, resSetedCreate } from "../utils";
import { ResSeted } from "../models";

export class ResStore {
  constructor(private user: UserStore) { }

  @observable msg: string | null = null;
  @observable res: ResSeted | null = null;

  async load(id: string) {
    this.res = null;
    const token = this.user.data !== null ? this.user.data.token : null;
    try {
      this.res = (await resSetedCreate.resSet(token, [await apiClient.findResOne(token, {
        id: id,
      })]))[0];
    } catch {
      this.msg = "レス取得に失敗しました";
    }
  }

  async update(res: ResSeted) {
    this.res = res;
  }

  clearMsg() {
    this.msg = null;
  }
}