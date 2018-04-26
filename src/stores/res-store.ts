import { observable } from "mobx";
import { ResSeted } from "../models";
import { apiClient, resSetedCreate } from "../utils";
import { UserStore } from "./user-store";

export class ResStore {
  @observable msg: string | null = null;
  @observable res: ResSeted | null = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    this.res = null;
    const token = this.user.data !== null ? this.user.data.token : null;
    try {
      this.res = (await resSetedCreate.resSet(token, [await apiClient.findResOne(token, {
        id,
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
