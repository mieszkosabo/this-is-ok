import { describe, expect, it } from "bun:test";

import { Option, none, some } from "./option";

describe("Option", () => {
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

  const b = some(3).match({
    some: (d) => {
      console.log("some");
    },
    none: () => {
      console.log("none");
    },
  });
});
