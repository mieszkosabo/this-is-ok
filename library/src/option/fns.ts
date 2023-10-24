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

/**
   * Lets you simulate a do-notation known from functional languages
   * with the Option monad.
   * 
   * @example
     expect(
        Do(() => {
          const a = 1;
          const b = some(2).bind();
          const c = some(3).bind();
          return some(a + b + c);
        })
        .unwrap()
    ).toBe(6);
   *
   */
export function Do<T>(fn: () => Option<T>): Option<T>;
export function Do<T>(fn: () => Promise<Option<T>>): Promise<Option<T>>;
export function Do<T>(
  fn: () => Option<T> | Promise<Option<T>>
): Option<T> | Promise<Option<T>> {
  try {
    return Promise.resolve(fn()).catch(() => none);
  } catch (_) {
    return none;
  }
}
