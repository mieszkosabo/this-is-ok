# this-is-ok

## 0.8.0

### Minor Changes

- 52a3393: - replace overloaded Do with Do and DoAsync
  - add `sequence` function that transforms Option<T>[] into Option<T[]> (and simile for Result)

## 0.7.0

### Minor Changes

- 6cd4143: - Added support for async Do (for both monads)
  - BREAKING: removed the .do API in favor of the standalone Do

## 0.6.2

### Patch Changes

- fix in of type in result

## 0.6.1

### Patch Changes

- fix types for err variant

## 0.6.0

### Minor Changes

- Update internal implemenation to be much more memory efficient

## 0.5.0

### Minor Changes

- 2186ea6: update types for methods such as unwrapOr, unwrapOrElse, ... so that type inference works better when T is a union type. In other words a fix for type variance.

## 0.4.3

### Patch Changes

- Do as standalone function

## 0.4.2

### Patch Changes

- fix type bug in unwrap and expect

## 0.4.1

### Patch Changes

- f1c7cd9: fix an issue with type narrowing for Option.isNone

## 0.4.0

### Minor Changes

- d5e3c01: add `tap` method to Result

### Patch Changes

- 884f96a: fix type in unwrapEr methodr
- f0d32e8: better type narrowing

## 0.3.0

### Minor Changes

- - update README to add table of contents and API reference
  - change behaviour of from function in option
  - add craetion function (of, from, fromThrowable) for Result

## 0.2.2

### Patch Changes

- add result types versions to package.json

## 0.2.1

### Patch Changes

- full test coverage
- acadf38: Added unit tests for Result and fixed a few bugs

## 0.2.0

### Minor Changes

- result type

### Patch Changes

- 733f631: fix imports with exports and typesVersions fields in package.json

## 0.1.0

### Minor Changes

- 7628b54: Option monad
