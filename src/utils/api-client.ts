import { API } from '@anontown/api-client'
import { Config } from "../env";

export const apiClient = new API({
  httpOrigin: Config.api.origin,
  socketOrigin: Config.socket.origin
});