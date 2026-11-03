# /lagune-specialize: Train a Security Specialization with Plain Text

> Distill a security source or topic you give it into a new on-demand specialization.

Canonical: https://lagune.ai/docs/commands/specialize
Last updated: 2026-11-03

🎓 Teach **Lagune** a new specialization, from a source or topic you give it.

It reads the material and distills it into a focused, defense-only specialization, shaped exactly like the [built-in ones](https://lagune.ai/docs/catalog), so the detect and verify phases load it afterwards like any other. It only audits and explains: it never writes attack inputs or exploits, and it never touches your code.

**From an article**

```prompt
# A link or reference: Lagune distills it into the defense
/lagune-specialize https://owasp.org/www-community/attacks/SQL_Injection
```

**From an exploit**

```prompt
# An attack as the source: the specialization is still the defense
/lagune-specialize "' OR 1=1 -- splices SQL into the query text"
```

**From a topic**

```prompt
# Or just name what to cover
/lagune-specialize SQL injection
```

**An attack can be the source, never the output**

Pointing it at an attack is fine when the goal is to defend against it: an exploit write-up is study material it distills into the defense. The specialization it produces always audits and explains, it never produces a working exploit, payload, or evasion.

## What it writes

The result is two files in your project, committed and reviewable alongside your code:

- The specialization at `.lagune/catalog/<name>.md`, shaped like the [built-in ones](https://lagune.ai/docs/catalog).
- Its entry in `.lagune/configs.json`, where your project indexes its own specializations for the catalog to merge with the built-ins.

It then lists the catalog to confirm the new entry is there. Your own specializations are always in the catalog, whatever its categories. You never add a command or touch the package: a new specialty is one knowledge file plus one index entry, written into your own project.

## Refine, never overwrite

Specializing a name that already exists, whether a built-in like `regex` or one you specialized before, **reconciles** the current file instead of replacing it. It reads what is there, folds the new knowledge in, keeps what still holds, and rewrites what changed. Nothing is discarded unseen. A specialization of yours shadows a built-in of the same name, so you can sharpen a built-in for your own project without losing it.

**Tip**

- The new specialization loads exactly like a built-in: the detect and verify phases pick it up on demand, or load it yourself with `npx lagune read catalog <name>` and give it a task.
- When the material has an identifiable origin (an article, an author, a link, a standard), the specialization credits it. A bare topic carries no source.

**Note**

**It runs only when you call it:** the agent never starts it on its own.

## Frequently Asked Questions

### How do I add a custom security specialization?

Run /lagune-specialize with a source or topic. It distills it into a defense-only specialization, written to .lagune/catalog/<name>.md plus its entry in .lagune/configs.json.

### Can Lagune learn from an exploit write-up?

Yes, as a source, never as output. An attack can be the source, never the product. Specialize never writes attack inputs or exploits.

### Does specialize overwrite the built-in specializations?

No. It refines, never overwrites.
