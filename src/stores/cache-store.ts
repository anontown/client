import { observable } from "mobx";
import * as api from "@anontown/api-types";

export class CacheStore {
  @observable clients = new Map<string, api.Client>();
  @observable histories = new Map<string, api.History>();
  @observable reses = new Map<string, api.Res>();
  @observable profiles = new Map<string, api.Profile>();
  @observable msgs = new Map<string, api.Topic>();
}