import { expect, test } from "vitest";
import { from, of } from "./fns";

test("of", () => {
  expect(of(42).unwrap()).toBe(42);
  expect(of({}).unwrap()).toEqual({});
  expect(of(NaN).unwrap()).toEqual(NaN);
  expect(of("").unwrap()).toEqual("");
  expect(of(null).isNone).toBe(true);
  expect(of(undefined).isNone).toBe(true);
});

test("from", () => {
  expect(from(() => 42).unwrap()).toBe(42);
  expect(from(() => ({})).unwrap()).toEqual({});
  expect(from(() => NaN).unwrap()).toEqual(NaN);
  expect(from(() => "").unwrap()).toEqual("");
  expect(from(() => null).isNone).toBe(true);
  expect(from(() => undefined).isNone).toBe(true);
  expect(from(() => {}).isNone).toBe(true);
  expect(
    from(() => {
      throw new Error("error");
    }).isNone
  ).toBe(true);
});
