# @studimax/elo

[![npm](https://img.shields.io/npm/v/@studimax/elo)](https://www.npmjs.com/package/@studimax/elo)
[![Code: TypeScript](https://img.shields.io/badge/made%20with-typescript-blue.svg?logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![Made By: StudiMax](https://img.shields.io/badge/made%20by-studimax-red.svg)](https://github.com/studimax)

Implementation of [Elo](https://en.wikipedia.org/wiki/Elo_rating_system) rating system.

## Installation
```bash
npm install @studimax/elo
# or
yarn add @studimax/elo
```

## Usage
### Calculate calculatePerformance
```ts
/**
* Calculates the probability to win based on the rating of the opponent.
* @param Ra Elo rating of hero A.
* @param Rb Elo rating of hero B.
*/
calculatePerformance(Ra: number, Rb: number): {Ea: number; Eb: number};
```
```ts
import Elo from '@studimax/elo';

const elo = new Elo();

/** Caclculate performance **/
const {Ea, Eb} = elo.calculatePerformance(1613, 1609);
// Ea: 0.506
// Eb: 0.494
```
### Calculate Rating
```ts
/**
* Calculates the expected score of a hero based on the rating of the other hero.
* @param Ra Elo rating of hero A.
* @param Rb Elo rating of hero B.
* @param S Expected score of hero A. (0 <= S <= 1)
*/
calculateRating(Ra: number, Rb: number, S = 1): {Rb: number; Ra: number};
```
```ts
const elo = new Elo({kFactor: 20});
const {Ra, Rb} = elo.calculateRating(1800, 2005, 1); // 1 = win
// Ra: ~1815
// Rb: ~1990
```
```ts
const elo = new Elo({kFactor: 20});
const {Ra, Rb} = elo.calculateRating(1800, 2005, 0.5); // 0.5 = draw
// Ra: ~1805
// Rb: ~2000
```
```ts
const elo = new Elo({kFactor: 20});
const {Ra, Rb} = elo.calculateRating(1800, 2005, 0); // 0 = loss
// Ra: ~1795
// Rb: ~2010
```
