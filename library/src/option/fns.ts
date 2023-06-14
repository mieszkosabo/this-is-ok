import { Option, none, some } from "./option";

/**
 * Converts a nullable value into an option.
 * @example
 * ```ts
 * expect(of(42).unwrap()).toBe(42)
 * expect(of(null).isNone()).toBe(true)
 * ```
 * @see
 * If you need to convert a result of a function use {@link from}
 */
export const of = <T>(value: T | null | undefined): Option<T> =>
  value === null || typeof value === "undefined" ? none : some(value as T);

/**
 * Calls a function and converts its result into an option. If the function
 * is null or undefined or it throws an exception, none is returned.
 * @example
 * ```ts
 * expect(from(() => 42).unwrap()).toBe(42)
 * expect(from(() => { throw "error"; }).isNone()).toBe(true)
 * ```
 * @see
 * If you need to convert a value use {@link of}
 *
 */
export const from = <T>(fn: () => T | null | undefined): Option<T> => {
  try {
    return of(fn());
  } catch (_) {
    return none;
  }
};
