import { describe, expect, expectTypeOf, it, test, vitest } from "vitest";

import { NoneVariant, Option, SomeVariant, none, some } from "./option";

describe("Option", () => {
  const someVariant = some(42);
  const noneVariant = none as Option<number>;

  test("type narrowing", () => {
    if (someVariant.isSome) {
      expectTypeOf(someVariant).toEqualTypeOf<SomeVariant<number>>();
    } else {
      expectTypeOf(someVariant).toEqualTypeOf<NoneVariant<number>>();
    }

    if (someVariant.isNone) {
      expectTypeOf(someVariant).toEqualTypeOf<NoneVariant<number>>();
    } else {
      expectTypeOf(someVariant).toEqualTypeOf<SomeVariant<number>>();
    }
  });

  test("isSome", () => {
    expect(someVariant.isSome).toBe(true);
    expect(noneVariant.isSome).toBe(false);
  });

  test("isNone", () => {
    expect(someVariant.isNone).toBe(false);
    expect(noneVariant.isNone).toBe(true);
  });

  test("isSomeAnd", () => {
    expect(someVariant.isSomeAnd((v) => v === 42)).toBe(true);
    expect(someVariant.isSomeAnd((v) => v > 100)).toBe(false);
    expect(noneVariant.isSomeAnd((v) => v === 42)).toBe(false);
    expect(noneVariant.isSomeAnd((v) => v > 100)).toBe(false);
  });

  test("expect", () => {
    expect(someVariant.expect("error")).toBe(42);
    expectTypeOf(someVariant.expect("")).toEqualTypeOf<number>();
    expect(() => noneVariant.expect("error")).toThrow("error");
  });

  test("unwrap", () => {
    expect(someVariant.unwrap()).toBe(42);
    expectTypeOf(someVariant.unwrap()).toEqualTypeOf<number>();
    expect(() => noneVariant.unwrap()).toThrow();
  });

  test("unwrapOr", () => {
    expect(someVariant.unwrapOr(100)).toBe(42);
    expect(noneVariant.unwrapOr(100)).toBe(100);
  });

  test("unwrapOrElse", () => {
    expect(someVariant.unwrapOrElse(() => 100)).toBe(42);
    expect(noneVariant.unwrapOrElse(() => 100)).toBe(100);
  });

  test("map", () => {
    expect(
      some(3)
        .map((d) => d + 1)
        .unwrap()
    ).toEqual(4);

    expect(
      some(1)
        .map((d) => d * 8)
        .map((d) => d / 2)
        .map((d) => d + 1)
        .unwrap()
    ).toEqual(5);

    const someNone: Option<number> = none;

    expect(
      someNone
        .map((d) => d * 8)
        .map((d) => d / 2)
        .map((d) => d + 1).isNone
    ).toBe(true);
  });

  test("mapOrElse", () => {
    expect(
      some(3).mapOrElse(
        () => 100,
        (d) => d + 1
      )
    ).toEqual(4);

    expect(
      noneVariant.mapOrElse(
        () => 100,
        (d) => d + 1
      )
    ).toEqual(100);
  });

  test("mapOr", () => {
    expect(some(3).mapOr(100, (d) => d + 1)).toEqual(4);
    expect(noneVariant.mapOr(100, (d) => d + 1)).toEqual(100);
  });

  test("okOr", () => {
    expect(some(3).okOr("error").isOk).toBe(true);
    expect(some(3).okOr("error").unwrap()).toBe(3);
    expect(noneVariant.okOr("error").isErr).toBe(true);
    expect(noneVariant.okOr("error").unwrapErr()).toBe("error");
  });

  test("okOrElse", () => {
    expect(some(3).okOrElse(() => "error").isOk).toBe(true);
    expect(
      some(3)
        .okOrElse(() => "error")
        .unwrap()
    ).toBe(3);
    expect(noneVariant.okOrElse(() => "error").isErr).toBe(true);
    expect(noneVariant.okOrElse(() => "error").unwrapErr()).toBe("error");
  });

  test("and", () => {
    expect(some(3).and(some(4)).unwrap()).toBe(4);
    expect(some(3).and(none).isNone).toBe(true);
    expect(none.and(some(4)).isNone).toBe(true);
    expect(none.and(none).isNone).toBe(true);
  });

  test("or", () => {
    expect(some(3).or(some(4)).unwrap()).toBe(3);
    expect(some(3).or(none).unwrap()).toBe(3);
    expect(none.or(some(4)).unwrap()).toBe(4);
    expect(none.or(none).isNone).toBe(true);
  });

  test("orElse", () => {
    expect(
      some(3)
        .orElse(() => some(4))
        .unwrap()
    ).toBe(3);
    expect(
      some(3)
        .orElse(() => none)
        .unwrap()
    ).toBe(3);
    expect(none.orElse(() => some(4)).unwrap()).toBe(4);
    expect(none.orElse(() => none).isNone).toBe(true);
  });

  test("flatMap and andThen", () => {
    const getVariant = <T>(value: T, variant: "none" | "some"): Option<T> => {
      if (variant === "none") {
        return none;
      }
      return some(value);
    };

    expect(
      some(3)
        .flatMap((d) => getVariant(d + 1, "some"))
        .flatMap((d) => getVariant(d + 1, "some"))
        .flatMap((d) => getVariant(d + 1, "some"))
        .unwrap()
    ).toBe(6);

    expect(
      some(3)
        .andThen((d) => getVariant(d + 1, "some"))
        .andThen((d) => getVariant(d + 1, "some"))
        .andThen((d) => getVariant(d + 1, "some"))
        .unwrap()
    ).toBe(6);

    expect(
      some(3)
        .flatMap((d) => getVariant(d + 1, "some"))
        .flatMap((d) => getVariant(d + 1, "none"))
        .flatMap((d) => getVariant(d + 1, "some")).isNone
    ).toBe(true);

    expect(
      some(3)
        .andThen((d) => getVariant(d + 1, "some"))
        .andThen((d) => getVariant(d + 1, "none"))
        .andThen((d) => getVariant(d + 1, "some")).isNone
    ).toBe(true);
  });

  it("match", () => {
    expect(
      some(3).match({
        some: (d) => d + 1,
        none: () => 0,
      })
    ).toBe(4);

    expect(
      none.match({
        some: (d) => d + 1,
        none: () => 0,
      })
    ).toBe(0);
  });

  test("tap", () => {
    let value = 0;

    some(3).tap((d) => {
      value += d;
    });

    expect(value).toBe(3);

    none.tap((d) => {
      value += d;
    });

    expect(value).toBe(3);
  });

  test("tap async", async () => {
    let value = 0;

    await some(3).tap(async (d) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      value += d;
    });

    expect(value).toBe(3);
  });

  test("do", () => {
    expect(
      some(1)
        .do((value) => {
          const a = value;
          const b = some(2).bind();
          const c = some("hello").b();
          return some(c.repeat(a + b));
        })
        .unwrap()
    ).toBe("hellohellohello");

    const fn = vitest.fn();
    expect(
      some(1).do((value) => {
        const a = value;
        fn();
        const b = some(2).bind();
        fn();
        const c = (none as Option<number>).b();
        fn();
        const d = some(3).bind();
        fn();
        return some(a + b + c + d);
      }).isNone
    ).toBe(true);

    expect(
      some(1).do((value) => {
        (none as Option<number>).bind();
        return some(value);
      }).isNone
    ).toBe(true);

    expect(noneVariant.do(() => some(1)).isNone).toBe(true);

    expect(fn.mock.calls.length).toBe(2);
  });

  test("filter", () => {
    expect(
      some(3)
        .filter((d) => d === 3)
        .unwrap()
    ).toBe(3);
    expect(some(3).filter((d) => d === 4).isNone).toBe(true);
    expect(noneVariant.filter((d) => d === 3).isNone).toBe(true);
  });
});
