import { Storage } from "./storage";
import { getToken_token_TokenMaster } from "../components/_gql/getToken";

export interface UserData {
  token: getToken_token_TokenMaster;
  storage: Storage;
}
