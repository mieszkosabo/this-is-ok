import { expect, expectTypeOf, test, vitest } from "vitest";
import { Do, from, of } from "./fns";
import { Option, none } from "./option";

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
