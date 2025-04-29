# smart-round

![NPM Version](https://img.shields.io/npm/v/smart-round)![npm bundle size](https://img.shields.io/bundlephobia/minzip/smart-round)

Round big numbers with arbitrary precision.

## Installation

```sh
npm install --save smart-round
```

## Usage

The module exports a function that let you initialize a rounder function.

### `smartRound(maxPrecision, minDecimals, maxDecimals)`

`maxPrecision`: Amount of significant digits to return.
`minDecimals`: Minimum amount of decimals to return.
`maxDecimals`: Maximum amount of decimals to return.

### `rounder(number, shouldFormat)`

`input`: The value to round. Accepts any type supported by [`bignumber.js`](https://github.com/MikeMcl/bignumber.js) package.
`options`: An optional object to customize the formatting:

- `options.locale`: Optional. Format used to format when `options.shouldFormat`is true. Defaults to `en-US`.
- `options.roundingMode` Optional. Specifies the rounding method. Accepted values: `round-up`, `round-down` ,`round-ceil`, `round-floor`, `round-half-up`, `round-half-down`, `round-half-even`, `round-half-ceil`, `round-half-floor`. Defaults to `round-half-up`.
- `options.shouldFormat`: Optional. Defaults to `false`. Indicates whether the string should be formatted using [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat),

## Example

```js
import { smartRound } from "smart-round";

const rounder1 = smartRound(6, 0, 6);

console.log(rounder1("1234.56789")); // '1234.57'
console.log(rounder1("1234.56789", { shouldFormat: true })); // '1,234.56'

const rounder2 = smartRound(4, 2, 6);

console.log(rounder2("1234", { shouldFormat: true })); // '1,234.00'
console.log(rounder2("0.000123456", { shouldFormat: true })); // '0.000123'
```
