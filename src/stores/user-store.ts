import { observable, action } from "mobx";
import { UserData } from "../models";
import { Subject } from "rxjs";
import {
  storageAPI,
} from "../utils";

export class UserStore {
  private changeData = new Subject<UserData | null>();
  constructor() {
    this.changeData
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