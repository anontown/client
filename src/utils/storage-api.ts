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
  return apiClient.listTokenStorage(auth)
    .map( storageNames => [...verArray, "main"].find( ver => storageNames.indexOf(ver) !== -1))
    .mergeMap( name => {
      if (name !== undefined) {
        return apiClient.getTokenStorage(auth, { name })
          .map( jsonStr => JSON.parse(jsonStr) as StorageJSON);
      } else {
        return Observable.of(initStorage);
      }
    })
    .map( json => toStorage(convert(json)));
}

export function save(auth: api.TokenMaster, storage: Storage) {
  const json = toJSON(storage);
  return apiClient.setTokenStorage(auth, {
    name: json.ver,
    value: JSON.stringify(json),
  });
}
