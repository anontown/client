import { Config } from "../env";

export async function getServerStatus() {
  const server = await fetch(Config.api.origin + "/ping", { mode: "cors" })
    .then(x => x.text())
    .then(x => x === "OK")
    .catch(_e => false);
  const client = await fetch("https://anontown.com/ping", { mode: "cors" })
    .then(x => x.text())
    .then(x => x === "OK")
    .catch(_e => false);
  return server || !client;
}