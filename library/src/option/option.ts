// TODO: add js docs for each field
export type Option<T> = (
  | {
      readonly variant: "none";
    }
  | {
      readonly variant: "some";
      readonly value: T;
    }
) & {
  /**
   *  Returns `true` if the option is a `Some` value and `false` if it is a `None` value.
   *
   * @example
   * ```ts
   *  expect(some(3).isSome()).toBe(true)
   *  expect(none.isSome()).toBe(false)
   * ```
   */
  isSome: () => boolean;
  isSomeAnd: (predicate: (value: T) => boolean) => boolean;
  isNone: () => boolean;
  expect: (message: string) => T;
  unwrap: () => T;
  unwrapOr: (defaultValue: T) => T;
  unwrapOrElse: (defaultValueFun: () => T) => T;
  map: <U>(f: (value: T) => U) => Option<U>;
  mapOr: <U>(defaultValue: U, f: (value: T) => U) => U;
  mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U;
  // okOr: (err: E) => Result<T, E>
  // okOrElse: (f: () => E) => Result<T, E>
  and: <U>(b: Option<U>) => Option<U>;
  flatMap: <U>(f: (value: T) => Option<U>) => Option<U>;
  andThen: <U>(f: (value: T) => Option<U>) => Option<U>; // alias for flatMap
  use: (f: (value: T) => void) => void;
  filter: (predicate: (arg: T) => boolean) => Option<T>;
  or: (b: Option<T>) => Option<T>;
  orElse: (f: () => Option<T>) => Option<T>;
  match: <U>(pattern: { some: (value: T) => U; none: () => U }) => U;
  do: (gen: (value: T) => Generator<Option<T>, Option<T>, T>) => Option<T>;
};

export const none: Option<any> = Object.freeze({
  variant: "none",
  isSome: () => false,
  isSomeAnd: () => false,
  isNone: () => true,
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
  or: (b) => b,
  orElse: (f) => f(),
  use: () => {},
  match: (pattern) => pattern.none(),
  do: () => none,
});

export const some = <T>(value: T): Option<T> => {
  const flatMap = <U>(f: (value: T) => Option<U>): Option<U> => f(value);

  return {
    variant: "some",
    value,
    isSome: () => true,
    isSomeAnd: (predicate) => predicate(value),
    isNone: () => false,
    expect: () => value,
    unwrap: () => value,
    unwrapOr: () => value,
    unwrapOrElse: () => value,
    map: (f) => some(f(value)),
    mapOr: (_, f) => f(value),
    mapOrElse: (defaultValue, f) => f(value),
    and: (b) => b,
    flatMap,
    andThen: flatMap,
    filter: (predicate) => (predicate(value) ? some(value) : none),
    or: () => some(value),
    orElse: () => some(value),
    use: (f) => f(value),
    match: (pattern) => pattern.some(value),
    do: (gen) => {
      const iterator = gen(value);
      let result = iterator.next();
      while (!result.done) {
        if (result.value.isNone()) {
          return none;
        }
        result = iterator.next(result.value.unwrap());
      }

      return result.value;
    },
  };
};

export const from = <T>(value: T | null | undefined): Option<T> =>
  value === null || typeof value === "undefined" ? none : some(value as T);

// TODO: functions
