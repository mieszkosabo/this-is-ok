<h2 align="center">this-is-ok</h2>

  <p align="center">
    An ergonomic way to work with fallible operations in TypeScript.
    <br />
    <br />
    <a href="https://github.com/mieszkosabo/this-is-ok#api-reference-">API Reference</a>
    ·
    <a href="https://github.com/mieszkosabo/this-is-ok/issues">Report Bug</a>
    ·
    <a href="https://github.com/mieszkosabo/this-is-ok/issues/new">Request Feature</a>
    ·
    <a href="https://github.com/mieszkosabo/this-is-ok#road-map-">Road map</a>
  </p>

---

## Why this library? <!-- omit in toc -->

- ✨ Fully type-safe, and ergonomic API that uses popular conventions.
- 🎉 Comes with a clean and easy to use way to simulate the do-notation.
- ⚡️ Tree-shakable, works with esm, cjs, and doesn't force you to use `nodenext`/`node16` module resolution.

## Getting started <!-- omit in toc -->

### Installation <!-- omit in toc -->

```bash
npm install this-is-ok

yarn add this-is-ok

pnpm add this-is-ok

```

### Basic usage <!-- omit in toc -->

```ts
// an example of adapting a standard library function to use Option
const safeParseInt = (value: string): Option<number> => {
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    return none;
  }
  return some(parsed);
};

// `of` from the option module creates an Option from a nullable value
of(localStorage.getItem("counter"))
  // map the inner value to another Option
  .flatMap((d) => safeParseInt(d))
  // map the inner value or use a default value if it's none
  .mapOr(0, (d) => d + 1)
  // perform any side effect with the value
  .tap((d) => localStorage.setItem("counter", d.toString()));
```

### do notation <!-- omit in toc -->

Do notation lets us write the "happy path" of a function without having to worry about the error handling.
We access the inner values of options by calling `bind` on them, and if any point, inside the `do` block, `bind` is called on `none`
then we short-circuit the execution and none is returned.

```ts
some(1)
  .do((value) => {
    const a = some(2).bind();
    const b = some("hello").bind();
    return some(b.repeat(value + a));
  })
  .tap(console, log); // "hellohellohello"

some(1).do((value) => {
  const a = value; // 1

  const b = some(2).bind(); // 2

  const c = (none as Option<number>).bind();
  // the execution stops here and none is returned
  // so the following lines are not executed

  const d = some(3).bind();
  return some(a + b + c + d);
}).isNone; // true
```

# Api Reference <!-- omit in toc -->

