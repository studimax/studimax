# @studimax/ts
A tiny template engine for JavaScript and TypeScript with no dependencies.

## Installation
```bash
npm install @studimax/ts
# or
yarn add @studimax/ts
```

## Usage
```ts
import ts from '@studimax/ts';

ts('Hello {world} !', {world: 'World'}) // Hello World !
ts('{a.small.hello} {a.big.world} !', {a: {small: {hello: 'hello'}, big: {world: 'WORLD'}}}) // hello WORLD !
ts('Hello {world} !', {}) // Hello {world} !
```
