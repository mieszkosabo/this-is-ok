import { describe, expect, expectTypeOf, test, vitest } from "vitest";
import { of, from, fromThrowable, Do } from "./fns";
import { Result, err, ok } from "./result";

describe("Result fns", () => {
  test("of", () => {
    expect(of(42, "error").unwrap()).toBe(42);
    expect(of({}, "error").unwrap()).toEqual({});
    expect(of(NaN, "error").unwrap()).toEqual(NaN);
    expect(of("", "error").unwrap()).toEqual("");

    expect(of(null, "error").isErr).toBe(true);
    expect(of(undefined, "error").isErr).toBe(true);

    const fun = (): string | null => {
      return null;
    };

    const a = fun();
    expectTypeOf(of(a, "error")).toEqualTypeOf<Result<string, string>>();
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

  test("Do", () => {
    const fn = vitest.fn();
    const res = Do(() => {
      const a = of(42, "error").bind();
      fn();
      const b = (err("aaa") as Result<number, string>).bind();
      fn();
      return of(a + b, "bbb");
    });

    expectTypeOf(res).toEqualTypeOf<Result<number, string>>();
    expect(res.isErr).toBe(true);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("Do with Error class", () => {
    const fn = vitest.fn();
    const res = Do(() => {
      const a = of(42, new Error("error")).bind();
      fn();
      const b = (err(new Error("aaa")) as Result<number, Error>).bind();
      fn();
      return of(a + b, new Error("bbb"));
    });

    expectTypeOf(res).toEqualTypeOf<Result<number, Error>>();
    expect(res.isErr).toBe(true);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

test("async Do", async () => {
  const asyncFn = vitest.fn(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    return ok(42);
  });

  const res = await Do(async () => {
    const a = (await asyncFn()).bind();
    const b = (err("error") as Result<number, string>).bind();
    return of(a + b, "error");
  });

  expectTypeOf(res).toEqualTypeOf<Result<number, string>>();
  expect(res.isErr).toBe(true);
  expect(asyncFn).toHaveBeenCalledTimes(1);
});
