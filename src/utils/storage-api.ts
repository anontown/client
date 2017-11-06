import * as api from "@anontown/api-types";
import { apiClient } from "../utils";
import {
  verArray,
  StorageJSON,
  initStorage,
  toStorage,
  convert,
  Storage,
  toJSON
} from "../models";
import { Observable } from "rxjs";

export function load(auth: api.TokenMaster) {
  return apiClient.listTokenStorage(auth)
    .map(storageNames => [...verArray, 'main'].find(ver => storageNames.indexOf(ver) !== -1))
    .mergeMap(name => {
      if (name !== undefined) {
        return apiClient.getTokenStorage(auth, { name })
          .map(jsonStr => JSON.parse(jsonStr) as StorageJSON);
      } else {
        return Observable.of(initStorage);
      }
    })
    .map(json => toStorage(convert(json)));
}

export function save(auth: api.TokenMaster, storage: Storage) {
  let json = toJSON(storage);
  return apiClient.setTokenStorage(auth, {
    name: json.ver,
    value: JSON.stringify(json)
  });
}