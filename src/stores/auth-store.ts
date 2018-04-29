import * as api from "@anontown/api-types";
import { observable } from "mobx";
import { apiClient } from "../utils";
import { UserStore } from "./user-store";

export class AuthStore {
  @observable msg: string | null = null;
  @observable client: api.Client | null = null;

  constructor(private user: UserStore) { }

  async load(id: string) {
    this.client = null;
    try {
      const client = await apiClient
        .findClientOne(this.user.data !== null
          ? this.user.data.token
          : null, {
            id,
          });
      this.client = client;
    } catch {
      this.msg = "クライアント取得に失敗しました";
    }
  }

  clearMsg() {
    this.msg = null;
  }

  async auth() {
    if (this.user.data !== null && this.client !== null) {
      const user = this.user.data;
      const client = this.client;
      try {
        const token = await apiClient.createTokenGeneral(user.token, { client: client.id });
        const req = await apiClient.createTokenReq(token);
        location.href = client.url + "?" + "id=" + req.token + "&key=" + encodeURI(req.key);
      } catch {
        this.msg = "認証に失敗しました";
      }
    }
  }
}
