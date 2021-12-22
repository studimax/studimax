import * as path from 'path';
import {format} from 'fecha';
import {LogData, LogLevelNamed, Metadata, Options, Stack} from './types';
import ts from '@studimax/ts';
import Serializer from './Serializer';
import DATED_LOG from './transports/DatedLogTransport';
import NAMED_LOG from './transports/NamedLogTransport';
import CONSOLE_LOG from './transports/ConsoleLogTransport';
import SIMULATE_LAG from './transports/SimulateLogTransport';

const defaultLogLevels = {
  trace: {
    level: 0,
    color: '#0099ff',
  },
  debug: {
    level: 1,
    color: '#00cc99',
  },
  info: {
    level: 2,
    color: '#00cc30',
  },
  warn: {
    level: 3,
    color: '#ffcc00',
  },
  error: {
    level: 4,
    color: '#ff0000',
  },
  fatal: {
    level: 5,
    color: '#a70000',
  },
};

type LoggerType<L extends string = never> = Readonly<CoreLogger<L>> & {
  [key in keyof typeof defaultLogLevels | L]: (message: string, metadata?: Metadata) => LogData;
};
/**
 * @internal
 * CoreLogger is a simple logging utility that can be used to log messages to multiple transports.
 * @author Maxime Scharwath
 */
export class CoreLogger<L extends string = never> {
  public logHistory: LogData[] = [];
  readonly #options: Options<keyof typeof defaultLogLevels>;
  #prevLogTransports: Promise<void>[] = [];
  #level = 0;

  constructor(options: Partial<Options<keyof typeof defaultLogLevels | L>> = {}) {
    this.#options = {
      format: '{timestamp}\t<{level.name}>\t{file}:{line}\t({method})\t{message} {metadata}',
      dateFormat: 'YYYY-MM-DD HH:mm:ss.SS',
      logFolder: 'logs',
      logHistory: 100,
      transports: [],
      transportTimeout: 1000,
      ...options,
      levels: {...defaultLogLevels, ...(options?.levels ?? {})},
    };
  }

  /**
   * Detect stack trace and return a stack object.
   * @param index {number} The index of the stack trace to use.
   * @private
   */
  static #getStackLog(index = 0): Stack | undefined {
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;
    const stackList = new Error().stack?.split('\n').slice(3);
    if (!stackList) return;
    const s = stackList[index],
      sp = stackReg.exec(s) ?? stackReg2.exec(s);
    if (!(sp && sp.length === 5)) return;
    return {
      method: sp[1] === '' ? '<anonymous>' : sp[1],
      path: sp[2],
      line: sp[3],
      pos: sp[4],
      folder: path.dirname(path.resolve(sp[2])),
      file: path.basename(sp[2]),
      stack: stackList.slice(index).join('\n'),
    } as Stack;
  }

  /**
   * Base log method.
   * @remarks it used to always have the same stack index.
   * @param level {string} The level of the log.
   * @param message {string} The message to log.
   * @param metadata {Metadata} The metadata to log.
   * @private
   */
  #logMain(level: LogLevelNamed, message: string, metadata?: Metadata): LogData {
    const stack = CoreLogger.#getStackLog(1);
    const date = new Date();
    const output = ts(this.#options.format, {
      ...stack,
      timestamp: format(date, this.#options.dateFormat),
      level,
      message,
      metadata: metadata ? JSON.stringify(metadata, Serializer()) : '',
    });
    const data = {
      date,
      level,
      message,
      metadata,
      rawOutput: output,
      stack,
      output,
    };
    //to keep the order of transports
    this.#prevLogTransports = this.#options.transports.map((transport, index) => {
      const ready = Promise.allSettled(this.#prevLogTransports).then(() => {});
      const transportReady = this.#prevLogTransports[index];
      const t = transport(data, {...this.#options, ready, transportReady, level: this.#level});
      return new Promise((resolve, reject) => {
        if (!(t instanceof Promise)) return resolve();
        const timeout = setTimeout(() => {
          reject(new Error(`Transport ${transport.name} is taking too long to process the log.`));
        }, this.#options.transportTimeout);
        t.then(resolve)
          .catch(reject)
          .finally(() => clearTimeout(timeout));
      });
    });
    const logData = {
      ...data,
      done: Promise.allSettled(this.#prevLogTransports).then(() => {}),
    };
    this.logHistory = [logData, ...this.logHistory].slice(0, this.#options.logHistory);
    return logData;
  }

  /**
   * Returns a log function for desired level.
   * @param level {string} The level of the log.
   */
  public logger(level: keyof typeof defaultLogLevels & keyof L): (message: string, metadata?: Metadata) => LogData {
    const logLevelNamed: LogLevelNamed = {
      ...defaultLogLevels.trace,
      ...(this.#options.levels[level] ?? {}),
      name: level,
    };
    return (message: string, metadata?: Metadata) => this.#logMain(logLevelNamed, message, metadata);
  }

  /**
   * Get all levels available.
   */
  public getLevels(): string[] {
    return Object.keys(this.#options.levels);
  }

  /**
   * Set minimum log level to be emitted.
   * @param level {string} The level to set.
   */
  public setLevel(level: number) {
    this.#level = level;
  }
}

/**
 * Logger is a simple logging utility that can be used to log messages to multiple transports.
 * @remarks it uses the CoreLogger class. And Proxy under the hood.
 * @author Maxime Scharwath
 */
export default function Logger<L extends string = never>(
  options: Partial<Options<keyof typeof defaultLogLevels | L>> = {}
): LoggerType<L> {
  const logger = new CoreLogger(options);
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (typeof prop === 'string' && !(prop in logger)) {
          return logger.logger(prop as never);
        }
        const value = logger[prop as keyof CoreLogger<L>];
        if (typeof value === 'function') {
          return value.bind(logger);
        }
        return value;
      },
    }
  ) as never;
}

Logger.TRANSPORTS = {
  DATED_LOG,
  NAMED_LOG,
  CONSOLE_LOG,
  SIMULATE_LAG,
};
