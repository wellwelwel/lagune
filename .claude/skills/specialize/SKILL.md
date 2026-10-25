---
name: specialize
description: Author a new built-in Lagune specialization inside the Lagune source, not a project's own catalog. Use when adding or refining a security knowledge module that ships with Lagune, against the native layout (`catalog/*.md` plus the built-in index).
user-invocable: true
disable-model-invocation: true
metadata:
  internal: true
---

# Authoring a built-in Lagune specialization (development workspace)

The published skill `skills/lagune.specialize/SKILL.md` writes into a **project's own catalog**: `.lagune/catalog/<name>.md` plus its entry in `.lagune/catalog.json`. This repo is the **Lagune source**, where built-in specializations live in `catalog/<name>.md` and their index is a TypeScript array, not a runtime JSON file. A built-in is registered in code, published with the engine, and tested.

So you reuse the skill's **authoring discipline** (terrain, defense-only gate, template, tags, reconcile-never-append) but **override every output path** to the native layout, and you update the registration points the published skill never has to.

## Step 1: Run the skill's authoring steps, with redirected paths

Read and follow `skills/lagune.specialize/SKILL.md` in full. Its authoring steps hold unchanged. The one thing that does not is where files are read and written, since the skill targets a project and you are in the source. Remap every path it names:

| Skill path (a project's own catalog)                  | Native path (use this instead)                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `catalog <name>` for `regex`, `javascript`, `browser` | every `*.md` already in `catalog/` (list the directory, mirror the closest one) |
| `template.md`, next to the skill                      | `skills/lagune.specialize/template.md`                                          |
| `catalog` (list what exists)                          | read `catalog/` and `BUILTIN_SPECIALIZATIONS` in `src/catalog/builtin.ts`       |
| `.lagune/catalog/<name>.md` (the specialization file) | `catalog/<name>.md`                                                             |
| `.lagune/catalog.json` (index entry)                  | a `BuiltinSpecialization` in `src/catalog/builtin.ts`                           |

A hook reference inside the `.md` body uses the engine command, `npx --yes --prefer-offline lagune@<version> <hook>`, with the package version and long flags only, because that body ships verbatim to the end user. The release step moves that version with each release.

## Step 2: Decide the category

Every built-in belongs to at least one **category**, which is how a project brings it into its catalog with `npx --yes --prefer-offline lagune@<version> add --categories <category>`. Categories live in `CATEGORIES` in `src/catalog/categories.ts`.

- A language specialization goes under its language key (`python` under `python`, and so on).
- A specialization about an application-security risk OWASP tracks goes under `owasp`.
- Match the specialization to the category that actually describes it. If none fits, that is a signal a new category may be needed, adding a `Category` to `CATEGORIES` (key, label, description) and its icon. Ask the user before inventing one, do not force an unrelated module into `owasp` to avoid the question.

A project's own index entry carries no categories, but the **built-in** index entry does. Set it.

## Step 3: Write and register, then verify

A new built-in is not done when the `.md` exists. Touch each of these:

### Required (a specialization is broken without these)

1. Write the authored module to **`catalog/<name>.md`** (Step 1). The engine reads `catalog/<name>.md` by name, so the file resolves once it is on disk and indexed.
2. Add the `BuiltinSpecialization` `{ name, tags, categories }` to **`src/catalog/builtin.ts`**. Without this row, `catalog` never lists it and `catalog <name>` cannot resolve it.
3. Add a `Category` to **`src/catalog/categories.ts`**, but only when you introduced a new category.
4. Add its label, description, icon, and prompt task to **`src/dashboard/shared/specialization-meta.ts`**, which the dashboard and the website share.

### Tests (the suite asserts the index, the files, and the docs stay in sync)

5. The catalog tests iterate `BUILTIN_SPECIALIZATIONS` (for example, no built-in repeats its name inside its own tags, every index row has a file and every file a row, every engine call carries the package version and long flags), so a new entry is exercised automatically. Update a hardcoded list only when your change alters it, such as the built-ins a category holds.
6. Run the full suite: `npm test`. It runs `scripts/build.sh` first, so the engine the e2e tests exercise is rebuilt automatically. All green before you call it done.

### Documentation (the built-in catalog is enumerated by hand in the website)

7. Add a row to the table of built-ins in **`website/docs/commands/catalog.mdx`**, giving the built-in its categories and focus. The sync test fails until the row matches the index.
8. Update **`README.md`** only when it enumerates built-ins.

### Not touched

- `.lagune/catalog.json` and `.lagune/catalog/`: these are a **project's own** catalog. A built-in never writes there.

## Quick checklist

```
[ ] catalog/<name>.md                        authored from skills/lagune.specialize/template.md (reconciled on a refine)
[ ] src/catalog/builtin.ts                   BuiltinSpecialization added { name, tags, categories }
[ ] src/catalog/categories.ts                only if a new category was introduced
[ ] src/dashboard/shared/specialization-meta.ts  label, description, icon, prompt task
[ ] tests updated + npm test green
[ ] website/docs/commands/catalog.mdx table row added
```

## Summary to the user

As Step 8 of the skill: state the name, tags, categories, what it covers, and that the phases load it on demand once shipped (a prompt loads it directly with the engine's `catalog <name>`). Note that a project's own specialization of the same name shadows it. Suggest a commit such as ``feat: add specialization in `<name>` defense``, matching the wording the existing built-ins use, as a suggestion, not a mandate.
