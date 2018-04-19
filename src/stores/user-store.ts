import { action, observable } from "mobx";
import * as mobxUtils from "mobx-utils";
import { Observable } from "rxjs";
import { UserData } from "../models";
import {
  storageAPI,
} from "../utils";

export class UserStore {
  @observable data: UserData | null = null;

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
            .save(data.token, data.storage);
        } else {
          localStorage.removeItem("token");
        }
      });
  }

  @action.bound async setData(data: UserData | null) {
    this.data = data;
  }
}
