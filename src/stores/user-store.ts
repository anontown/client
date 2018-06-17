import { action, observable } from "mobx";
import * as mobxUtils from "mobx-utils";
import {
  Observable,
} from "rxjs";
import { UserData, Storage } from "../models";
import {
  storageAPI,
} from "../utils";
import * as api from "@anontown/api-types";

export class UserStore {
  @observable.ref data: UserData | null = null;

  constructor() {
    Observable
      .from(mobxUtils.toStream(() => this.data))
      .debounceTime(5000)
      .subscribe(data => {
        if (data !== null) {
          storageAPI
            .save(data.token, data.storage);
        }
      });
  }

  updateToken(token: api.TokenMaster) {
    if (this.data !== null) {
      localStorage.setItem("token", JSON.stringify({
        id: token.id,
        key: token.key,
      }));
      this.data = { ...this.data, token: token };
    }
  }

  @action.bound initData(userData: UserData | null) {
    this.data = userData;
  }

  @action.bound setStorage(storage: Storage) {
    if (this.data !== null) {
      this.data = {
        ...this.data,
        storage: storage
      }
    }
  }

  @action.bound setProfiles(profiles: api.Profile[]) {
    if (this.data !== null) {
      this.data = {
        ...this.data,
        profiles: profiles
      }
    }
  }

  @action.bound userChange(token: api.TokenMaster | null) {
    if (token !== null) {
      localStorage.setItem("token", JSON.stringify({
        id: token.id,
        key: token.key,
      }));
    } else {
      localStorage.removeItem("token");
    }
    location.reload();
  }
}
