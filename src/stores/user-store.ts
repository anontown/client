import { action, observable } from "mobx";
import * as mobxUtils from "mobx-utils";
import {
  Observable,
  ReplaySubject,
} from "rxjs";
import { UserData } from "../models";
import {
  storageAPI,
} from "../utils";

export class UserStore {
  @observable.ref data: UserData | null = null;
  onChangeUser: ReplaySubject<void> = new ReplaySubject(1);

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

  @action.bound setData(data: UserData | null) {
    const oldID = this.data !== null ? this.data.token.user : null;
    const newID = data !== null ? data.token.user : null;
    this.data = data;
    if (oldID !== newID) {
      this.onChangeUser.next(undefined);
    }
  }
}
