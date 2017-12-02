import { Observable } from "rxjs";
import { Config } from "../env";

export function upload(data: FormData): Observable<string> {
  return Observable.ajax({
    url: "https://api.imgur.com/3/image",
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${Config.imgur.clientID}`,
    },
    body: data,
    crossDomain: true
  })
    .map(r => r.response.data.link);
}
