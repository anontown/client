import * as api from "@anontown/api-types";
import { observable } from "mobx";
import {
  apiClient,
} from "../utils";
import { UserStore } from "./user-store";

export class ProfileStore {
  @observable profile: api.Profile | null = null;
  @observable msg: null | string = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    this.profile = null;
    try {
      const token = this.user.data !== null ? this.user.data.token : null;
      this.profile = await apiClient.findProfileOne(token, {
        id: id,
      });
    } catch {
      this.msg = "プロフィール取得に失敗しました";
    }
  }

  clearMsg() {
    this.msg = null;
  }
}
