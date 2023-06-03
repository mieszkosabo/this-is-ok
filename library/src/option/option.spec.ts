import { describe, expect, it, test, vitest } from "vitest";

import { Option, from, none, some } from "./option";

describe("Option", () => {
  test("from", () => {
    expect(from(42).unwrap()).toBe(42);
    expect(from({}).unwrap()).toEqual({});
    expect(from(NaN).unwrap()).toEqual(NaN);
    expect(from("").unwrap()).toEqual("");
    expect(from(null).isNone()).toBe(true);
    expect(from(undefined).isNone()).toBe(true);
  });

  it("map", () => {
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
        .map((d) => d + 1)
        .isNone()
    ).toBe(true);
  });

  it("flatMap", () => {
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
        .flatMap((d) => getVariant(d + 1, "some"))
        .flatMap((d) => getVariant(d + 1, "none"))
        .flatMap((d) => getVariant(d + 1, "some"))
        .isNone()
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

  const a = some(3).match({
    some: (d) => d + 1,
    none: () => 0,
  });

  // const b = some(3).match({
  //   some: (d) => {
  //     console.log("some");
  //   },
  //   none: () => {
  //     console.log("none");
  //   },
  // });

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
          const c = some("hello").bind();
          return some(c.repeat(a + b));
        })
        .unwrap()
    ).toBe("hellohellohello");

    const fn = vitest.fn();
    expect(
      some(1)
        .do((value) => {
          const a = value;
          fn();
          const b = some(2).bind();
          fn();
          const c = (none as Option<number>).bind();
          fn();
          const d = some(3).bind();
          fn();
          return some(a + b + c + d);
        })
        .isNone()
    ).toBe(true);

    expect(fn.mock.calls.length).toBe(2);
  });
});
