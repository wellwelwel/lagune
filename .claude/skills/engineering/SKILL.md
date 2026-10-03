---
name: engineering
description: Authoritative engineering reference for Lagune, covering the toolchain, code conventions, type rules, the build and distribution path, and how the deterministic hooks work. Use before writing or changing source under src/ or test/, or before the build.
user-invocable: true
metadata:
  internal: true
---

# Lagune engineering

This skill is the specialized, authoritative description of **how Lagune is built**: the toolchain, code conventions, type rules, the build and distribution path, and the implementation of the deterministic hooks. Consult it before writing or changing source, before touching the build, and whenever you apply the code conventions.

The product mission and workflow philosophy live in [CLAUDE.md](../../../CLAUDE.md). The repository layout, the command/template split, the core/adapter boundary, what Lagune scaffolds, and the tracking-map model live in the [architecture](../architecture/SKILL.md) skill. This skill covers the _build_, not the _shape_.

## Toolchain

- **Runtimes:** Node.js (current LTS), Bun, and Deno. Lagune must run on all three, so keep code runtime-agnostic.
- **Language:** TypeScript, authored in `src/`.
- **Module system:** ES Modules only (ESM) throughout.
- **Package manager:** npm, matching the npx/npm distribution path.
- **Bundler:** esbuild (transpile and bundle only, it does not type-check).
- **Type-checking:** `tsc --noEmit`, run separately since esbuild skips type checks.
- **Tests:** Poku, run against each runtime: Node (`npm test`), Bun (`bun run test:bun`), and Deno (`deno task test:deno`).

## Code conventions

### General

- **Arrow functions over `function`.** Declare with `const`. Use a `function` only when the `this` context strictly requires it.
- **Named exports only.** Never use `default export`.
- **Practice early return.** Handle edge cases up front and exit, rather than nesting the main logic.
- **No abbreviations.** Names are clear and explicit (for example `left`/`right`, not `a`/`b`, and `index`, not `i`).
- **Avoid nested `if-else-else-if`.** Favor clean, well-decoupled approaches when branching grows.
- **No duplicated logic or types.** Reuse existing logic and types whenever it is viable.
- **No side effects inside loops or iterations.** Keep iteration pure.
- **Prefer native capabilities over external dependencies** whenever possible.
- **Always prefix native imports with `node:`** (for example `node:path`, `node:fs`).
- **Prefer the async Node.js APIs when viable** (for example `node:fs/promises`).

### Types

- **All type declarations live in `src/types/`.** No `type` or `interface` is declared anywhere else in the codebase.
- **Prefer `type`.** Use `interface` only when a class is meant to implement it.
- **`any` and `as unknown as` are forbidden.** No exceptions.
- **Reach for `as` last.** Prefer a direct type annotation or `satisfies`. A plain `as` cast is allowed, but only when neither of those fits.
