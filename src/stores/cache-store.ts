import * as api from "@anontown/api-types";
import { observable } from "mobx";

export class CacheStore {
  @observable.shallow clients = new Map<string, api.Client>();
  @observable.shallow histories = new Map<string, api.History>();
  @observable.shallow reses = new Map<string, api.Res>();
  @observable.shallow profiles = new Map<string, api.Profile>();
  @observable.shallow msgs = new Map<string, api.Topic>();
}
