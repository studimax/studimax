import * as event from 'events';

/**
 * EventMap represents a map of event associated with their handlers.
 */
export type EventMap = Record<string | symbol, (...args: any[]) => void>;

type EventMapImproved<T extends EventMap> = T & {
  '*': (name: string, params: unknown[]) => void;
};
type EventKey<T extends EventMap> = string & keyof EventMapImproved<T>;

type Validation<T extends EventMap, K extends EventKey<T>> = (...params: Parameters<T[K]>) => boolean;

/**
 * Class EventEmitter is a full type-safe event emitter.
 * @extends EventEmitter
 * @author Maxime Scharwath
 */
export class EventEmitter<T extends EventMap> extends event.EventEmitter {
  #children = new Set<SubEventEmitter<T>>();

  /**
   * Emit an event.
   * @param event The name of the event.
   * @param params The parameters of the event.
   */
  public override emit<K extends EventKey<T>>(event: K, ...params: Parameters<T[K]>): boolean {
    if (event === '*') {
      throw new Error("Event '*' can be emitted");
    }
    super.emit('*', event, params);
    this.#children.forEach(child => child.emit(event, ...params));
    return super.emit(event, ...params);
  }

  /**
   * Remove listeners of a specific event.
   * @param event The name of the event.
   * @param listener The listener to remove.
   */
  public override removeListener<K extends EventKey<T>>(event: K, listener: EventMapImproved<T>[K]): this {
    return super.removeListener(event, listener);
  }

  /**
   * Remove listeners in children too of a specific event.
   * @param event The name of the event.
   * @param listener The listener to remove.
   */
  public removeChildrenListener<K extends EventKey<T>>(event: K, listener: EventMapImproved<T>[K]): this {
    super.removeListener(event, listener);
    this.#children.forEach(child => child.removeListener(event, listener));
    return this;
  }

  /**
   * Remove all listeners of a specific event.
   * @param event The name of the event.
   */
  public override removeAllListeners<K extends EventKey<T>>(event?: K): this {
    return super.removeAllListeners(event);
  }

  /**
   * Remove all listeners in children too of a specific event.
   * @param event The name of the event.
   */
  public removeAllChildrenListeners<K extends EventKey<T>>(event?: K): this {
    super.removeAllListeners(event);
    this.#children.forEach(child => child.removeAllListeners(event));
    return this;
  }

  /**
   * Returns a copy of the array of listeners for a specific event.
   * @param event The name of the event.
   */
  public override listeners<K extends EventKey<T>>(event: K): Function[] {
    return super.listeners(event);
  }

  /**
   * Returns a copy of the array of listeners for a specific event, including any wrappers (such as those created by .once()).
   * @param event The name of the event.
   */
  public override rawListeners<K extends EventKey<T>>(event: K): Function[] {
    return super.rawListeners(event);
  }

  /**
   * Returns the number of listeners for a specific event.
   * @param event The name of the event.
   */
  public override listenerCount<K extends EventKey<T>>(event: K): number {
    return super.listenerCount(event);
  }

  /**
   * Adds a listener to the end of the listeners array for the specified event.
   * @param event The name of the event.
   * @param listener The listener to add.
   */
  public override prependListener<K extends EventKey<T>>(event: K, listener: EventMapImproved<T>[K]): this {
    return super.prependListener(event, listener);
  }

  /**
   * Adds a one-time listener to the end of the listeners array for the specified event.
   * @param event The name of the event.
   * @param listener The listener to add.
   */
  public override prependOnceListener<K extends EventKey<T>>(event: K, listener: EventMapImproved<T>[K]): this {
    return super.prependOnceListener(event, listener);
  }

  /**
   * Adds a listener to the beginning of the listeners array for the specified event.
   * @param event The name of the event.
   * @param listener The listener to add.
   */
  public override addListener<K extends EventKey<T>>(event: K, listener: EventMapImproved<T>[K]) {
    return super.addListener(event, listener);
  }

  /**
   * Adds a listener for the event.
   * @param event The name of the event.
   * @param listener The listener to add.
   * @param validation
   */
  public override on<K extends EventKey<T>>(
    event: K,
    listener: EventMapImproved<T>[K],
    validation?: Validation<T, K>
  ): this {
    if (validation) {
      return super.on(event, (...args) => {
        if (validation(...(args as Parameters<T[K]>))) {
          listener(...args);
        }
      });
    }
    return super.on(event, listener);
  }

  /**
   * Adds a one-time listener for the event.
   * @param event The name of the event.
   * @param listener The listener to add.
   * @param validation
   */
  public override once<K extends EventKey<T>>(
    event: K,
    listener: EventMapImproved<T>[K],
    validation?: Validation<T, K>
  ) {
    if (validation) {
      const fc = ((...args: Parameters<T[K]>) => {
        if (validation(...args)) {
          listener(...args);
          this.removeListener(event, fc);
        }
      }) as EventMapImproved<T>[K];
      return super.on(event, fc);
    }
    return super.once(event, listener);
  }

  /**
   * Remove listeners of a specific event.
   * @see removeListener
   * @param event The name of the event.
   * @param listener The listener to remove.
   */
  public override off<K extends EventKey<T>>(event: K, listener: EventMapImproved<T>[K]): this {
    return super.off(event, listener);
  }

  public subEmitter(): SubEventEmitter<T> {
    return new SubEventEmitter<T>(this);
  }

  public getChildren(): SubEventEmitter<T>[] {
    return [...this.#children.values()];
  }

  public hasChild(child: SubEventEmitter<T>): boolean {
    return this.#children.has(child);
  }

  public link(child: SubEventEmitter<T>): this {
    this.#children.add(child);
    return this;
  }

  public unlink(child?: SubEventEmitter<T>): this {
    if (child) {
      if (this.#children.delete(child)) {
        child.removeAllChildrenListeners();
      }
    } else {
      this.#children.forEach(child => child.removeAllChildrenListeners());
      this.#children.clear();
    }
    return this;
  }
}

export class SubEventEmitter<T extends EventMap> extends EventEmitter<T> {
  #parent: EventEmitter<T>;

  constructor(parent: EventEmitter<T>) {
    super();
    this.#parent = parent;
    this.link();
  }

  /**
   * Link to parent.
   */
  public override link(parent?:EventEmitter<T>): this {
    if(parent) {
      this.#parent = parent;
    }
    this.#parent.link(this);
    return this;
  }

  /**
   * Unlink from parent.
   */
  public override unlink(): this {
    this.#parent.unlink(this);
    return this;
  }

  public isLinked(): boolean {
    return this.#parent.hasChild(this);
  }
}
