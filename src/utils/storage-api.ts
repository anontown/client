import * as api from "@anontown/api-types";
import { Observable } from "rxjs";
import {
  convert,
  initStorage,
  Storage,
  StorageJSON,
  toJSON,
  toStorage,
  verArray,
} from "../models";
import { apiClient } from "../utils";

export function load(auth: api.TokenMaster) {
  return apiClient.listStorage(auth)
    .map(storageKeys => [...verArray, "main"].find(ver => storageKeys.indexOf(ver) !== -1))
    .mergeMap(key => {
      if (key !== undefined) {
        return apiClient.getStorage(auth, { key })
          .map(jsonStr => JSON.parse(jsonStr) as StorageJSON);
      } else {
        return Observable.of(initStorage);
      }
    })
    .mergeMap(json => convert(json))
    .map(data => toStorage(data));
}

export function save(auth: api.TokenMaster, storage: Storage) {
  const json = toJSON(storage);
  return apiClient.setStorage(auth, {
    key: json.ver,
    value: JSON.stringify(json),
  });
}
