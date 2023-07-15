import { Result, err, ok } from "../result";

export type NoneVariant = {
  readonly variant: "none";
  isSome: false;
  isNone: true;
} & OptionProperties<any>;

export type SomeVariant<T> = {
  readonly variant: "some";
  readonly value: T;
  isSome: true;
  isNone: false;
} & OptionProperties<T>;

export type Option<T> = NoneVariant | SomeVariant<T>;

type OptionProperties<T> = {
  /**
   *  Property that is `true` if the option is a `Some` variant and `false` otherwise.
   *
   * @example
   * ```ts
   *  expect(some(3).isSome).toBe(true)
   *  expect(none.isSome).toBe(false)
   * ```
   */
  isSome: boolean;

  /**
   *  Returns true if the option is a Some variant and the value inside
   *  of it matches a predicate.
   *
   * @example
   * ```ts
   *  expect(some(42).isSomeAnd((v) => v % 2)).toBe(true)
   *  expect(some(42).isSomeAnd((v) => v > 100)).toBe(true)
   * ```
   */
  isSomeAnd: (predicate: (value: T) => boolean) => boolean;

  /**
   *  Property that is `true` if the option is a `None` variant and `false` otherwise.
   *
   * @example
   * ```ts
   *  expect(none.isNone).toBe(true)
   *  expect(some(42).isNone).toBe(false)
   * ```
   */
  isNone: boolean;

  /**
   *  Returns the inner value. Useful for situations where if the
   *  option is a `None` then there is no tap to continue running the program.
   *  The message can be used for debugging purposes.
   *
   * @param message the message to throw it the option is a `None` variant.
   * @throws throws the given message if the option is a `None` variant.
   *
   * @example
   * ```ts
   *  expect(some(42).expect("should be a number")).toBe(42)
   *  expect(none.expect("this will throw")).toThrow()
   * ```
   */
  expect: (message: string) => T;

  /**
   *  Returns the inner value or throws an Error if the option is a `None` variant.
   *
   * @throws throws if the option is a `None` variant.
   *
   * @example
   * ```ts
   *  expect(some(42).unwrap()).toBe(42)
   *  expect(none.unwrap().toThrow()
   * ```
   */
  unwrap: () => T;

  /**
   *  Returns the inner value or the provided default value.
   *
   * @example
   * ```ts
   *  expect(some(42).unwrapOr(1)).toBe(42)
   *  expect(none.unwrapOr(1).toBe(1)
   * ```
   */
  unwrapOr: (defaultValue: T) => T;

  /**
   *  Returns the inner value or computes it from a function.
   *
   * @example
   * ```ts
   *  expect(some(42).unwrapOrElse(() => 1)).toBe(42)
   *  expect(none.unwrapOrElse(() => 1).toBe(1)
   * ```
   */
  unwrapOrElse: (defaultValueFun: () => T) => T;

  /**
   *  Maps an Option<T> to Option<U> by applying a function to a contained
   *  value (if Some) or returns None (if None).
   *
   * @example
   * ```ts
   *  expect(some(42).map((x) => x + 1).unwrap()).toBe(43)
   *  expect(none.map((x) => x + 1).isNone()).toBe(true)
   * ```
   */
  map: <U>(f: (value: T) => U) => Option<U>;

  /**
   *  Returns the provided default result (if none),
   *  or applies a function to the contained value (if any).
   *
   * @example
   * ```ts
   *  expect(some(42).mapOr(10, (x) => x + 1).unwrap()).toBe(43)
   *  expect(none.mapOr(10, (x) => x + 1).unwrap()).toBe(11)
   * ```
   */
  mapOr: <U>(defaultValue: U, f: (value: T) => U) => U;

  /**
   *  Computes a default function result (if none),
   *  or applies a different function to the contained value (if any).
   *
   * @example
   * ```ts
   *  expect(some(42).mapOrElse(() => 10, (x) => x + 1)).unwrap()).toBe(43)
   *  expect(none.mapOrElse(() => 10, (x) => x + 1)).unwrap()).toBe(11)
   * ```
   */
  mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U;

  okOr: <E>(err: E) => Result<T, E>;
  okOrElse: <E>(f: () => E) => Result<T, E>;

  /**
   *  Returns None if the option is None, otherwise returns `b`.
   *
   * @example
   * ```ts
   *  expect(some(42).and(some(1)).unwrap()).toBe(1)
   *  expect(none.and(some(1)).isNone).toBe(true)
   * ```
   */
  and: <U>(b: Option<U>) => Option<U>;

  /**
   *  Returns None if the option is None, otherwise returns `b`.
   *
   * @example
   * ```ts
   *  expect(some(42).or(some(1)).unwrap()).toBe(43)
   *  expect(none.or(some(1)).unwrap()).toBe(1)
   * ```
   */
  or: (b: Option<T>) => Option<T>;

  /**
   * Returns the option if it contains a value,
   *  otherwise calls f and returns the result.
   *
   * @example
   * ```ts
   * expect(some(42).orElse(() => some(1)).unwrap()).toBe(42)
   * expect(none.orElse(() => some(1)).unwrap()).toBe(1)
   * ```
   */
  orElse: (f: () => Option<T>) => Option<T>;

  /**
   *  Returns None if the option is None, otherwise calls
   *  f with the wrapped value and returns the result.
   *
   * @alias andThen
   *
   * @example
   * ```ts
   *  expect(some(42).flatMap(x => some(x + 1)).unwrap()).toBe(43)
   *  expect(some(42).flatMap(x => none).isNone()).toBe(true)
   * ```
   */
  flatMap: <U>(f: (value: T) => Option<U>) => Option<U>;

  /**
   *  Returns None if the option is None, otherwise calls
   *  f with the wrapped value and returns the result.
   *
   * @alias flatMap
   *
   * @example
   * ```ts
   *  expect(some(42).andThen(x => some(x + 1)).unwrap()).toBe(43)
   *  expect(some(42).andThen(x => none).isNone()).toBe(true)
   * ```
   */
  andThen: <U>(f: (value: T) => Option<U>) => Option<U>;

  /**
   *  Runs the given void function with the inner value if the option is a `Some` variant
   *  or does nothing if the option is a `None` variant.
   *
   * @alias flatMap
   *
   * @example
   * ```ts
   *  expect(some(42).andThen(x => some(x + 1)).unwrap()).toBe(43)
   *  expect(some(42).andThen(x => none).isNone()).toBe(true)
   * ```
   */
  tap: <F extends void | Promise<void>>(f: (value: T) => F) => F;

  /**
   * Returns `None` if the option is `None`,
   * otherwise returns `None` if the predicate `predicate` returns `false` when applied to the contained
   * value, otherwise returns the `Option<T>`.
   *
   * @example
   * ```ts
   * expect(some(42).filter(x => x > 10).unwrap()).toBe(42)
   * expect(some(42).filter(x => x < 10).isNone()).toBe(true)
   * ```
   */
  filter: (predicate: (arg: T) => boolean) => Option<T>;

  /**
   * 
   * @example
   * ```ts
   * expect(
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
   * ```
   */
  match: <U>(pattern: { some: (value: T) => U; none: () => U }) => U;

  /**
   * Lets you simulate a do-notation known from functional languages
   * with the Option monad.
   * 
   * @example
     expect(
      some(1)
        .do((value) => {
          const a = value;
          const b = some(2).bind();
          const c = some(3).bind();
          return some(a + b + c);
        })
        .unwrap()
    ).toBe(6);
   *
   */
  do: <U>(f: (value: T) => Option<U>) => Option<U>;
  bind: () => T;
  b: () => T;
};

