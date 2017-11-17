import { TokenMaster } from "@anontown/api-types";
import * as api from "@anontown/api-types";
import { Storage } from "./storage";

export interface UserData {
  token: TokenMaster;
  storage: Storage;
  profiles: api.Profile[];
}
