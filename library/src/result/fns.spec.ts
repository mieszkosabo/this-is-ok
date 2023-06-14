import { describe, expect, test } from "vitest";
import { of, from, fromThrowable } from "./fns";

describe("Result fns", () => {
  test("of", () => {
    expect(of(42, "error").unwrap()).toBe(42);
    expect(of({}, "error").unwrap()).toEqual({});
    expect(of(NaN, "error").unwrap()).toEqual(NaN);
    expect(of("", "error").unwrap()).toEqual("");

    expect(of(null, "error").isErr).toBe(true);
    expect(of(undefined, "error").isErr).toBe(true);
  });

  test("from", () => {
    expect(from(() => 42, "error").unwrap()).toBe(42);
    expect(from(() => ({}), "error").unwrap()).toEqual({});
    expect(from(() => NaN, "error").unwrap()).toEqual(NaN);
    expect(from(() => "", "error").unwrap()).toEqual("");

    expect(from(() => null, "error").isErr).toBe(true);
    expect(from(() => undefined, "error").isErr).toBe(true);

    expect(
      from(() => {
        throw "error";
      }, "error").isErr
    ).toBe(true);
  });

  test("fromThrowable", () => {
    expect(fromThrowable(() => 42).unwrap()).toBe(42);
    expect(fromThrowable(() => ({})).unwrap()).toEqual({});
    expect(fromThrowable(() => NaN).unwrap()).toEqual(NaN);
    expect(fromThrowable(() => "").unwrap()).toEqual("");

    expect(fromThrowable(() => null).unwrap()).toEqual(null);
    expect(fromThrowable(() => undefined).unwrap()).toEqual(undefined);

    const a = fromThrowable(() => {
      throw "error";
    });

    expect(a.unwrapErr()).toEqual(new Error("error"));

    const b = fromThrowable(() => {
      throw new Error("error");
    });

    expect(b.unwrapErr()).toEqual(new Error("error"));
  });
});
