# [PROJECT_NAME] Verification Report <!-- Example: the project's name followed by "Verification Report" -->

- **Scope:** [SCOPE] <!-- Example: one of these, matching how it was run: all applied controls, or the named controls or paths, or the chosen priorities -->
- **Verified:** [VERIFY_DATE] <!-- Example: today's date in ISO format, such as 2026-06-11 -->

## Results

<!--
  One block per detect finding this phase proved, taken from the hardening record (.bluespec/memory/harden.md). The block's title is the finding's name, copied verbatim, the same title harden used, so it is the same item, traced by its title alone with no separate pointer line. Harden applied the control, this report proves whether the RISK that control was meant to close is actually closed in the code now: how that was proven, and the evidence. The Evidence note says what you read, not the file path: the path lives in Blue Spec's tracking map.

  This is a detect focused on the fixes: it reads the code where the record says each control was applied and confirms the code matches the claim. The proof is that confrontation of record against code, never a test written or the system run live. It is read-only on the user's code: no test, no dependency, no code edit. It does write Blue Spec's own chain: this report, and the standing-down of a closed finding.

  The Result is about the risk, not the control, and an icon carries it at a glance:
    - ✅ Risk closed: the control is present and correct where the record says, and nothing nearby reopens the same risk. The problem is genuinely gone.
    - ❌ Risk not closed: the code contradicts the record, or shows the control incomplete or absent, OR the control is there but the risk is still reachable another way (for example a safe function was added next to the unsafe one, but the unsafe one still runs). The plan fix is effectively reopened, and the gap goes under Not yet holding.
    - ❓ Cannot tell from the code: the code does not make it clear enough to confirm or deny (for example, the control depends on configuration or a path not readable from the code alone). What is missing goes under Not yet holding.

  Say ❌ when a control exists but the risk persists. A control that does not finish the job is not a ✅.

  This report is reconciled, never append-only. On a re-run, re-read the code for each result: keep it if it still holds, rewrite it if the result flipped or the code moved on, and remove it if the record no longer carries the finding or it is gone from the code. Then add blocks only for findings newly verified.

  A finding proven ✅ Risk closed is stood down out of the whole chain once the user confirms, so this report holds the open verdicts, not a growing list of closed ones.
-->

### [FINDING_1_NAME] <!-- Example: the detect finding's name, copied verbatim from the record and detect.md so this is the same item. Do not rename it and do not add an action prefix. -->

- **Result:** [RESULT_1_RESULT] <!-- Example: one of ✅ Risk closed, ❌ Risk not closed, or ❓ Cannot tell from the code, with the icon first and the risk named in plain language. For an upload: "✅ Risk closed: uploads can no longer smuggle in a disguised file." Or: "❌ Risk not closed: a template can still run arbitrary code." -->
- **How proven:** [RESULT_1_METHOD] <!-- Example: the code you read at the control's Where, and how it matched (or did not) what the record claims, in plain language. For an upload: read handleUpload and saw it detects the file's real type from its content, enforces a size limit, and refuses anything else, exactly as the record claims. Or, contradicting the record: the record says the type is validated, but the code still trusts the type the client sends. -->
- **Evidence:** [RESULT_1_EVIDENCE] <!-- Example: a short, plain-language note of what you read (the function or area) and what the code showed there, such as "read handleUpload and saw it detects the real file type from content". Name the area, not the file path: the path lives in the tracking map. -->

### [FINDING_2_NAME]

- **Result:** [RESULT_2_RESULT]
- **How proven:** [RESULT_2_METHOD]
- **Evidence:** [RESULT_2_EVIDENCE]

### [FINDING_3_NAME]

- **Result:** [RESULT_3_RESULT]
- **How proven:** [RESULT_3_METHOD]
- **Evidence:** [RESULT_3_EVIDENCE]

## Applied sub-skills <!-- Optional. The sub-skills you applied this run, each with the verdict(s) it informed. List only the ones that applied. Reconcile with the results: a sub-skill drops off when every verdict it informed is gone. Remove this section if none applied. -->

- [SUBSKILL_NAME]: [SUBSKILL_CONTRIBUTION] <!-- Example: "regex: confirmed the bounded validator under 'Email validation' is safe". Name the results by their titles above, never a file path. -->

## Not yet holding <!-- Optional. List anything whose risk is not yet closed: a control with a ❌ Risk not closed result and the gap, a ❓ Cannot tell from the code control and what is missing to settle it, the unfinished part of a Partial control, or a Blocked control still waiting on harden. Each item names the control and the plan fix it traces to, so verify, harden, and the plan stay in step. A ❌ Risk not closed means the fix is effectively reopened: point it back to harden. Remove this section if every in-scope control is ✅ Risk closed. -->

- [NOT_HOLDING_ITEM] <!-- Example: a control whose result is ❌ Risk not closed or ❓ Cannot tell from the code, naming the control and the plan fix it traces to, with the gap (for instance, the size limit is enforced but the file-type check can be bypassed, so the upload risk is not closed), so harden can re-apply it -->
