import { expect, test, describe, vitest, expectTypeOf } from "vitest";
import { ErrVariant, OkVariant, Result, err, ok } from "./result";

describe("Result", () => {
  const okVariant: Result<number, string> = ok(42);
  const errVariant: Result<number, string> = err("error");

  test("type narrowing", () => {
    const someResult: Result<number, string> = ok(42);
    if (someResult.isOk) {
      expectTypeOf(someResult).toEqualTypeOf<OkVariant<number, string>>();
    } else {
      expectTypeOf(someResult).toEqualTypeOf<ErrVariant<number, string>>();
    }

    if (someResult.isErr) {
      expectTypeOf(someResult).toEqualTypeOf<ErrVariant<number, string>>();
    } else {
      expectTypeOf(someResult).toEqualTypeOf<OkVariant<number, string>>();
    }
  });

  test("variant", () => {
    expect(okVariant.variant).toBe("ok");
    expect(errVariant.variant).toBe("err");
  });

  test("value and error", () => {
    expect((okVariant as OkVariant<any, any>).value).toBe(42);
    expect((errVariant as ErrVariant<any, any>).error).toBe("error");
  });

  test("isOk", () => {
    expect(okVariant.isOk).toBe(true);
    expect(errVariant.isOk).toBe(false);
  });

  test("isOkAnd", () => {
    expect(okVariant.isOkAnd((v) => v === 42)).toBe(true);
    expect(okVariant.isOkAnd((v) => v > 100)).toBe(false);
    expect(errVariant.isOkAnd((v) => v == 42)).toBe(false);
    expect(errVariant.isOkAnd((v) => v > 100)).toBe(false);
  });

  test("isErr", () => {
    expect(okVariant.isErr).toBe(false);
    expect(errVariant.isErr).toBe(true);
  });

  test("isErrAnd", () => {
    expect(okVariant.isErrAnd((e) => e === "error")).toBe(false);
    expect(okVariant.isErrAnd((e) => e === "something")).toBe(false);
    expect(errVariant.isErrAnd((e) => e === "error")).toBe(true);
    expect(errVariant.isErrAnd((e) => e === "something")).toBe(false);
  });

  test("ok", () => {
    const someOption = okVariant.ok();
    const noneOption = errVariant.ok();

    expect(someOption.isSome).toBe(true);
    expect(someOption.unwrap()).toBe(42);

    expect(noneOption.isNone).toBe(true);
  });

  test("err", () => {
    const someOption = okVariant.err();
    const noneOption = errVariant.err();

    expect(someOption.isSome).toBe(false);

    expect(noneOption.isSome).toBe(true);
    expect(noneOption.unwrap()).toBe("error");
  });

  test("expect", () => {
    expect(okVariant.expect("error")).toBe(42);
    expectTypeOf(okVariant.expect("error")).toEqualTypeOf<number>();
    expect(() => errVariant.expect("error")).toThrow("error");
    expectTypeOf(errVariant.expect).toEqualTypeOf<(a: string) => number>();
  });

  test("unwrap", () => {
    expect(okVariant.unwrap()).toBe(42);
    expectTypeOf(okVariant.unwrap()).toEqualTypeOf<number>();

    expect(() => errVariant.unwrap()).toThrow();
    expectTypeOf(errVariant.unwrap).toEqualTypeOf<() => number>();
  });

  test("unwrapOr", () => {
    expect(okVariant.unwrapOr(0)).toBe(42);
    expect(errVariant.unwrapOr(0)).toBe(0);
  });

  test("expectErr", () => {
    expect(() => okVariant.expectErr("yo")).toThrow("yo");
    expect(errVariant.expectErr("error")).toBe("error");
  });

  test("unwrapErr", () => {
    expect(() => okVariant.unwrapErr()).toThrow();
    expect(errVariant.unwrapErr()).toBe("error");
  });

  test("unwrapOrElse", () => {
    expect(okVariant.unwrapOrElse(() => 0)).toBe(42);
    expect(errVariant.unwrapOrElse(() => 0)).toBe(0);
  });

  test("map", () => {
    expect(okVariant.map((v) => v + 1).unwrap()).toBe(43);
    expect(errVariant.map((v) => v + 1).unwrapErr()).toBe("error");
  });

  test("mapOr", () => {
    expect(okVariant.mapOr(0, (v) => v + 1)).toBe(43);
    expect(errVariant.mapOr(0, (v) => v + 1)).toBe(0);
  });

  test("mapOrElse", () => {
    expect(
      okVariant.mapOrElse(
        () => 0,
        (v) => v + 1
      )
    ).toBe(43);
    expect(
      errVariant.mapOrElse(
        () => 0,
        (v) => v + 1
      )
    ).toBe(0);
  });

  test("mapErr", () => {
    expect(okVariant.mapErr((e) => e + "1").unwrap()).toBe(42);
    expect(errVariant.mapErr((e) => e + "1").unwrapErr()).toBe("error1");
  });

  test("and", () => {
    expect(okVariant.and(ok(1)).unwrap()).toBe(1);
    expect(okVariant.and(err("error")).unwrapErr()).toBe("error");
    expect(errVariant.and(ok(1)).unwrapErr()).toBe("error");
    expect(errVariant.and(err("error1")).unwrapErr()).toBe("error");
  });

  test("or", () => {
    expect(okVariant.or(ok(1)).unwrap()).toBe(42);
    expect(okVariant.or(err("error")).unwrap()).toBe(42);
    expect(errVariant.or(ok(1)).unwrap()).toBe(1);
    expect(errVariant.or(err("error1")).unwrapErr()).toBe("error1");
  });

  test("orElse", () => {
    expect(okVariant.orElse(() => ok(1)).unwrap()).toBe(42);
    expect(okVariant.orElse(() => err("error")).unwrap()).toBe(42);
    expect(errVariant.orElse(() => ok(1)).unwrap()).toBe(1);
    expect(errVariant.orElse(() => err("error1")).unwrapErr()).toBe("error1");
  });

  test("andThen", () => {
    expect(okVariant.andThen((v) => ok(v + 1)).unwrap()).toBe(43);
    expect(okVariant.andThen((v) => err("error")).unwrapErr()).toBe("error");
    expect(errVariant.andThen((v) => ok(v + 1)).unwrapErr()).toBe("error");
    expect(errVariant.andThen((v) => err("error1")).unwrapErr()).toBe("error");
  });

  test("flatMap", () => {
    // same as andThen
    expect(okVariant.flatMap((v) => ok(v + 1)).unwrap()).toBe(43);
    expect(okVariant.flatMap((v) => err("error")).unwrapErr()).toBe("error");
    expect(errVariant.flatMap((v) => ok(v + 1)).unwrapErr()).toBe("error");
    expect(errVariant.flatMap((v) => err("error1")).unwrapErr()).toBe("error");
  });

  test("match", () => {
    const okVariant2 = okVariant as Result<number, string>;
    const errVariant2 = err("error") as Result<number, string>;

    expect(
      okVariant2.match({
        ok: (v) => v + 1,
        err: (e) => e.length + 1,
      })
    ).toBe(43);
    expect(
      errVariant2.match({
        ok: (v) => v + 1,
        err: (e) => e.length + 1,
      })
    ).toBe(6);
  });

  test("tap", () => {
    let value = 0;

    ok(3).tap((d) => {
      value += d;
    });

    expect(value).toBe(3);

    err("aaa").tap((d) => {
      value += d;
    });

    expect(value).toBe(3);
  });

  test("variance", () => {
    type A = { variant: "a"; value: number } | { variant: "b"; val: string };

    const fun = (): Result<A, string> => {
      const a = ok({ variant: "b" as const, val: "aa" } as const);

      return a;
    };
  });

  test("variance for err", () => {
    const fun = (): Result<number, "a" | "b"> => {
      const a = err("a" as const);

      return a;
    };
  });
});
