# this-is-ok

An ergonomic way to work with fallible operations in TypeScript.

### Why this library?

- ✨ Fully type-safe, and ergonomic API that uses popular conventions.
- 🎉 Comes with a clean and easy to use way to simulate the do-notation.
- ⚡️ Tree-shakable, works with esm, cjs, and doesn't force you to use `nodenext`/`node16` module resolution.

### Getting started

#### Installation

```bash
npm install this-is-ok

yarn add this-is-ok

pnpm add this-is-ok

```

#### Basic usage

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

#### do notation

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

### TODO:

- [ ] (v1) fully tested
- [ ] (v1) fully documented (generate readme section from JSDoc)
- [ ] Add github actions for CI
- [ ] Add to github releases
- [ ] add function syntax and make them curried (e.g. `map(maybeNumber, x => x + 1)`) apart from method syntax (e.g. `maybeNumber.map(x => x + 1)`)
- [ ] add adapters for common built-in APIs such as `Map` of `fs` module.