export const none: Option<any> = Object.freeze({
  variant: "none",
  isSome: false,
  isSomeAnd: () => false,
  isNone: true,
  expect: (message) => {
    throw new Error(`Error: ${message}`);
  },
  unwrap: () => {
    throw new Error("Error: called `.unwrap()` on none");
  },
  unwrapOr: <T>(defaultValue: T) => defaultValue,
  unwrapOrElse: <T>(getDefaultValue: () => T) => getDefaultValue(),
  map: () => none,
  mapOr: (defaultValue) => defaultValue,
  mapOrElse: (defaultValue) => defaultValue(),
  and: () => none,
  flatMap: () => none,
  andThen: () => none,
  filter: () => none,
  okOr: (error) => err(error),
  okOrElse: (error) => err(error()),
  or: (b) => b,
  orElse: (f) => f(),
  tap: <F extends void | Promise<void>>(f: (_: any) => F): F => {
    return undefined as any;
  },
  match: (pattern) => pattern.none(),
  do: () => none,
  bind: () => {
    throw "bind";
  },
  b: () => {
    throw "bind";
  },
});

export const some = <T>(value: T): Option<T> => {
  const flatMap = <U>(f: (value: T) => Option<U>): Option<U> => f(value);
  const unwrap = (): T => value;

  return {
    variant: "some",
    value,
    isSome: true,
    isSomeAnd: (predicate) => predicate(value),
    isNone: false,
    expect: unwrap,
    unwrap,
    unwrapOr: unwrap,
    unwrapOrElse: unwrap,
    map: (f) => some(f(value)),
    mapOr: (_, f) => f(value),
    mapOrElse: (defaultValue, f) => f(value),
    and: (b) => b,
    flatMap,
    andThen: flatMap,
    filter: (predicate) => (predicate(value) ? some(value) : none),
    or: () => some(value),
    okOr: () => ok(value),
    okOrElse: () => ok(value),
    orElse: () => some(value),
    tap: (f) => f(value),
    match: (pattern) => pattern.some(value),
    do: (f) => {
      try {
        return f(value);
      } catch (_) {
        return none;
      }
    },
    bind: unwrap,
    b: unwrap,
  };
};
