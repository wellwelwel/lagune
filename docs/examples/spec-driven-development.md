# Spec-Driven Development: Secure What Your Spec Builds

> Pair Lagune with Superpowers, Spec Kit, or OpenSpec: set the charter from your spec, then implement it with /lagune so every task is hardened as the code is written.

Canonical: https://lagune.ai/docs/examples/spec-driven-development
Last updated: 2026-11-09

Pair **Lagune** with a Spec-Driven Development tool, such as [**Superpowers**](https://github.com/obra/superpowers), [**Spec Kit**](https://github.com/github/spec-kit), or [**OpenSpec**](https://github.com/Fission-AI/OpenSpec): your tool decides what to build, and **Lagune** decides how it stays safe.

## How It Fits

**Lagune** joins your tool's flow at two points, leaving the rest unchanged:

1. Once your tool writes the spec, [`/lagune-charter`](https://lagune.ai/docs/commands/charter) reads it and sets the security principles the feature calls for, before any code exists.
2. Marked on your tool's implementation command, [`/lagune`](https://lagune.ai/docs/commands/lagune) hardens each task under those principles as the code is written.

**Tip**

Replace the spec path in each example with the file your tool wrote. When the project already has a charter, the same step updates it with what the new feature needs.

## Prompt Examples

Send the prompts in order, each once the previous one finishes.

```prompt
/superpowers:brainstorming Guest checkout with card payments.
```

```prompt
/lagune-charter docs/superpowers/specs/2026-11-09-guest-checkout-design.md
```

```prompt
/superpowers:writing-plans
```

```prompt
/superpowers:executing-plans /lagune
```

```prompt
/speckit.specify Guest checkout with card payments.
```

```prompt
/lagune-charter specs/001-guest-checkout/spec.md
```

```prompt
/speckit.plan
```

```prompt
/speckit.tasks
```

```prompt
/speckit.implement /lagune
```

```prompt
/opsx:propose add-guest-checkout
```

```prompt
/lagune-charter openspec/changes/add-guest-checkout/proposal.md
```

```prompt
/opsx:apply /lagune
```

```prompt
/opsx:archive
```
