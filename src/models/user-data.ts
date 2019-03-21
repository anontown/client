import { Storage } from "./storage";
import * as G from "../../generated/graphql";

export interface UserData {
  token: G.TokenMasterFragment;
  storage: Storage;
  id: string;
}
