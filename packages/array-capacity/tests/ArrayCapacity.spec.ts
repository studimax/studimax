import ArrayCapacity from '../src';

describe('Array', () => {
  test('capacity should be the same as constructor args', () => {
    const array = new ArrayCapacity({capacity: 2});
    expect(array.capacity).toBe(2);
    expect(array.length).toBe(0);
  });
  test('try to add value with indexer', () => {
    const array = new ArrayCapacity({capacity: 2});
    array[0] = 1;
    array[1] = 2;
    array[2] = 3;
    expect(array.length).toBe(2);
    expect(array[2]).toBeUndefined();
  });
  test('try to add value with indexer out capacity', () => {
    const array = new ArrayCapacity(2);
    array[100] = 3;
    expect(array.length).toBe(0);
    expect(array[100]).toBeUndefined();
  });
  test('push() method', () => {
    const array = new ArrayCapacity(2);
    array.push(1, 2, 3);
    expect(array.length).toBe(2);
    expect(array[0]).toBe(1);
    expect(array[1]).toBe(2);
    expect(array[3]).toBeUndefined();
    expect([1, 2]).toEqual(expect.arrayContaining(array));
  });
  test('unshift() method', () => {
    const array = new ArrayCapacity( 2);
    array.unshift(4, 5, 6);
    expect(array.length).toBe(2);
    expect(array[0]).toBe(4);
    expect(array[1]).toBe(5);
    expect(array[3]).toBeUndefined();
    expect([4, 5]).toEqual(expect.arrayContaining(array));
  });
  test('splice() method', () => {
    const array = new ArrayCapacity(3, ...[1, 2, 3]);
    expect([1, 2, 3]).toEqual(expect.arrayContaining(array));
    array.splice(1, 1);
    expect([1, 3]).toEqual(expect.arrayContaining(array));
    array.splice(0, 2, 4, 5, 6, 7, 8);
    expect([4, 5, 6]).toEqual(expect.arrayContaining(array));
  });
  test('at() method', () => {
    const array = new ArrayCapacity(3, ...[1, 2, 3]);
    expect(array.at(1)).toBe(2);
    expect(array.at(-1)).toBe(3);
    expect(() => array.at(-4)).toThrow(RangeError);
    expect(() => array.at(3)).toThrow(RangeError);
  });
  test('Array from', () => {
    const array = ArrayCapacity.from([1, 2, 3, 4], 2);
    expect(array).toBeInstanceOf(ArrayCapacity);
    expect(array.length).toBe(2);
    expect(ArrayCapacity.isArray(array)).toBeTruthy();
  });
  test('Array of', () => {
    const array = ArrayCapacity.of(2, ...[1, 2, 3, 4]);
    expect(array).toBeInstanceOf(ArrayCapacity);
    expect(array.length).toBe(2);
    expect(ArrayCapacity.isArray(array)).toBeTruthy();
  });
  test('Transformer', () => {
    const array = ArrayCapacity.from([1, 2, 3, 4], {
      capacity: 3,
      transformer: value => value * 2,
    });
    expect([2, 4, 6]).toEqual(expect.arrayContaining(array));
  });
  test('validator', () => {
    const array = ArrayCapacity.from([1, 2, 3, 4], {
      capacity: 4,
      validator: value => value % 2 === 0,
    });
    expect([2, 4]).toEqual(expect.arrayContaining(array));
  });
  test('Transformer and validator', () => {
    const array = ArrayCapacity.from([1, 2, 3, 4], {
      capacity: 4,
      transformer: value => value * 3,
      validator: value => value % 2 === 0,
    });
    expect([6, 12]).toEqual(expect.arrayContaining(array));
  });
});
