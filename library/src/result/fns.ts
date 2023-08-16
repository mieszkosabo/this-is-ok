import { Result, err, ok } from "./result";

export const of = <T, E>(value: T, error: E): Result<NonNullable<T>, E> =>
  value === null || typeof value === "undefined"
    ? err(error)
    : ok(value as NonNullable<T>);

export const from = <T, E>(fn: () => T, error: E): Result<T, E> => {
  try {
    return of(fn(), error);
  } catch (_) {
    return err(error);
  }
};

export const fromThrowable = <T, E extends Error>(
  fn: () => T
): Result<T, E> => {
  try {
    return ok(fn());
  } catch (e) {
    if (e instanceof Error) {
      return err(e as E);
    } else {
      return err(new Error(`${e}`) as E);
    }
  }
};

export const Do = <T, E>(fn: () => Result<T, E>): Result<T, E> => {
  try {
    return fn();
  } catch (e) {
    if (e instanceof Error) {
      return err(e as E);
    } else {
      return err(new Error(`${e}`) as E);
    }
  }
};
