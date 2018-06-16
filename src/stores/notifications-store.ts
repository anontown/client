import * as Im from "immutable";
import { observable } from "mobx";
import {
  ResSeted,
} from "../models";
import {
  apiClient,
  list,
  resSetedCreate,
} from "../utils";
import { UserStore } from "./user-store";

export class NotificationsStore {
  @observable.ref reses: Im.List<ResSeted> = Im.List();
  @observable.ref msg: null | string = null;

  private limit = 50;

  constructor(private user: UserStore) { }

  update(res: ResSeted) {
    this.reses = list.update(this.reses, res);
  }

  async findNew() {
    if (this.user.data === null) {
      return;
    }
    const token = this.user.data.token;
    try {
      const reses = await resSetedCreate.resSet(token, await apiClient.findRes(token,
        {
          limit: this.limit,
          type: "lte",
          date: new Date().toISOString(),
          query: { notice: true }
        }));
      this.reses = Im.List(reses);
    } catch {
      this.msg = "レス取得に失敗";
    }
  }

  async readNew() {
    if (this.user.data === null) {
      return;
    }

    const token = this.user.data.token;

    const first = this.reses.first();
    if (first === undefined) {
      await this.findNew();
    } else {
      try {
        const reses = await resSetedCreate.resSet(token, await apiClient.findRes(token,
          {
            type: "gt",
            date: first.date,
            limit: this.limit,
            query: { notice: true }
          }));
        this.reses = Im.List(reses).concat(this.reses);
      } catch {
        this.msg = "レス取得に失敗";
      }
    }
  }

  async readOld() {
    if (this.user.data === null) {
      return;
    }

    const token = this.user.data.token;

    const last = this.reses.last();

    if (last === undefined) {
      await this.findNew();
    } else {
      try {
        const reses = await resSetedCreate.resSet(token, await apiClient.findRes(token,
          {
            type: "lt",
            date: last.date,
            limit: this.limit,
            query: { notice: true }
          }));
        this.reses = this.reses.concat(reses);
      } catch {
        this.msg = "レス取得に失敗";
      }
    }
  }

  async load() {
    this.reses = Im.List();
    this.msg = null;
    this.findNew();
  }

  clearMsg() {
    this.msg = null;
  }
}
