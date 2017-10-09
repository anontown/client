import { TokenMaster } from "@anontown/api-types";
import { Storage } from "./storage";
import * as api from '@anontown/api-types'

export interface UserData {
  token: TokenMaster,
  storage: Storage,
  profiles: api.Profile[]
}