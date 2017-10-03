import { Observable } from "rxjs";
import { Config } from "../env";

export function upload(data: Blob | FormData): Observable<string> {
  return Observable.ajax.post('https://api.imgur.com/3/image', data, {
    Authorization: `Client-ID ${Config.imgur.clientID}`
  })
    .map(r => JSON.parse(r.responseText).data.link);
}