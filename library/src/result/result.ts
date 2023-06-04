import { Option, none, some } from "../option";

export type Result<T, E> = (
  | { readonly variant: "ok"; readonly value: T }
  | { readonly variant: "err"; readonly error: E }
) & {
  /**
   * Property that is `true` if the result is Ok.
   * @example
   * ```ts
   * expect(ok(42).isOk).toBe(true)
   * expect(err("error").isOk).toBe(false)
   * ```
   * */
  readonly isOk: boolean;

  /**
   *  Returns `true` if the result is a Ok variant and the value inside
   *  of it matches a predicate.
   *
   * @example
   * ```ts
   *  expect(some(42).isSomeAnd((v) => v % 2)).toBe(true)
   *  expect(some(42).isSomeAnd((v) => v > 100)).toBe(true)
   * ```
   */
  isOkAnd: (predicate: (value: T) => boolean) => boolean;

  /**
   * Property that is `true` if the result is Err.
   * @example
   * ```ts
   * expect(ok(42).isErr).toBe(false)
   * expect(err("error").isErr).toBe(true)
   * ```
   * */
  readonly isErr: boolean;

  /**
   *  Returns `true` if the result is a Err variant and the value inside
   *  of it matches a predicate.
   *
   * @example
   * ```ts
   *  expect(some(42).isSomeAnd((v) => v % 2)).toBe(true)
   *  expect(some(42).isSomeAnd((v) => v > 100)).toBe(true)
   * ```
   */
  isErrAnd: (predicate: (value: T) => boolean) => boolean;

  /**
   * Converts from Result<T, E> to Option<T> discarding the error, if any.
   *
   * @example
   * ```ts
   * expect(ok(42).ok()).toEqual(some(42))
   * expect(err("error").ok()).toEqual(none)
   * ```
   */
  ok: () => Option<T>;

  /**
   * Converts from Result<T, E> to Option<E> discarding the error, if any.
   *
   * @example
   * ```ts
   * expect(ok(42).ok()).toEqual(some(42))
   * expect(err("error").ok()).toEqual(none)
   * ```
   */
  err: () => Option<T>;

  /**
   *  Returns the inner value. Useful for situations where if the
   *  result is a `Err` then there is no use to continue running the program.
   *  The message can be used for debugging purposes.
   *
   * @param message the message to throw it the option is a `Err` variant.
   * @throws throws the given message if the option is a `Err` variant.
   *
   * @example
   * ```ts
   *  expect(ok(42).expect("should be a number")).toBe(42)
   *  expect(err("error").expect("this will throw")).toThrow()
   * ```
   */
  expect: (message: string) => T;

  /**
   *  Returns the Ok value or throws an Error if the result is a `Err` variant.
   *
   * @throws throws if the option is a `None` variant.
   *
   * @example
   * ```ts
   *  expect(ok(42).unwrap()).toBe(42)
   *  expect(err("error").unwrap().toThrow()
   * ```
   */
  unwrap: () => T;

  /**
   *  Returns the contained Err value or throws and error if the result is a `Ok` variant.
   *
   * @param message the message to throw it the option is a `Ok` variant.
   * @throws throws the given message if the option is a `Ok` variant.
   *
   * @example
   * ```ts
   *  expect(err(42).expectErr("should be a number")).toBe(42)
   *  expect(ok(42).expectErr("this will throw")).toThrow()
   * ```
   */
  expectErr: (message: string) => T;

  /**
   *  Returns the contained Err value or throws and error if the result is a `Ok` variant.
   *
   * @throws throws if the option is a `None` variant.
   *
   * @example
   * ```ts
   *  expect(err("error").unwrapErr()).toBe(42)
   *  expect(ok(42).unwrapErr().toThrow()
   * ```
   */
  unwrapErr: () => T;

  /**
   *  Returns the Ok value or the provided default value.
   *
   * @example
   * ```ts
   *  expect(ok(42).unwrapOr(1)).toBe(42)
   *  expect(err("error").unwrapOr(1).toBe(1)
   * ```
   */
  unwrapOr: (defaultValue: T) => T;

  /**
   *  Returns the Ok value or computes it from a function.
   *
   * @example
   * ```ts
   *  expect(ok(42).unwrapOrElse(() => 1)).toBe(42)
   *  expect(err("error").unwrapOrElse(() => 1).toBe(1)
   * ```
   */
  unwrapOrElse: (defaultValueFun: () => T) => T;

  /**
   * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value,
   * leaving an Err value untouched.
   *
   * @example
   * ```ts
   *  expect(ok(42).map((x) => x + 1).unwrap()).toBe(43)
   *  expect(err("error").map((x) => x + 1).isNone()).toBe(true)
   * ```
   */
  map: <U>(f: (value: T) => U) => Result<U, E>;

  /**
   *  Returns the provided default (if Err), or applies
   *  a function to the contained value (if Ok),
   *
   * @example
   * ```ts
   *  expect(ok(42).mapOr(10, (x) => x + 1)).toBe(43)
   *  expect(error("error").mapOr(10, (x) => x + 1)).toBe(11)
   * ```
   */
  mapOr: <U>(defaultValue: U, f: (value: T) => U) => U;

  /**
   *  Maps a Result<T, E> to U by applying fallback function default
   *  to a contained Err value, or function f to a contained Ok value.
   *
   * @example
   * ```ts
   *  expect(ok(42).mapOrElse(() => 10, (x) => x + 1))).toBe(43)
   *  expect(error("error").mapOrElse(() => 10, (x) => x + 1))).toBe(11)
   * ```
   */
  mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U;

  /**
   * Maps a Result<T, E> to Result<T, F> by applying a function
   * to a contained Err value, leaving an Ok value untouched.
   *
   * @example
   * ```ts
   *  expect(ok(42).map((x) => x + 1).unwrap()).toBe(43)
   *  expect(err("error").map((x) => x + 1).isNone()).toBe(true)
   * ```
   */
  mapErr: <U>(f: (value: E) => U) => Result<T, U>;

  /**
   * Returns res if the result is Ok, otherwise returns the Err value of self.
   */
  and: <U>(b: Result<U, E>) => Result<U, E>;

  /**
   *  Returns res if the result is Err, otherwise returns the Ok value of self.
   */
  or: <F>(b: Result<T, F>) => Result<T, F>;

  /**
   * Returns the option if it contains a value,
   *  otherwise calls f and returns the result.
   */
  orElse: <F>(f: () => Result<T, F>) => Result<T, F>;

  andThen: <U>(f: (value: T) => Result<U, E>) => Result<U, E>;
  flatMap: <U>(f: (value: T) => Result<U, E>) => Result<U, E>;

  do: <U, F>(f: (value: T) => Result<U, F>) => Result<U, F>;
  bind: () => T;
  b: () => T;
};

