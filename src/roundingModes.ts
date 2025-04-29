import { RoundingMode as BigJsRoundingMode } from "big.js";

// Use this to allow easier configuration for consumers, without them needing
// to import Big.js

const roundingModes = [
  "round-down",
  "round-half-up",
  "round-half-even",
  "round-up",
] as const;

export type RoundingMode = (typeof roundingModes)[number];

export const toBigJsRoundingModes = (roundingMode: RoundingMode) =>
  roundingModes.findIndex((r) => r === roundingMode)! as BigJsRoundingMode;
