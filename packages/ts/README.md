# @studimax/ts

[![npm](https://img.shields.io/npm/v/@studimax/ts)](https://www.npmjs.com/package/@studimax/ts)
[![Code: TypeScript](https://img.shields.io/badge/made%20with-typescript-blue.svg?logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![Made By: StudiMax](https://img.shields.io/badge/made%20by-studimax-red.svg)](https://github.com/studimax)

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
