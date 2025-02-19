import { BigNumber } from "bignumber.js";

import { RoundingMode, toBigNumberRoundingModes } from "./roundingModes.js";

type Options = {
  locale?: string;
  roundingMode?: RoundingMode;
  shouldFormat?: boolean;
};

export const smartRound = (
  maxPrecision: number,
  minDecimals: number,
  maxDecimals: number,
) =>
  function (input: BigNumber.Value, options?: Options) {
    const {
      locale = "en-US",
      // Big Number default's, but just to make it explicit
      roundingMode = "round-half-up",
      shouldFormat = false,
    } = options ?? {};

    if (maxPrecision <= 0) {
      throw new Error("maxPrecision should be positive larger than 1");
    }
    if (minDecimals < 0) {
      throw new Error("minDecimals should be positive");
    }
    if (maxDecimals < 0) {
      throw new Error("maxDecimals should be positive");
    }
    if (minDecimals > maxDecimals) {
      throw new Error("minDecimals should be larger than maxDecimals");
    }

    const bn = new BigNumber(input);

    if (bn.isNaN() || !bn.isFinite()) {
      throw new Error("input should be a valid number");
    }
    // Calculate how much to reduce the precision
    const adjustment = Math.max(bn.precision() - maxPrecision, 0);

    // Calculate how much to reduce the decimals
    const decimals = Math.max(
      (bn.decimalPlaces() ?? 0) - adjustment,
      minDecimals,
    );

    const newDecimals = Math.min(decimals, maxDecimals);

    const string = bn.toFixed(
      newDecimals,
      toBigNumberRoundingModes(roundingMode),
    );

    if (!shouldFormat) {
      return string;
    }
    // formats using the ","
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: newDecimals,
      minimumFractionDigits: newDecimals,
      useGrouping: true,
      // @ts-expect-error NumberFormat.format accept strings, typings are wrong. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format#parameters
    }).format(string);
  };
