import * as http from 'http';

export class Request<T = string> extends http.IncomingMessage {
  params: {[key: string]: string} = {};
  public body!: T;
}
