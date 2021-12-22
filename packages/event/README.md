# @studimax/event

[![npm](https://img.shields.io/npm/v/@studimax/event)](https://www.npmjs.com/package/@studimax/event)
[![Code: TypeScript](https://img.shields.io/badge/made%20with-typescript-blue.svg?logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![Made By: StudiMax](https://img.shields.io/badge/made%20by-studimax-red.svg)](https://github.com/studimax)

A fully typed Node Event system.

## Installation
```bash
npm install @studimax/event
# or
yarn add @studimax/event
```

## Usage

Define an `EventMap` type that allows your IDE to autocomplete your event handlers and emitters.

```ts
import { EventEmitter } from '@studimax/event'
type MyEvents = {
    start: () => void;
    end: (at:Date) => void;
};
const emitter = new EventEmitter<MyEvents>();

emitter.on('start', () => {
    console.log('started');
});
emitter.on('end', (at:Date) => {
    console.log('ended at', at);
});

emitter.emit('start');
emitter.emit('end', new Date());
```
### SubEventEmitter
SubEventEmitter can receive events from his parent, but parent can't listen to events from his children.
```ts
import { EventEmitter } from '@studimax/event';

type MyEvents = {
    start: () => void;
    end: (at:Date) => void;
};
const emitter = new EventEmitter<MyEvents>();

const subEmitter = emitter.subEmitter();

emitter.on('start', () => {
    console.log('parent started');
});

subEmitter.on('start', () => {
    console.log('child started');
});

emitter.emit('start'); // parent and child received the event
subEmitter.emit('start'); // only child started received the event
```

### Additional methods
- `removeChildrenListener(event, listener)`: Remove listeners in children too of a specific event.
- `removeAllChildrenListeners(event?)`: Remove all listeners in children too of a specific event.
- `getChildren()`: Get all children EventEmitter.
- `hasChild(child)`: Check if a child EventEmitter is in the children list.
- `link(child)`: Link a child EventEmitter.
- `unlink(child)`: Unlink a child EventEmitter or all children if no child is specified.
- `isLinked()`: Check if a child EventEmitter is linked to his parent.
- `link(parent)`: Link to a parent EventEmitter.
- `unlink()`: Unlink from a parent EventEmitter.
