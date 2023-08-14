import { Option, none, some } from "../option";

export type OkVariant<T, E> = {
  readonly variant: "ok";
  readonly value: T;
  isOk: true;
  isErr: false;
} & ResultProperties<T, E>;

export type ErrVariant<T, E> = {
  readonly variant: "err";
  readonly error: E;
  isErr: true;
  isOk: false;
} & ResultProperties<T, E>;

export type Result<T, E> = OkVariant<T, E> | ErrVariant<T, E>;

export type ResultProperties<T, E> = {
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
  isErrAnd: <E1 extends E>(predicate: (value: E1) => boolean) => boolean;

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
  unwrapErr: () => E;

  /**
   *  Returns the Ok value or the provided default value.
   *
   * @example
   * ```ts
   *  expect(ok(42).unwrapOr(1)).toBe(42)
   *  expect(err("error").unwrapOr(1).toBe(1)
   * ```
   */
  unwrapOr: <T1 extends T>(defaultValue: T1) => T;

  /**
   *  Returns the Ok value or computes it from a function.
   *
   * @example
   * ```ts
   *  expect(ok(42).unwrapOrElse(() => 1)).toBe(42)
   *  expect(err("error").unwrapOrElse(() => 1).toBe(1)
   * ```
   */
  unwrapOrElse: <T1 extends T>(defaultValueFun: () => T1) => T;

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
  and: <U, E1 extends E>(b: Result<U, E1>) => Result<U, E>;

  /**
   *  Returns res if the result is Err, otherwise returns the Ok value of self.
   */
  or: <F, T1 extends T>(b: Result<T1, F>) => Result<T, F>;

  /**
   * Returns the option if it contains a value,
   *  otherwise calls f and returns the result.
   */
  orElse: <F, T1 extends T>(f: () => Result<T1, F>) => Result<T, F>;

  andThen: <U, E1 extends E>(f: (value: T) => Result<U, E1>) => Result<U, E>;
  flatMap: <U, E1 extends E>(f: (value: T) => Result<U, E1>) => Result<U, E>;

  tap: <F extends void | Promise<void>>(f: (value: T) => F) => F;
  do: <U, F>(f: (value: T) => Result<U, F>) => Result<U, F>;
  bind: () => T;
  b: () => T;

  match: <U>(pattern: { ok: (value: T) => U; err: (value: E) => U }) => U;
};

const okHandler: ProxyHandler<Result<any, any>> = {
  get: (target, prop) => {
    const { value } = target as OkVariant<any, any>;
    const unwrap = (): any => value;
    const flatMap = (f: (value: any) => Result<any, any>) => f(value);

    switch (prop) {
      case "variant":
        return "ok";
      case "value":
        return value;
      case "isOk":
        return true;
      case "isOkAnd":
        return (f: any) => f(value);
      case "isErr":
        return false;
      case "isErrAnd":
        return () => false;
      case "ok":
        return () => some(value);
      case "err":
        return () => none;
      case "expect":
        return unwrap;
      case "unwrap":
        return unwrap;
      case "expectErr":
        return (message: any) => {
          throw new Error(message);
        };
      case "unwrapErr":
        return () => {
          throw new Error("called `Result.unwrapErr()` on an `Ok` value");
        };
      case "unwrapOr":
        return unwrap;
      case "unwrapOrElse":
        return unwrap;
      case "map":
        return (f: any) => ok(f(value));
      case "mapOr":
        return (_: any, f: any) => f(value);
      case "mapOrElse":
        return (_: any, f: any) => f(value);
      case "mapErr":
        return (_: any) => ok(value);
      case "and":
        return (b: any) => b;
      case "or":
        return () => ok(value);
      case "orElse":
        return () => ok(value);
      case "andThen":
        return flatMap;
      case "flatMap":
        return flatMap;
      case "do":
        return (f: any) => {
          try {
            return f(value);
          } catch (e) {
            return err(e);
          }
        };
      case "bind":
        return () => value;
      case "b":
        return () => value;
      case "match":
        return (pattern: any) => pattern.ok(value);
      case "tap":
        return (f: any) => f(value);
    }
  },
};

export const ok = <T>(value: T): Result<T, any> =>
  new Proxy(
    {
      variant: "ok",
      value,
    } as Result<T, any>,
    okHandler
  );

const errHandler: ProxyHandler<Result<any, any>> = {
  get: (target, prop) => {
    const { error } = target as ErrVariant<any, any>;
    const unwrap = () => {
      throw new Error("called `Result.unwrap()` on an `Err` value: " + error);
    };

    const bind = () => {
      throw error;
    };

    switch (prop) {
      case "variant":
        return "err";
      case "error":
        return error;
      case "isOk":
        return false;
      case "isOkAnd":
        return () => false;
      case "isErr":
        return true;
      case "isErrAnd":
        return (p: any) => p(error);
      case "ok":
        return () => none;
      case "err":
        return () => some(error);
      case "expect":
        return unwrap;
      case "unwrap":
        return unwrap;
      case "expectErr":
        return () => error;
      case "unwrapErr":
        return () => error;
      case "unwrapOr":
        return (defaultValue: any) => defaultValue;
      case "unwrapOrElse":
        return (defaultValueFun: any) => defaultValueFun();
      case "map":
        return () => err(error);
      case "mapOr":
        return (defaultValue: any, _: any) => defaultValue;
      case "mapOrElse":
        return (defaultValueFn: any, f: any) => defaultValueFn();
      case "mapErr":
        return (f: any) => err(f(error));
      case "and":
        return () => err(error);
      case "or":
        return (res: any) => res;
      case "orElse":
        return (f: any) => f();
      case "andThen":
        return () => err(error);
      case "flatMap":
        return () => err(error);
      case "do":
        return () => {
          return err(error) as any;
        };
      case "bind":
        return bind;
      case "b":
        return bind;
      case "match":
        return (pattern: any) => pattern.err(error);
      case "tap":
        return <F extends void | Promise<void>>(f: (_: any) => F): F => {
          return undefined as any;
        };
    }
  },
};

export const err = <E>(error: E): Result<any, E> =>
  new Proxy({ variant: "err", error } as Result<any, E>, errHandler);
