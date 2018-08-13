import {
  convert,
  initStorage,
  Storage,
  StorageJSON,
  toJSON,
  toStorage,
  verArray,
} from "../models";
import { gqlClient, createHeaders } from "../utils";
import { getToken_token_TokenMaster } from "../components/_gql/getToken";
import { getAllStorage, setStorage } from "./storage-api.gql";
import { getAllStorage as getAllStorageResult } from "./_gql/getAllStorage";
import { setStorage as setStorageResult, setStorageVariables } from "./_gql/setStorage";

export async function load(token: getToken_token_TokenMaster) {
  const storages = await gqlClient.query<getAllStorageResult>({
    query: getAllStorage,
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

export async function save(storage: Storage) {
  const json = toJSON(storage);
  await gqlClient.query<setStorageResult, setStorageVariables>({
    query: setStorage,
    variables: {
      key: json.ver,
      value: JSON.stringify(json)
    }
  });
}
