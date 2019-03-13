import {
  convert,
  initStorage,
  Storage,
  StorageJSON,
  toJSON,
  toStorage,
  verArray,
} from "../models";
import { createHeaders } from "../utils";
import * as G from "../../generated/graphql";

export function useLoad(token: G.TokenMaster.Fragment) {
  const storages = G.FindStorages.use({
    variables: { query: {} },
    context: {
      headers: createHeaders(token.id, token.key)
    }
  });
  const data = storages.data;
  if (data === undefined) {
    return undefined;
  }
  const key = [...verArray, "main"].find(ver => data.storages.findIndex(x => x.key === ver) !== -1);
  const sto = data.storages.find(x => x.key === key);
  return toStorage(await convert(sto !== undefined
    ? JSON.parse(sto.value) as StorageJSON
    : initStorage));
}

export function useSave() {
  const submit = G.SetStorage.use();
  return (storage: Storage) => {
    const json = toJSON(storage);
    return submit({
      variables: {
        key: json.ver,
        value: JSON.stringify(json)
      }
    });
  };
}
