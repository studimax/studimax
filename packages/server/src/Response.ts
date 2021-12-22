import * as http from 'http';

export class Response extends http.ServerResponse {
  public status(code: number) {
    this.statusCode = code;
    return this;
  }

  public send(data: any) {
    if (data !== undefined) {
      if (data instanceof Error) {
        this.writeHead(500, {'Content-Type': 'text/plain'}).end(data.toString());
      } else if (typeof data === 'object') {
        this.json(data);
      } else {
        this.writeHead(200, {'Content-Type': 'text/plain'}).end(data.toString());
      }
    }
    return this.end();
  }

  public json(data: any) {
    try {
      const json = JSON.stringify(data);
      this.writeHead(this.statusCode, {'Content-Type': 'application/json'}).end(json);
    } catch (e: any) {
      this.writeHead(500, {'Content-Type': 'text/plain'}).end(e.toString());
    }
  }
}
