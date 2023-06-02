# this-is-ok

Option and Result monads for TypeScript.

### Why this library?

- fully type-safe
- Best-in-class, clean and type-safe do-notation with generators
- ergonomic API, inspired by Rust along side with other useful methods (such as `tap`)
- supports both method syntax (e.g. `maybeNumber.map(x => x + 1)`) and function syntax (e.g. `map(maybeNumber, x => x + 1)`)
- all functions can be partially applied
- tree-shakeable
- has adapters for common built-in APIs such as `Set` or `Map`.
- works with esm and cjs
- no dependencies
