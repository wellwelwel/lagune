---
name: refine-specialization
description: Refines one built-in specialization to name every attack, bypass, weak guard, and decoy, and to cut what the model already knows, then proves the new text against the old one in blind simulations of detect and verify.
argument-hint: the name of one built-in specialization, such as upload or sql
user-invocable: true
disable-model-invocation: true
metadata:
  internal: true
---

# Refining a built-in specialization

A model already knows how to write secure code. Asked to make something secure, it reaches for the center of generic security advice and returns code that looks safe while leaving old, well-known holes open. Named one by one, each attack, bypass, and weak guard pulls the model to the exact defense instead. A specialization exists to name, not to teach: each named vector is an anchor, and each sentence that explains what the model already knows dilutes the anchors around it.

This skill brings one built-in specialization to that standard and proves the result: the refined text must reach everything the old one reached, in blind runs of the phases that read it. A tie is the goal and a win is a bonus. The secrets specialization is the reference, refined and proven this way.

## User Input

```text
$ARGUMENTS
```

The User Input names one built-in specialization. When it is empty or names none the catalog holds, list the built-ins and ask which. Reply in the language the user writes in, and write the specialization in English.

## Ground rules

- **One specialization per run.** Its tags, categories, and index row stay as they are.
- **Defense only.** Fixtures hold vulnerable code and decoy fixes for the phases to judge, never a working exploit, and every credential in them is fake and stays in the scratchpad.
- **Measured, never imagined.** A verdict on the text counts once the runs produce it.
- **Nothing outside the specialization changes on your own call.** A phase skill, a checker, or a test that skews the verdict is reported with its proof and changes only when the user asks, after which both versions run again under the fixed conditions.
- **Costly by design.** Each round spawns 20 subagents.
- **Leave Git as you found it.** Stage nothing, and commit only when the user asks.

## The standard

### What stays

- **Anchors:** every named vector, including those outside any top-ten list, the concrete bypasses a guard must withstand, the weak guards a model would write, the exact control that closes each vector, and the decoys under "Does not close it".
- **Look-alikes:** what resembles the risk and earns nothing, so no reader raises it by hand.
- **What only Lagune knows:** each checker call, what each section of its output means to the phase, what the checker cannot see, the routing to neighboring specializations, and the behaviors only this specialization asks of a phase, such as its side quests, advisories, and offers to leave a path out.

### What goes

- Mechanism and motivation the model rebuilds from the anchor.
- Chains of "so", "which is why", and "then" that walk the reader to a conclusion.
- A restatement of what the checker's output already says entry by entry.
- What the phase skills already require of every specialization, such as the parts of a finding, tracking it, or sending a reproved control back to harden.
- A second statement of anything the file already says.
- A source credit the text no longer draws on.

### The shape

The parts the published specialize skill keeps verbatim stay verbatim. Under "What to look for", one short paragraph sets the terrain and routes the neighbors, the checker's pre-pass follows when there is one, then one block per vector. Each block's title names its vector, and the block holds the pattern with its anchors, what the checker misses, the look-alikes, its own "Safer shape:", and its own "Does not close it:". Phase guidance comes last and holds only what the phases would not do on their own. Verify closes only on what the repository shows: anything outside it, such as a deployed setting or a rotation, becomes a side quest detect records under Not determined, and verify's summary points at that side quest instead of keeping the finding open.

## The guardrails

Each one comes from a regression or a gap a simulation caught.

- **Every anchor survives the edit.** Before cutting a sentence, list every vector, anchor, and look-alike it names, and keep each one named somewhere. Dropping a list of what the checker prints once took a vector with it: logging a secret was named only there, and every run on the new text dismissed it as off-terrain while every run on the old text caught it.
- **The terrain sentence admits every vector.** Agents quote it to rule a candidate out.
- **Every claim about a checker matches its code and its output.** A sentence the checker contradicts on the fixture is rewritten, even when the old text carried it.
- **A safer shape belongs to its vector.** A generic one can be the decoy of another vector, as an environment lookup is for a key shipped to the browser.
- **A decoy fails verify by the letter.** Each decoy the text names keeps the control open under the verify guidance as written, not only under an agent's judgment.
- **Add only precision.** A safer shape or a decoy for a vector already named, or a closing condition a named decoy needs, is fair. A new vector waits for the user, and the report flags every addition.

## When invoked

1. **Read.** The specialization whole and the version the last commit holds, the reference specialization, the published specialize skill's rules, the detect and verify skills where they hand a specialization its guidance, and, when it ships a checker, the checker's source, its tests, and its user documentation.
2. **Inventory the anchors** of the current text, by the categories under "What stays". This list is the contract the rewrite keeps.
3. **Rewrite** to the standard, in the file's own voice and by the writer skill's rules.
4. **Confront the inventory** with the new text, then run the project's checks: formatting, types, the test suite, and the token count before and after.
5. **Simulate** as the simulation guide beside this skill describes, the last commit's text against the new one.
6. **Close every regression.** Trace each loss to the sentence behind it, fix it, and run the new version's rounds again until it ties or wins.
7. **Report.**

## Report

- The specialization, its tokens before and after, and the result of each check.
- What changed: the anchors kept, what was cut, the restructure, and each flagged addition.
- The simulation as one table holding every version and every metric, followed by each regression and how it closed.
- What skews the verdict outside the specialization, each with its proof, left for the user to decide.
- Where the fixtures, the key, and the scores live.
- A suggested commit message. Never commit.
