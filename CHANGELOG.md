# Change Log for [Adverb-Signals](https://github.com/sholladay/adverb-signals)
All notable changes to this project are documented here, under these categories.
 - **Added**      : New functionality or something very noteworthy.
 - **Changed**    : Updates to an existing system or feature.
 - **Deprecated** : Planned for removal in the near future.
 - **Fixed**      : Tweaks based on expected behavior.
 - **Removed**    : Disabled or deleted within the source code.

The version numbers adhere to [Semantic Versioning](http://semver.org/) and are tied to categories as such.
 - **Added** comes with a _minor_ version bump, because it does not affect existing users.
 - **Changed** comes with a _major_ version bump, because it breaks existing applications.
 - **Deprecated** comes with a _minor_ version bump, because it adds warnings about removal plans.
 - **Fixed** comes with a _patch_ version bump, because it merely makes applications behave as intended.
 - **Removed** comes with a _major_ version bump, because it breaks existing applications.

## [Unreleased]
### Changed
 -

## [1.0.0] - 2015-08-25
### Changed
 - APIs are now named as intended for this project.
 -- `dispatch()` becomes `emit()`
 -- `add()` becomes `always()`
 -- `addOnce()` becomes `once()`
 -- `remove()` becomes `never()`
 -- `removeAll()` becomes `neverAny()`
 - For consistency with other methods, `runs()` (formerly known as `has()`) now asserts that its `listener` argument is a function, throwing if that is not the case.

## 0.1.0 - 2015-08-24
### Added
 - All of the original files from [JS-Signals], upon which this is based, with minor modifications to the metadata to indicate that this is a different package.


[Unreleased]:      https://github.com/sholladay/adverb-signals/compare/v1.0.0...HEAD
[1.0.0]:           https://github.com/sholladay/adverb-signals/compare/v0.1.0...v1.0.0
