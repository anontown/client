import {
  convert,
  initStorage,
  Storage,
  StorageJSON,
  toJSON,
  toStorage,
  verArray,
} from "../models";
import { createHeaders, gqlClient } from "../utils";
import * as G from "../../generated/graphql";

export async function load(token: G.TokenMaster.Fragment) {
  const storages = await gqlClient.query<G.FindStorages.Query, G.FindStorages.Variables>({
    query: G.FindStorages.Document,
    variables: { query: {} },
    context: {
      headers: createHeaders(token.id, token.key)
    }
  });
  const key = [...verArray, "main"].find(ver => storages.data.storages.findIndex(x => x.key === ver) !== -1);
  const sto = storages.data.storages.find(x => x.key === key);
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
