import * as api from "@anontown/api-types";
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

export async function load(auth: api.TokenMaster) {
  const storageKeys = await apiClient.listStorage(auth);
  const key = [...verArray, "main"].find(ver => storageKeys.indexOf(ver) !== -1);
  return toStorage(await convert(key !== undefined
    ? JSON.parse(await apiClient.getStorage(auth, { key })) as StorageJSON
    : initStorage));
}

export function save(auth: api.TokenMaster, storage: Storage) {
  const json = toJSON(storage);
  return apiClient.setStorage(auth, {
    key: json.ver,
    value: JSON.stringify(json),
  });
}
