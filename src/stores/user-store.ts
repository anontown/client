import { observable, action } from "mobx";
import { UserData } from "../models";
import { Observable } from "rxjs";
import {
  storageAPI,
} from "../utils";
import * as mobxUtils from "mobx-utils";

export class UserStore {
  constructor() {
    Observable
      .from(mobxUtils.toStream(() => this.data))
      .debounceTime(5000)
      .subscribe(data => {
        if (data !== null) {
          localStorage.setItem("token", JSON.stringify({
            id: data.token.id,
            key: data.token.key,
          }));
          storageAPI
            .save(data.token, data.storage)
            .subscribe();
        } else {
          localStorage.removeItem("token");
        }
      });
  }

  @observable data: UserData | null = null;
  @action.bound async setData(data: UserData | null) {
    this.data = data;
  }
}