- [Option](#option)
  - [Creation](#creation)
    - [`of`](#of)
    - [`from`](#from)
  - [Methods](#methods)
    - [`isSome: boolean`](#issome-boolean)
    - [`isSomeAnd: (predicate: (value: T) => boolean) => boolean`](#issomeand-predicate-value-t--boolean--boolean)
    - [`isNone: boolean`](#isnone-boolean)
    - [`expect: (message: string) => T`](#expect-message-string--t)
    - [`unwrap: () => T`](#unwrap---t)
    - [`unwrapOr: (defaultValue: T) => T`](#unwrapor-defaultvalue-t--t)
    - [`unwrapOrElse: (defaultValueFun: () => T) => T`](#unwraporelse-defaultvaluefun---t--t)
    - [`map: <U>(f: (value: T) => U) => Option<U>`](#map-uf-value-t--u--optionu)
    - [`mapOr: <U>(defaultValue: U, f: (value: T) => U) => U`](#mapor-udefaultvalue-u-f-value-t--u--u)
    - [`mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U`](#maporelse-udefaultvaluefun---u-f-arg-t--u--u)
    - [`okOr: <E>(err: E) => Result<T, E>`](#okor-eerr-e--resultt-e)
    - [`okOrElse: <E>(f: () => E) => Result<T, E>`](#okorelse-ef---e--resultt-e)
    - [`and: <U>(b: Option<U>) => Option<U>`](#and-ub-optionu--optionu)
    - [`or: (b: Option<T>) => Option<T>`](#or-b-optiont--optiont)
    - [`orElse: (f: () => Option<T>) => Option<T>`](#orelse-f---optiont--optiont)
    - [`flatMap: <U>(f: (value: T) => Option<U>) => Option<U>`](#flatmap-uf-value-t--optionu--optionu)
    - [`andThen: <U>(f: (value: T) => Option<U>) => Option<U>`](#andthen-uf-value-t--optionu--optionu)
    - [`tap: <F extends void | Promise<void>>(f: (value: T) => F) => F`](#tap-f-extends-void--promisevoidf-value-t--f--f)
    - [`filter: (predicate: (arg: T) => boolean) => Option<T>`](#filter-predicate-arg-t--boolean--optiont)
    - [`match: <U>(pattern: { some: (value: T) => U; none: () => U }) => U`](#match-upattern--some-value-t--u-none---u---u)
    - [`do: <U>(f: (value: T) => Option<U>) => Option<U>`](#do-uf-value-t--optionu--optionu)
- [Result](#result)
  - [Creation](#creation-1)
  - [Methods](#methods-1)
    - [`isOk: boolean`](#isok-boolean)
    - [`isOkAnd: (predicate: (value: T) => boolean) => boolean`](#isokand-predicate-value-t--boolean--boolean)
    - [`isErr: boolean`](#iserr-boolean)
    - [`isErrAnd: (predicate: (value: E) => boolean) => boolean`](#iserrand-predicate-value-e--boolean--boolean)
    - [`ok: () => Option<T>`](#ok---optiont)
    - [`err: () => Option<T>`](#err---optiont)
    - [`expect: (message: string) => T`](#expect-message-string--t-1)
    - [`unwrap: () => T`](#unwrap---t-1)
    - [`expectErr: (message: string) => T`](#expecterr-message-string--t)
    - [`unwrapErr: () => T`](#unwraperr---t)
    - [`unwrapOr: (defaultValue: T) => T`](#unwrapor-defaultvalue-t--t-1)
    - [`unwrapOrElse: (defaultValueFun: () => T) => T`](#unwraporelse-defaultvaluefun---t--t-1)
    - [`map: <U>(f: (value: T) => U) => Result<U, E>`](#map-uf-value-t--u--resultu-e)
    - [`mapOr: <U>(defaultValue: U, f: (value: T) => U) => U`](#mapor-udefaultvalue-u-f-value-t--u--u-1)
    - [`mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U`](#maporelse-udefaultvaluefun---u-f-arg-t--u--u-1)
    - [`mapErr: <U>(f: (value: E) => U) => Result<T, U>`](#maperr-uf-value-e--u--resultt-u)
    - [`and: <U>(b: Result<U, E>) => Result<U, E>`](#and-ub-resultu-e--resultu-e)
    - [`or: <F>(b: Result<T, F>) => Result<T,F>`](#or-fb-resultt-f--resulttf)
    - [`orElse: <F>(f: () => Result<T, F>) => Result<T, F>`](#orelse-ff---resultt-f--resultt-f)
    - [`flatMap: <U>(f: (value: T) => Result<U, E>) => Result<U, E>`](#flatmap-uf-value-t--resultu-e--resultu-e)
    - [`andThen: <U>(f: (value: T) => Result<U, E>) => Result<U, E>`](#andthen-uf-value-t--resultu-e--resultu-e)
    - [`do: <U, F>(f: (value: T) => Result<U, F>) => Result<U, F>`](#do-u-ff-value-t--resultu-f--resultu-f)
    - [`match: <U>(pattern: { ok: (value: T) => U; err: (value: E) => U }) => U`](#match-upattern--ok-value-t--u-err-value-e--u---u)

## Option

### Creation

#### `of`

Converts a nullable value into an option.

Example:

```ts
of(1); // some(1)
of(null); // none
of(undefined); // none
```

#### `from`

Calls a function and converts its result into an option. If the function
is null or undefined or it throws an exception, none is returned.

Example:

```ts
from(() => 1); // some(1)
from(() => null); // none
from(() => {
  throw new Error("oopsie hehe");
}); // none
```

### Methods

#### `isSome: boolean`

Property that is `true` if the option is a `Some` variant and `false` otherwise.

Example:

```ts
some(3).isSome; // true
none.isSome; // false
```

#### `isSomeAnd: (predicate: (value: T) => boolean) => boolean`

Returns true if the option is a Some variant and the value inside
of it matches a predicate.

Example:

```ts
expect(some(42).isSomeAnd((v) => v % 2)).toBe(true);
expect(some(42).isSomeAnd((v) => v > 100)).toBe(true);
```

#### `isNone: boolean`

Property that is `true` if the option is a `None` variant and `false` otherwise.

Example:

```ts
expect(none.isNone).toBe(true);
expect(some(42).isNone).toBe(false);
```

#### `expect: (message: string) => T`

Returns the inner value. Useful for situations where if the
option is a `None` then there is no tap to continue running the program.
The message can be used for debugging purposes.

**Parameters:**

- `message` - The message to throw if the option is a `None` variant.

**Throws:**

Throws the given message if the option is a `None` variant.

**Example:**

```ts
expect(some(42).expect("should be a number")).toBe(42);
expect(none.expect("this will throw")).toThrow();
```

#### `unwrap: () => T`

Returns the inner value or throws an Error if the option is a `None` variant.

**Throws:**

Throws if the option is a `None` variant.

**Example:**

```ts
expect(some(42).unwrap()).toBe(42);
expect(none.unwrap()).toThrow();
```

#### `unwrapOr: (defaultValue: T) => T`

Returns the inner value or the provided default value.

**Example:**

```ts
expect(some(42).unwrapOr(1)).toBe(42);
expect(none.unwrapOr(1)).toBe(1);
```

#### `unwrapOrElse: (defaultValueFun: () => T) => T`

Returns the inner value or computes it from a function.

**Example:**

```ts
expect(some(42).unwrapOrElse(() => 1)).toBe(42);
expect(none.unwrapOrElse(() => 1)).toBe(1);
```

#### `map: <U>(f: (value: T) => U) => Option<U>`

Maps an `Option<T>` to `Option<U>` by applying a function to a contained
value (if Some) or returns None (if None).

**Example:**

```ts
expect(
  some(42)
    .map((x) => x + 1)
    .unwrap()
).toBe(43);
expect(none.map((x) => x + 1).isNone()).toBe(true);
```

#### `mapOr: <U>(defaultValue: U, f: (value: T) => U) => U`

Returns the provided default result (if none),
or applies a function to the contained value (if any).

**Example:**

```ts
expect(
  some(42)
    .mapOr(10, (x) => x + 1)
    .unwrap()
).toBe(43);
expect(none.mapOr(10, (x) => x + 1).unwrap()).toBe(11);
```

#### `mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U`

Computes a default function result (if none),
or applies a different function to the contained value (if any).

**Example:**

```ts
expect(
  some(42)
    .mapOrElse(
      () => 10,
      (x) => x + 1
    )
    .unwrap()
).toBe(43);
expect(
  none
    .mapOrElse(
      () => 10,
      (x) => x + 1
    )
    .unwrap()
).toBe(11);
```

#### `okOr: <E>(err: E) => Result<T, E>`

Given an `error: E` converts `Option<T>` to `Result<T, E>`.

**Example:**

```ts
some(42).okOr("error"); // { variant: "ok", value: 42, ... }
none.okOr("error"); // { variant: "error", error: "error", ... }
```

#### `okOrElse: <E>(f: () => E) => Result<T, E>`

Same as `okOr` but the error is computed from a function.

#### `and: <U>(b: Option<U>) => Option<U>`

Returns None if the option is None, otherwise returns `b`.

**Example:**

```ts
expect(some(42).and(some(1)).unwrap()).toBe(1);
expect(none.and(some(1)).is

None()).toBe(true);
```

#### `or: (b: Option<T>) => Option<T>`

Returns None if the option is None, otherwise returns `b`.

**Example:**

```ts
expect(some(42).or(some(1)).unwrap()).toBe(43);
expect(none.or(some(1)).unwrap()).toBe(1);
```

#### `orElse: (f: () => Option<T>) => Option<T>`

Returns the option if it contains a value,
otherwise calls f and returns the result.

**Example:**

```ts
expect(
  some(42)
    .orElse(() => some(1))
    .unwrap()
).toBe(42);
expect(none.orElse(() => some(1)).unwrap()).toBe(1);
```

#### `flatMap: <U>(f: (value: T) => Option<U>) => Option<U>`

Returns None if the option is None, otherwise calls
f with the wrapped value and returns the result.

**Example:**

```ts
expect(
  some(42)
    .flatMap((x) => some(x + 1))
    .unwrap()
).toBe(43);
expect(
  some(42)
    .flatMap((x) => none)
    .isNone()
).toBe(true);
```

#### `andThen: <U>(f: (value: T) => Option<U>) => Option<U>`

Returns None if the option is None, otherwise calls
f with the wrapped value and returns the result.

**Example:**

```ts
expect(
  some(42)
    .andThen((x) => some(x + 1))
    .unwrap()
).toBe(43);
expect(
  some(42)
    .andThen((x) => none)
    .isNone()
).toBe(true);
```

#### `tap: <F extends void | Promise<void>>(f: (value: T) => F) => F`

Runs the given void function with the inner value if the option is a `Some` variant
or does nothing if the option is a `None` variant.

**Example:**

```ts
expect(
  some(42)
    .tap((x) => some(x + 1))
    .unwrap()
).toBe(43);
expect(
  some(42)
    .tap((x) => none)
    .isNone()
).toBe(true);
```

#### `filter: (predicate: (arg: T) => boolean) => Option<T>`

Returns None if the option is None, otherwise returns `None` if the predicate `predicate` returns `false` when applied to the contained
value, otherwise returns the `Option<T>`.

**Example:**

```ts
expect(
  some(42)
    .filter((x) => x > 10)
    .unwrap()
).toBe(42);
expect(
  some(42)
    .filter((x) => x < 10)
    .isNone()
).toBe(true);
```

#### `match: <U>(pattern: { some: (value: T) => U; none: () => U }) => U`

Allows you to run different functions depending on the variant of the option.

**Example:**

```ts
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
```

#### `do: <U>(f: (value: T) => Option<U>) => Option<U>`

Lets you simulate a do-notation known from functional languages
with the Option monad.

**Example:**

```ts
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
```

## Result

### Creation

### Methods

#### `isOk: boolean`

Property that is `true` if the result is Ok.

**Example:**

```ts
expect(ok(42).isOk).toBe(true);
expect(err("error").isOk).toBe(false);
```

#### `isOkAnd: (predicate: (value: T) => boolean) => boolean`

Returns `true` if the result is an Ok variant and the value inside of it matches a predicate.

**Example:**

```ts
expect(some(42).isSomeAnd((v) => v % 2)).toBe(true);
expect(some(42).isSomeAnd((v) => v > 100)).toBe(true);
```

#### `isErr: boolean`

Property that is `true` if the result is Err.

**Example:**

```ts
expect(ok(42).isErr).toBe(false);
expect(err("error").isErr).toBe(true);
```

#### `isErrAnd: (predicate: (value: E) => boolean) => boolean`

Returns `true` if the result is an Err variant and the value inside of it matches a predicate.

**Example:**

```ts
expect(some(42).isSomeAnd((v) => v % 2)).toBe(true);
expect(some(42).isSomeAnd((v) => v > 100)).toBe(true);
```

#### `ok: () => Option<T>`

Converts from Result<T, E> to Option<T> discarding the error, if any.

**Example:**

```ts
expect(ok(42).ok()).toEqual(some(42));
expect(err("error").ok()).toEqual(none);
```

#### `err: () => Option<T>`

Converts from Result<T, E> to Option<E> discarding the error, if any.

**Example:**

```ts
expect(ok(42).ok()).toEqual(some(42));
expect(err("error").ok()).toEqual(none);
```

#### `expect: (message: string) => T`

Returns the inner value. Useful for situations where if the result is an `Err` then there is no use to continue running the program. The message can be used for debugging purposes.

- `message`: The message to throw if the option is an `Err` variant.

**Throws:**

- Throws the given message if the option is an `Err` variant.

**Example:**

```ts
expect(ok(42).expect("should be a number")).toBe(42);
expect(err("error").expect("this will throw")).toThrow();
```

#### `unwrap: () => T`

Returns the Ok value or throws an Error if the result is an `Err` variant.

**Throws:**

- Throws if the option is a `None` variant.

**Example:**

```ts
expect(ok(42).unwrap()).toBe(42)
expect(err("error").unwrap().toThrow()
```

#### `expectErr: (message: string) => T`

Returns the contained Err value or throws an error if the result is an `Ok` variant.

- `message`: The message to throw if the option is an `Ok` variant.

**Throws:**

- Throws the given message if the option is an `Ok` variant.

**Example:**

```ts
expect(err(42).expectErr("should be a number")).toBe(42);
expect(ok(42).expectErr("this will throw")).toThrow();
```

#### `unwrapErr: () => T`

Returns the contained Err value or throws an error if the result is an `Ok` variant.

**Throws:**

- Throws if the option is a `None` variant.

\*\*Example

:\*\*

```ts
expect(err("error").unwrapErr()).toBe(42)
expect(ok(42).unwrapErr().toThrow()
```

#### `unwrapOr: (defaultValue: T) => T`

Returns the Ok value or the provided default value.

- `defaultValue`: The default value to return if the result is an `Err` variant.

**Example:**

```ts
expect(ok(42).unwrapOr(1)).toBe(42)
expect(err("error").unwrapOr(1).toBe(1)
```

#### `unwrapOrElse: (defaultValueFun: () => T) => T`

Returns the Ok value or computes it from a function.

- `defaultValueFun`: The function that computes the default value if the result is an `Err` variant.

**Example:**

```ts
expect(ok(42).unwrapOrElse(() => 1)).toBe(42)
expect(err("error").unwrapOrElse(() => 1).toBe(1)
```

#### `map: <U>(f: (value: T) => U) => Result<U, E>`

Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.

**Example:**

```ts
expect(
  ok(42)
    .map((x) => x + 1)
    .unwrap()
).toBe(43);
expect(
  err("error")
    .map((x) => x + 1)
    .isNone()
).toBe(true);
```

#### `mapOr: <U>(defaultValue: U, f: (value: T) => U) => U`

Returns the provided default (if Err), or applies a function to the contained value (if Ok).

- `defaultValue`: The default value to return if the result is an `Err` variant.
- `f`: The function to apply to the contained value if the result is an `Ok` variant.

**Example:**

```ts
expect(ok(42).mapOr(10, (x) => x + 1)).toBe(43);
expect(error("error").mapOr(10, (x) => x + 1)).toBe(11);
```

#### `mapOrElse: <U>(defaultValueFun: () => U, f: (arg: T) => U) => U`

Maps a Result<T, E> to U by applying a fallback function default to a contained Err value, or function f to a contained Ok value.

- `defaultValueFun`: The fallback function to apply to the contained Err value.
- `f`: The function to apply to the contained Ok value.

**Example:**

```ts
expect(ok(42).mapOrElse(() => 10, (x) => x + 1))).toBe(43)
expect(error("error").mapOrElse(() => 10, (x) => x + 1))).toBe(11)
```

#### `mapErr: <U>(f: (value: E) => U) => Result<T, U>`

Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched.

**Example:**

```ts
expect(
  ok(42)
    .map((x) => x + 1)
    .unwrap()
).toBe(43);
expect(
  err("error")
    .map((x) => x + 1)
    .isNone()
).toBe(true);
```

#### `and: <U>(b: Result<U, E>) => Result<U, E>`

Returns `res` if the result is Ok, otherwise returns the Err value of self.

- `b`: The Result value to return if the current result is Ok.

#### `or: <F>(b: Result<T, F>) => Result<T,F>`

Returns `res` if the result is Err, otherwise returns the Ok value of self.

- `b`: The Result value to return if the current result is Err.

#### `orElse: <F>(f: () => Result<T, F>) => Result<T, F>`

Returns the option if it contains a value, otherwise calls `f` and returns the result.

- `f`: The function to call if the result is an `Err` variant.

#### `flatMap: <U>(f: (value: T) => Result<U, E>) => Result<U, E>`

Returns `err` if the `Result` is `err`, otherwise calls
f with the wrapped value and returns the result.

**Example:**

```ts
// same as andThen
expect(okVariant.flatMap((v) => ok(v + 1)).unwrap()).toBe(43);
expect(okVariant.flatMap((v) => err("error")).unwrapErr()).toBe("error");
expect(errVariant.flatMap((v) => ok(v + 1)).unwrapErr()).toBe("error");
expect(errVariant.flatMap((v) => err("error1")).unwrapErr()).toBe("error");
```

#### `andThen: <U>(f: (value: T) => Result<U, E>) => Result<U, E>`

Alias for `flatMap`.

#### `do: <U, F>(f: (value: T) => Result<U, F>) => Result<U, F>`

Similar to [do for Option](#do-uf-value-t--optionu--optionu)

#### `match: <U>(pattern: { ok: (value: T) => U; err: (value: E) => U }) => U`

Similar to [match for Option](#do-uf-value-t--optionu--optionu)

# Road map <!-- omit in toc -->

- [ ] Task monad for async operations
- [ ] Use github releases
- [ ] Add function syntax and make them curried (e.g. `map(maybeNumber, x => x + 1)`) apart from method syntax (e.g. `maybeNumber.map(x => x + 1)`)
- [ ] add adapters for common built-in APIs such as `Map` of `fs` module.
