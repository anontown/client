import { Storage } from "./storage";
import * as G from "../../generated/graphql";

export interface UserData {
  token: G.TokenMaster.Fragment;
  storage: Storage;
  id: string;
}
