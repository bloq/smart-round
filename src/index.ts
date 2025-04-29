import Big, { BigSource } from "big.js";

import { RoundingMode, toBigJsRoundingModes } from "./roundingModes.js";

type Options = {
  locale?: string;
  roundingMode?: RoundingMode;
  shouldFormat?: boolean;
};

const getDecimalPlaces = (bigJsNumber: Big) =>
  bigJsNumber.toFixed().split(".")[1]?.length ?? 0;

const parse = function ({
  input,
  maxDecimals,
  maxPrecision,
  minDecimals,
}: {
  input: BigSource;
  maxDecimals: number;
  maxPrecision: number;
  minDecimals: number;
}) {
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
  if (typeof input === "number" && (isNaN(input) || !isFinite(input))) {
    throw new Error("input should be a valid number");
  }

  try {
    const bigJsNumber = new Big(input.toString().replaceAll(",", ""));
    return bigJsNumber;
  } catch {
    throw new Error("input should be a valid number");
  }
};

export const smartRound = (
  maxPrecision: number,
  minDecimals: number,
  maxDecimals: number,
) =>
  function (input: BigSource, options?: Options) {
    const {
      locale = "en-US",
      // Big Number default's, but just to make it explicit
      roundingMode = "round-half-up",
      shouldFormat = false,
    } = options ?? {};

    const bigJsNumber = parse({
      input,
      maxDecimals,
      maxPrecision,
      minDecimals,
    });

    // Calculate how much to reduce the precision
    // The array of digits is the precision
    const adjustment = Math.max(bigJsNumber.c.length - maxPrecision, 0);

    // Calculate how much to reduce the decimals
    const decimals = Math.max(
      getDecimalPlaces(bigJsNumber) - adjustment,
      minDecimals,
    );

    const newDecimals = Math.min(decimals, maxDecimals);

    const string = bigJsNumber.toFixed(
      newDecimals,
      toBigJsRoundingModes(roundingMode),
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