export const ok = <T>(value: T): Result<T, any> => {
  const unwrap = () => value;
  const flatMap = <U>(f: (value: T) => Result<U, any>) => f(value);

  return {
    variant: "ok",
    value,
    isOk: true,
    isOkAnd: (f) => f(value),
    isErr: false,
    isErrAnd: () => false,
    ok: () => some(value),
    err: () => none,
    expect: unwrap,
    unwrap,
    expectErr: (message) => {
      throw new Error(message);
    },
    unwrapErr: () => {
      throw new Error("called `Result.unwrapErr()` on an `Ok` value");
    },
    unwrapOr: unwrap,
    unwrapOrElse: unwrap,
    map: (f) => ok(f(value)),
    mapOr: (_, f) => f(value),
    mapOrElse: (_, f) => f(value),
    mapErr: (_) => ok(value),
    and: (b) => b,
    or: () => ok(value),
    orElse: () => ok(value),
    andThen: flatMap,
    flatMap,
    do: <U, F>(f: (value: T) => Result<U, F>) => {
      try {
        return f(value);
      } catch (e) {
        return err(e) as Result<any, F>;
      }
    },
    bind: () => value,
    b: () => value,
  };
};

export const err = <E>(error: E): Result<any, E> => {
  const unwrap = () => {
    throw new Error("called `Result.unwrap()` on an `Err` value: " + error);
  };

  const bind = () => {
    throw error;
  };

  return {
    variant: "err",
    error,
    isOk: false,
    isOkAnd: () => false,
    isErr: true,
    isErrAnd: (p) => p(error),
    ok: () => none,
    err: () => some(error),
    expect: unwrap,
    unwrap,
    expectErr: () => error,
    unwrapErr: () => error,
    unwrapOr: (defaultValue) => defaultValue,
    unwrapOrElse: (defaultValueFun) => defaultValueFun(),
    map: () => err(error),
    mapOr: (defaultValue, f) => f(defaultValue),
    mapOrElse: (defaultValueFn, f) => f(defaultValueFn()),
    mapErr: (f) => err(f(error)),
    and: () => err(error),
    or: (res) => res,
    orElse: (f) => ok(f()),
    andThen: () => err(error),
    flatMap: () => err(error),
    do: () => {
      return err(error) as any;
    },
    bind,
    b: bind,
  };
};
