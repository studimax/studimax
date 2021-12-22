import * as http from 'http';
import {match, pathToRegexp} from 'path-to-regexp';
import {Request} from './Request';
import {Response} from './Response';

type Handler = (req: Request, res: Response) => Promise<unknown> | unknown;
type Middleware = (req: Request, res: Response, next: (value?: unknown) => void) => Promise<void> | void;
type Route = {method: string; path: string; middleware: Middleware};
export default class Server extends http.Server {
  #middlewares: Middleware[] = [];
  #routes: Route[] = [];

  constructor() {
    super(
      {
        IncomingMessage: Request,
        ServerResponse: Response,
      },
      (req, res) => this.#requestListener(req as Request, res as Response)
    );
  }

  public getRoutes(method?: string) {
    return this.#routes.filter(route => !method || route.method === method.toUpperCase());
  }

  public use(middleware: Middleware) {
    this.#middlewares.push(middleware);
    return this;
  }

  public get = (path: string, handler: Handler): this => this.#addRoute('GET', path, handler);

  public post = (path: string, handler: Handler): this => this.#addRoute('POST', path, handler);

  public put = (path: string, handler: Handler): this => this.#addRoute('PUT', path, handler);

  public delete = (path: string, handler: Handler): this => this.#addRoute('DELETE', path, handler);

  public patch = (path: string, handler: Handler): this => this.#addRoute('PATCH', path, handler);

  public options = (path: string, handler: Handler): this => this.#addRoute('OPTIONS', path, handler);

  public head = (path: string, handler: Handler): this => this.#addRoute('HEAD', path, handler);

  public unUse(middleware: Middleware) {
    this.#middlewares.splice(this.#middlewares.indexOf(middleware), 1);
    return this;
  }

  public removeRoute(path: string, method?: string) {
    this.#routes
      .filter(route => (!method || route.method === method.toUpperCase()) && route.path === path)
      .forEach(route => {
        this.#routes.splice(this.#routes.indexOf(route), 1);
        this.unUse(route.middleware);
      });
    return this;
  }

  async #requestListener(req: Request, res: Response) {
    for (const middleware of this.#middlewares) {
      const error = await new Promise(next => middleware(req, res, next)?.then(next).catch(next));
      if (res.writableFinished) return;
      if (error) return res.send(error);
    }
    res.status(404).send(new Error('Not Found'));
  }

  #addRoute(method: string, path: string, handler: Handler): this {
    method = method.toUpperCase();
    const middleware: Middleware = async (req, res) => {
      if (req.method !== method) return;
      const url = req.url as string;
      const regexp = pathToRegexp(path);
      if (!regexp.test(url)) return;
      const result = match<{[key: string]: string}>(path)(url);
      if (result) req.params = result.params;
      res.send(await handler(req, res));
    };
    this.#routes.push({
      method,
      path,
      middleware,
    });
    this.#middlewares.push(middleware);
    return this;
  }
}

export const BodyParser: Middleware = (req, res, next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    if (req.headers['content-type'] === 'application/json') {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        next(e);
      }
    } else {
      req.body = body;
    }
    next();
  });
};
