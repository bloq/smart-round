import { describe, expect, it } from "vitest";

import { smartRound } from "../src/index";

const cases = [
  [
    {
      config: [6, 0, 6],
      input: 1234.56789,
      options: { shouldFormat: false },
      output: "1234.57",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 1234.56789,
      options: { shouldFormat: true },
      output: "1,234.57",
    },
  ],
  [
    {
      config: [4, 2, 6],
      input: 1234,
      options: { shouldFormat: true },
      output: "1,234.00",
    },
  ],
  [
    {
      config: [4, 2, 6],
      input: 0.000123987,
      options: { shouldFormat: true },
      output: "0.000124",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 0,
      output: "0",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 100,
      output: "100",
    },
  ],
  [
    {
      config: [4, 0, 6],
      input: 1234,
      options: { shouldFormat: true },
      output: "1,234",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 30.123456789,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "30.1234",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 1234.56789123456,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "1,234.56",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 0.01,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "0.01",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 0.00000001,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "0.000000",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 0.123456789,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "0.123456",
    },
  ],
  [
    {
      config: [6, 0, 6],
      input: 99999.123456789,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "99,999.1",
    },
  ],
  [
    {
      config: [6, 1, 6],
      input: 99999.123456789,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "99,999.1",
    },
  ],
  [
    {
      config: [6, 2, 6],
      input: 99999.123456789,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "99,999.12",
    },
  ],
  [
    {
      config: [6, 3, 6],
      input: 99999,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "99,999.000",
    },
  ],
  [
    {
      config: [4, 0, 2],
      input: 123456.123456789,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "123,456",
    },
  ],
  [
    {
      config: [4, 0, 2],
      input: 123456789.1234567,
      options: { roundingMode: "round-down", shouldFormat: true },
      output: "123,456,789",
    },
  ],
  [
    {
      config: [4, 3, 3],
      input: 1.45,
      output: "1.450",
    },
  ],
];

describe("smartRound", function () {
  // This is incorrectly flagged
  // eslint-disable-next-line @vitest/require-hook
  it.for(cases)(
    "should return $output for formatting $input",
    function ([{ config, input, options, output }]) {
      const [maxPrecision, minDecimals, maxDecimals] = config;
      const rounder = smartRound(maxPrecision, minDecimals, maxDecimals);
      // Test the input as a number
      expect(rounder(input, options)).toEqual(output);
      // Test the input as a string
      expect(rounder(input.toString(), options)).toEqual(output);
    },
  );

  it("should not allow negative maxPrecision", function () {
    const rounder = smartRound(-1, 1, 2);
    expect(() => rounder("1")).toThrowError(
      "maxPrecision should be positive larger than 1",
    );
  });

  it("should not allow zero maxPrecision", function () {
    const rounder = smartRound(0, 1, 2);
    expect(() => rounder("1")).toThrowError(
      "maxPrecision should be positive larger than 1",
    );
  });

  it("should not allow negative minDecimals", function () {
    const rounder = smartRound(1, -1, 2);
    expect(() => rounder("1")).toThrowError("minDecimals should be positive");
  });

  it("should not allow negative maxDecimals", function () {
    const rounder = smartRound(1, 1, -2);
    expect(() => rounder("1")).toThrowError("maxDecimals should be positive");
  });

  it("should not allow minDecimals smaller than maxDecimals", function () {
    const rounder = smartRound(1, 3, 2);
    expect(() => rounder("1")).toThrowError(
      "minDecimals should be larger than maxDecimals",
    );
  });

  it("should not allow non-valid numbers", function () {
    const rounder = smartRound(6, 3, 5);
    expect(() => rounder("A")).toThrowError("input should be a valid number");

    expect(() => rounder(Infinity)).toThrowError(
      "input should be a valid number",
    );

    expect(() => rounder(NaN)).toThrowError("input should be a valid number");
  });
});
