type Options<T> = {capacity: number; transformer?: (value: T) => T; validator?: (value: T) => boolean};
/**
 * Class ArrayCapacity is an extended version of Array to limit the number of elements.
 * @remarks It uses Proxy to handle index access correctly. The capacity is readonly. It can be set only in the constructor.
 * @see Array
 * @see Proxy
 * @extends Array
 * @author Maxime Scharwath
 */
// @ts-expect-error Force to override static method from Array
export default class ArrayCapacity<T> extends Array<T> {
  /**
   * The maximum number of elements.
   * @readonly
   */
  public readonly capacity!: number;

  public readonly transformer?: (value: T) => T;
  public readonly validator?: (value: T) => boolean;

  /**
   * Constructor of ArrayCapacity.
   * @param options
   */
  constructor(options: Options<T>);
  /**
   * Constructor of ArrayCapacity.
   * @param capacity - The maximum number of elements.
   * @param items The initial items.
   */
  constructor(capacity: number, ...items: T[]);
  /**
   * Constructor of ArrayCapacity.
   * @param options
   * @param items The initial items.
   */
  constructor(options: Options<T>, ...items: T[]);
  constructor(options: number|Options<T>, ...items: T[]) {
    const opts: Options<T> = typeof options === 'number' ? {capacity: options} : options;
    super(
        ...items
            .map(item => (opts.transformer ? opts.transformer(item) : item))
            .filter(item => (opts.validator ? opts.validator(item) : true))
            .slice(0, opts.capacity)
    );
    Object.defineProperty(this, 'capacity', {
      value: opts.capacity,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    Object.defineProperty(this, 'validator', {
      value: opts.validator,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    Object.defineProperty(this, 'transformer', {
      value: opts.transformer,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    //using Proxy to handle index accessor
    return new Proxy(this, {
      set: (target, key, value: T) => {
        if(key === 'length') {
          target.length = Math.max(0, Math.min(value as unknown as number, this.capacity));
          return true;
        }
        const index = Number(key);
        if (Number.isNaN(index) || (index >= 0 && index < this.capacity)) {
          if (!Number.isNaN(index)) {
            if (this.transformer) value = this.transformer(value);
            if (this.validator && !this.validator(value)) return true;
          }
          target[key as never] = value;
        }
        return true;
      },
    });
  }

  /**
   * Creates an ArrayCapacity from an array-like object and capacity.
   * @param arrayLike - An array-like object to convert to an array.
   * @param capacity - The maximum number of elements.
   * @returns A new ArrayCapacity instance.
   */
  public static override from<T>(arrayLike: ArrayLike<T>, capacity:number): ArrayCapacity<T>;
  /**
   * Creates an ArrayCapacity from an array-like object and capacity.
   * @param arrayLike - An array-like object to convert to an array.
   * @param options
   * @returns A new ArrayCapacity instance.
   */
  public static override from<T>(arrayLike: ArrayLike<T>, options: Options<T>): ArrayCapacity<T>;
  public static override from<T>(arrayLike: ArrayLike<T>, options: number|Options<T>): ArrayCapacity<T> {
    return new ArrayCapacity<T>(options as Options<T> , ...Array.from(arrayLike));
  }


  /**
   * Returns a new ArrayCapacity from a set of elements and capacity.
   * @param capacity - The maximum number of elements.
   * @param items - A set of elements to include in the new ArrayCapacity object.
   * @returns A new ArrayCapacity instance.
   */
  public static override of<T>(capacity: number, ...items: T[]): ArrayCapacity<T>
  /**
   * Returns a new ArrayCapacity from a set of elements and capacity.
   * @param options
   * @param items - A set of elements to include in the new ArrayCapacity object.
   * @returns A new ArrayCapacity instance.
   */
  public static override of<T>(options: Options<T>, ...items: T[]): ArrayCapacity<T>;
  public static override of<T>(options: number|Options<T>, ...items: T[]): ArrayCapacity<T> {
    return new ArrayCapacity<T>(options as Options<T>, ...items);
  }

  public override push(...items: T[]): number {
    return super.push(...this.transform(items, 0, this.capacity - this.length));
  }

  public override unshift(...items: T[]): number {
    return super.unshift(...this.transform(items, 0, this.capacity - this.length));
  }

  public pushAt(index: number, ...items: T[]): T[] {
    return this.splice(index, 0, ...items);
  }

  public override splice(start: number, deleteCount: number, ...items: T[]): T[] {
    return super.splice(start, deleteCount, ...this.transform(items, 0, this.capacity - this.length + deleteCount));
  }

  /**
   * Takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the array.
   * @throws RangeError if the index is out of range.
   * @param index The index to getData.
   * @returns The element at the specified index.
   */
  public override at(index: number): T {
    if (index < 0) index = this.length + index;
    if (index < 0 || index >= this.capacity) throw new RangeError(`${index} is out the capacity of ${this.capacity}`);
    return this[index];
  }

  private transform(items: T[], start?: number, end?: number): T[] {
    if (this.transformer) {
      const transformer = this.transformer;
      items = items.map(item => transformer(item));
    }
    if (this.validator) {
      const validator = this.validator;
      items = items.filter(item => validator(item));
    }
    return items.slice(start, end);
  }
}
