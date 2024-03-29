import { describe, expect, expectTypeOf, test, vitest } from "vitest";
import { Do, DoAsync, from, of, sequence } from "./fns";
import { Option, none } from "./option";

test("of", () => {
  expect(of(42).unwrap()).toBe(42);
  expect(of({}).unwrap()).toEqual({});
  expect(of(NaN).unwrap()).toEqual(NaN);
  expect(of("").unwrap()).toEqual("");
  expect(of(null).isNone).toBe(true);
  expect(of(undefined).isNone).toBe(true);

  const fun = (): string | null => {
    return null;
  };

  const a = fun();
  expectTypeOf(of(a)).toEqualTypeOf<Option<string>>();
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

test("Do", () => {
  const fn = vitest.fn();
  const res = Do(() => {
    const a = of(42).bind();
    fn();
    const b = (none as Option<number>).bind();
    fn();
    return of(a + b);
  });

  expectTypeOf(res).toEqualTypeOf<Option<number>>();
  expect(res.isNone).toBe(true);
  expect(fn).toHaveBeenCalledTimes(1);
});

test("Do async", async () => {
  const asyncFn = vitest.fn(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return of(42);
  });

  const res = await DoAsync(async () => {
    const a = (await asyncFn()).bind();
    const b = (none as Option<number>).bind();
    return of(a + b);
  });

  expectTypeOf(res).toEqualTypeOf<Option<number>>();
  expect(res.isNone).toBe(true);
  expect(asyncFn).toHaveBeenCalledTimes(1);
});

describe("sequence", () => {
  test("empty", () => {
    expect(sequence([]).unwrap()).toEqual([]);
  });

  test("happy case", () => {
    expect(sequence([of(42), of(43)]).unwrap()).toEqual([42, 43]);
  });

  test("bad case", () => {
    expect(sequence([of(42), none, of(43)]).isNone).toBe(true);
  });
});
