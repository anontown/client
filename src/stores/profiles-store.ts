import { UserStore } from "./user-store";
import * as Im from "immutable";
import * as api from "@anontown/api-types";
import { observable } from "mobx";
import { apiClient, list } from "../utils";

export class ProfilesStore {
  constructor(private user: UserStore) { }

  @observable msg: string | null = null;
  @observable profiles: Im.List<api.Profile> = Im.List();

  async load() {
    this.profiles = Im.List();
    if (this.user.data !== null) {
      try {
        this.profiles = Im.List(await apiClient.findProfileAll(this.user.data.token));
      } catch{
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