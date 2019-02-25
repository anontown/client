import { Storage } from "./storage";
import { token_TokenMaster } from "../gql/_gql/token";

export interface UserData {
  token: token_TokenMaster;
  storage: Storage;
  id: string;
}
