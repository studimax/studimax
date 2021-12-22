# @studimax/array-capacity
A fully extended Array with max capacity

## Installation
```bash
npm install @studimax/array-capacity
# or
yarn add @studimax/array-capacity
```

## Usage
The usage of ArrayCapacity is the same as the native Array. 
The only difference is that you cannot push more elements than the capacity.
```ts
import ArrayCapacity from '@studimax/array-capacity';

const array = new ArrayCapacity(2);
array.push(1,2,3,4,5,6);
// [1,2]
array[0] = 0;
array[2] = 5;
// [0,2]
array[2] // undefined
```
### Options
- `capacity`: The maximum number of elements that can be stored in the Array.
- `transformer`: transform the value before pushing it into the Array.
- `validator`: validate the value before pushing it into the Array. If the value is invalid, it will be ignored and the value will not be pushed.

Validator and Transformer are both optional, but validator will be called after transformer.

```ts
import ArrayCapacity from '@studimax/array-capacity';
const array = new ArrayCapacity({
  capacity: 2,
  validator: (value) => value > 0,
  transformer: (value) => value * 2,
});
array.push(-2, -1, 0, 1, 2);
// [0,2]
```
