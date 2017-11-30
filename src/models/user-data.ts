import * as api from "@anontown/api-types";
import { Storage } from "./storage";

export interface UserData {
  token: api.TokenMaster;
  storage: Storage;
  profiles: api.Profile[];
}
