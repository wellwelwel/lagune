---
name: testing
description: Authoritative reference for deciding whether a test should exist and what it must assert. Use before writing or changing tests, and when investigating a test failure.
user-invocable: true
metadata:
  author: Weslley Araújo
  version: '1.0.1'
  source: https://github.com/wellwelwel/skills
---

# Testing

This skill is the specialized, authoritative description of **why a test exists**: what deserves one, what it must assert, and what to do when it fails.

Follow the project's established conventions wherever they differ from these defaults. For code conventions and test execution, use the `engineering` skill when it is installed.

## Criteria

Answer these questions before writing a test. If any answer is missing, there is no test to write.

- **What promise does it protect?** State the behavior, contract, or rule in the domain's terms.
- **What regression would it catch?** Describe an incorrect change that would otherwise go unnoticed.
- **Would an equivalent implementation still pass?** A refactor must not invalidate the assertions when the promise is unchanged.

The test's name states the promise in the domain's terms, stays valid after a rename, and identifies what broke when it fails.

## What deserves a test

- **A behavior the product promises.** Cover rules that can be stated independently of the implementation, such as when an operation is allowed or how a failure is handled.
- **A contract between two parties.** When systems exchange data or delegate work, test their agreed obligations. A literal table is valid when it records that agreement, not a copy of the code.
- **A barrier against hostile input.** Exercise every validation or parser of untrusted data with hostile input, not only valid input.
- **A rule that holds for a whole set.** When the project requires every item in a set to satisfy a rule, check the set in one test so new items are covered automatically.
- **An intentional constraint.** Cover the effects of agreed limits, rounding rules, or required formats.

## What never gets a test

- **The language, the runtime, or a library.** Do not re-test behavior they already guarantee. A wrapper around a call needs a test only if it adds a promise of its own.
- **The shape of a module.** Do not test that a function is exported, can be called, or matches its declaration. Leave statically guaranteed properties to static checks.
- **A constant or fixed text read back.** Repeating a declared value or label as the expected result proves nothing. Test its effect or, for text generated from other data, the composition rule.
- **The structure of the implementation.** Do not assert which internal helper ran, how often, in what order, or with which arguments.
- **A snapshot of the markup.** A rendered tree records structure, not interface behavior. Test what the interface promises instead.

## Resilience to change

- **Mock only external dependencies.** Replace the network, the clock, storage, or the file system, never the project's own modules.
- **Write the expected value by hand.** State the literal value the promise requires. Do not derive it from the formula or helper under test, which could carry the same error as the result.
- **Assert the complete promise.** Check the required values, not merely that a result exists or has a type. Presence is enough only when it is the entire promise, such as flagging an invalid field regardless of the message.
- **Deterministic or removed.** A test whose verdict depends on the real clock, network availability, execution order, or uncontrolled randomness must be made repeatable or removed.
- **Organize cases in a table.** When several inputs follow the same rule, use one named case per row (parameterized tests) instead of duplicating test logic.
- **One file per subject, not per source file.** Group a subject's promises in one file, regardless of where their implementation lives. A source file does not need a corresponding test file.

## When a test fails

A failure asks one question: did the promise change on purpose?

- **Yes:** update the test with the intended behavior change so both are reviewed together.
- **No, and the behavior changed:** the code is wrong, so fix it.
- **No, and the behavior did not change:** investigate the test and its setup. Correct implementation coupling or uncontrolled inputs instead of changing the expectation.

Never make a test pass by weakening its assertion or widening its mocks.

## Review

After writing or changing tests, check every test touched by the work against this skill. Rewrite or remove any that no longer meet its criteria.
