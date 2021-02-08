# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.1](https://github.com/kwangure/svelte-pagejs-router/compare/v0.3.0...v0.3.1) (2021-02-08)


### Bug Fixes

* bundle default `error` and `layout` ([1155463](https://github.com/kwangure/svelte-pagejs-router/commit/1155463b0dd26dd8e911fca96d1ae70505bbade7))

## [0.3.0](https://github.com/kwangure/svelte-pagejs-router/compare/v0.2.0...v0.3.0) (2021-01-23)


### ⚠ BREAKING CHANGES

* import {navigate} from "@kwangure/svelte-pagejs-router"
to change routes.
* only require `error` and `layout` component

### Features

* only require `error` and `layout` component ([306b903](https://github.com/kwangure/svelte-pagejs-router/commit/306b9030b19d0bf98d2147a00940b2b838626db8))
* use `navigate` function instead of event ([599d1a0](https://github.com/kwangure/svelte-pagejs-router/commit/599d1a0be9d50c3bac71c545924debc979fac159))

## [0.2.0](https://github.com/kwangure/svelte-pagejs-router/compare/v0.1.7...v0.2.0) (2021-01-15)


### ⚠ BREAKING CHANGES

* This fixes path in hashbang routes where the path
before the hashbang i.e `index.html#!/path` would show up in the path
variable. We now read `routePath` instead of `pathname` from page.js's
context.

### Features

* use `path` prop instead of `pathname` ([3a6111c](https://github.com/kwangure/svelte-pagejs-router/commit/3a6111c29382712cabb5636bd693c169ebd26584))

### [0.1.7](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.6...v0.1.7) (2021-01-12)


### Features

* rename package org ([b275c17](https://github.com/deimimi/svelte-pagejs-router/commit/b275c173d148fbcde5f1162b73c8ffbbc324dfd2))


### Bug Fixes

* listen to navigate event on error page as well ([38dd314](https://github.com/deimimi/svelte-pagejs-router/commit/38dd314019544a452298522ced7dfcd777586ff9))
* reset existing rootComponent preload ([585d861](https://github.com/deimimi/svelte-pagejs-router/commit/585d861544a580c7d579a266a63aa55bab69ca95))

### [0.1.6](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.5...v0.1.6) (2020-12-28)


### Features

* pass context to 404 requests ([cd8319c](https://github.com/deimimi/svelte-pagejs-router/commit/cd8319c5c4b1cc4bdf0caca4c0a059bc7498533c))

### [0.1.5](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.4...v0.1.5) (2020-11-07)


### Features

* allow cross-route context passing ([03c641d](https://github.com/deimimi/svelte-pagejs-router/commit/03c641df271b387824b210c1ac42becb686f7e17))

### [0.1.4](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.3...v0.1.4) (2020-10-12)


### Features

* pass params and query to preload ([604fc65](https://github.com/deimimi/svelte-pagejs-router/commit/604fc65d9fa7578a020e04ca844a0907f4c33cfb))

### [0.1.3](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.2...v0.1.3) (2020-09-30)


### Features

* add component preloading ([51cc66e](https://github.com/deimimi/svelte-pagejs-router/commit/51cc66ea89f6682294222d4c1e71df40131acd9d))

### [0.1.2](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.1...v0.1.2) (2020-09-29)


### Features

* add a base option ([745fc54](https://github.com/deimimi/svelte-pagejs-router/commit/745fc5485576250587b8970c66d4da6ce4d6f93b))

### [0.1.1](https://github.com/deimimi/svelte-pagejs-router/compare/v0.1.0...v0.1.1) (2020-07-25)


### Bug Fixes

* make the options optional ([6d64bb4](https://github.com/deimimi/svelte-pagejs-router/commit/6d64bb48c326325000fb4845ad4976b0dbca64ec))

## [0.1.0](https://github.com/deimimi/svelte-pagejs-router/compare/v0.0.1...v0.1.0) (2020-07-22)


### ⚠ BREAKING CHANGES

* Options are now the third argument (an Object)

### Features

* add `target`, `hydrate` and `intro` options ([0fc9c65](https://github.com/deimimi/svelte-pagejs-router/commit/0fc9c652b6974b37b5bc309ee7e8d4e4e4a42c13))


### Bug Fixes

* explicity label as type module ([0e9e9fb](https://github.com/deimimi/svelte-pagejs-router/commit/0e9e9fbda319187c54eacb5a1f2e18927f41c748))

### 0.0.1 (2020-07-06)


### Features

* initial commit ([91826a2](https://github.com/deimimi/svelte-pagejs-router/commit/91826a23df33dd5ecb427c419c004509a4f225fa))
* prepare release to Github registry ([3e5d672](https://github.com/deimimi/svelte-pagejs-router/commit/3e5d672033b7d8a94a3c7e999001c07bdedc6d98))
