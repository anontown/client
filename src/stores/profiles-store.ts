import * as api from "@anontown/api-types";
import * as Im from "immutable";
import { observable } from "mobx";
import { apiClient, list } from "../utils";
import { UserStore } from "./user-store";

export class ProfilesStore {
  @observable.ref msg: string | null = null;
  @observable.ref profiles: Im.List<api.Profile> = Im.List();

  constructor(private user: UserStore) { }

  async load() {
    this.profiles = Im.List();
    if (this.user.data !== null) {
      try {
        this.profiles = Im.List(await apiClient.findProfileAll(this.user.data.token));
      } catch {
        this.msg = "プロフィール取得に失敗";
      }
    }
  }

  clearMsg() {
    this.msg = null;
  }

  update(profile: api.Profile) {
    this.profiles = list.update(this.profiles, profile);
  }

  add(profile: api.Profile) {
    this.profiles = this.profiles.push(profile);
  }
}
