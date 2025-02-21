import { BigNumber } from "bignumber.js";

// Use this to allow easier configuration for consumers, without them needing
// to import BigNumber

const roundingModes = [
  "round-up",
  "round-down",
  "round-ceil",
  "round-floor",
  "round-half-up",
  "round-half-down",
  "round-half-even",
  "round-half-ceil",
  "round-half-floor",
] as const;

export type RoundingMode = (typeof roundingModes)[number];

export const toBigNumberRoundingModes = (roundingMode: RoundingMode) =>
  roundingModes.findIndex((r) => r === roundingMode)! as BigNumber.RoundingMode;
