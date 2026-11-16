# Simulating a specialization

The simulation runs detect and verify the way fresh agents would, with only the specialization's text changing between versions, and scores every run against a key written before the first one starts.

## The fixtures

Two **Git** repositories in the scratchpad, built from everything the old and the new text name together, so neither version is favored:

- **The project detect reads** plants one instance of each vector, at least one case where the checker cannot see for each blind spot either text names, each look-alike the texts say earns nothing, and one case for each behavior the phase guidance asks for, such as an advisory, an offer to leave a path out, or a side quest. When the checker reads more than the working tree, such as the **Git** history, plant there too.
- **The hardened copy verify reads** applies a control to each of a set of findings, mixing fixes that close the risk with each decoy the texts name. A hardening record beside it, outside the repository, claims every control applied and names the files each one touched in its Where note, standing in for the tracking map.

Write the key before the first run: every finding detect must record, everything it must not, each process behavior, and each control's true verdict. For scale, the secrets fixture held 15 findings, 7 of them beyond the checker, 5 look-alikes, a history and a stash, and 9 controls, 5 of them decoys.

## The engine and the texts

- Build the engine from this tree into the scratchpad the way the build script bundles it, without running the script itself, which wipes the build folder. Give the agents a wrapper that runs the engine's `read` command from the fixture, since the engine's MCP tools serve the session's project, never the fixture.
- Run the checker on both fixtures before any agent does, and confirm every case lands where the key expects it. A case the checker treats differently than planned is fixed in the fixture, or the key is corrected, before the runs.
- Tailor each version for each phase with the catalog's own tailoring function, the one a phase's read goes through, so each agent reads exactly what its phase would.
- Put each tailored copy under a neutral folder name, so no agent can tell the old version from the new one.

## The runs

Spawn every run of a round at once, each as a fresh general-purpose subagent, with the same prompt except the path to its text: 5 detect runs and 5 verify runs per version. Keep a map from each run to its version and phase.

The detect prompt:

```text
You are an AI coding agent running Lagune's detect phase on a project, limited to the part that applies one specialization. This is a controlled simulation: follow the specialization text exactly as you would in a real run, and report what you would record.

Project: <PROJECT> (a Git repository). Run every shell command from that directory (use `cd <project> && ...`).

1. Read <SKILLS>/lagune-detect/SKILL.md for how detect works, especially Step 6 (consult the specializations), Step 7 (findings and Not determined), and the closing summary. You are doing Step 6 for exactly one specialization, `<NAME>`, whose context is present, then deciding what Step 7 would record and what the summary would tell the user. This is the run that creates the detect map.
2. The specialization text, exactly as `catalog <NAME> --phase detect` would print it, is at <TEXT>. Read it and follow it. It is the text under test: do not read any other copy of the <NAME> specialization (not the repository's catalog folder, not its Git history, not the plugin's), do not call `lagune_read` or any MCP tool, and do not read anything else under <SIMULATION> except this text, the project, and the wrapper below.
3. Wherever the text says to call `lagune_read` with `command` set to X and `arguments` set to [...], run `<WRAPPER> X <arguments...>` from the project directory instead.
4. Read the project's code as the specialization directs. Do not modify any file, do not write a detect map, and run no Git command that changes state. Read-only Git commands are fine.

Reply with only this JSON, no prose before or after:
{
  "findings": [ { "name": "...", "files": ["relative/path"], "what_it_is": "one sentence" } ],
  "not_determined": [ { "text": "the entry as you would write it under Not determined", "files": ["relative/path, if any"] } ],
  "tell_user": [ "each thing the summary would raise with the user that is neither a finding nor a Not determined entry, such as an advisory or a path that can be left out" ],
  "dismissed": [ { "files": ["relative/path"], "why": "why it is not a finding" } ]
}
"dismissed" lists every checker entry or candidate you examined and decided is not a finding and not raised anywhere else.
```

The verify prompt:

```text
You are an AI coding agent running Lagune's verify phase on a project, limited to judging controls that one specialization covers. This is a controlled simulation: follow the specialization text exactly as you would in a real run, and report the verdicts you would reach.

Project: <HARDENED> (a Git repository). Run every shell command from that directory (use `cd <project> && ...`).

1. Read <SKILLS>/lagune-verify/SKILL.md for how verify works, especially how each control is proven, what counts as closed versus open, and the closing summary.
2. The hardening record to verify is <RECORD>. Each block's Where note names its files in parentheses, standing in for the tracking map. Every control in it falls under the `<NAME>` specialization.
3. The specialization text, exactly as `catalog <NAME> --phase verify` would print it, is at <TEXT>. Read it and follow it. It is the text under test: do not read any other copy of the <NAME> specialization (not the repository's catalog folder, not its Git history, not the plugin's), do not call `lagune_read` or any MCP tool, and do not read anything else under <SIMULATION> except this text, the record, the project, and the wrapper below.
4. Wherever the text says to call `lagune_read` with `command` set to X and `arguments` set to [...], run `<WRAPPER> X <arguments...>` from the project directory instead.
5. Do not modify any file, do not write verdicts into the record, do not run the untrack hook, and run no Git command that changes state. Read-only Git commands are fine.

Reply with only this JSON, no prose before or after:
{
  "verdicts": [ { "control": "the block title, verbatim", "verdict": "closed | reproved | inconclusive", "reason": "one or two lines" } ],
  "summary_notes": [ "anything else the session summary would tell the user" ]
}
```

## Scoring

Score each run against the key as its report arrives, and keep the scores in a file beside the fixtures: the findings recorded out of those planted, the false positives, each process behavior, each control's verdict, and every conflict or contradiction the agent raises between the text, the checker, and the phase skills. A conflict an agent raises unprompted is evidence about the text, and the same one raised across runs is a finding.

A run that disagrees with the key is checked against the code before it is scored. When the run is right, the key was wrong: correct the key and the fixture, credit the version that caught it, and run both versions again.

Compare the versions behavior by behavior. A case one version settles in most runs and the other misses is a regression or a win, traced to the sentence behind it. When the new text changes after a round, its rounds run again before the verdict, and when a fix outside the specialization changes the conditions, both versions run again.
