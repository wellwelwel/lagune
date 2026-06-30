# [PROJECT_NAME] Defense Plan <!-- Example: the project's name followed by "Defense Plan" -->

- **Scope:** [SCOPE] <!-- Example: one of these, matching how it was run: all detect findings, or the named findings or paths, or the concern described -->
- **Planned:** [PLAN_DATE] <!-- Example: today's date in ISO format, such as 2026-06-11 -->

## Fixes

<!--
  One block per detect finding this plan acts on. The block's title is the finding's name, copied verbatim from the detect map (.bluespec/memory/detect.md): the same name detect used, so this is the same item, traced by its title alone with no separate pointer line. Detect already recorded what the finding is and the risk it carries, so this plan does not restate the risk, it decides what to do about it. Read the detect finding for the why, read this block for the fix. The file path is not written here: it lives in Blue Spec's tracking map.

  "Priority" comes from the risk detect recorded for the finding: Critical, High, Medium, or Low. "Why this priority" is one plain-language line justifying that level, without restating the risk. "Upholds" links the fix to the charter principle it supports (.bluespec/memory/charter.md), or several separated by commas when one fix supports more than one. Write "None directly" when there is no charter or no principle fits, and keep the fix. "Depends on" is optional: name another finding this fix must follow only when it truly cannot hold until that one lands first, since it sets the order to apply in, not the priority. When one finding needs more than one fix, write more than one paragraph under its single block, never a second block: one finding is one item.

  This plan is reconciled, never append-only. On a re-run, re-check each existing block: keep it if its finding is still in the detect map and still unfixed, rewrite it if the details changed, and remove it if detect shows the finding resolved or the code already applies the fix. Then add blocks only for what is genuinely new.
-->

### [FINDING_1_NAME]

<!-- Example: the detect finding's name, copied verbatim from detect.md so this is the same item. Do not rename it and do not add an action prefix like "Harden ". -->

- **Priority:** [FIX_1_PRIORITY] <!-- Example: one of Critical, High, Medium, or Low, taken from the risk detect recorded for the finding -->
- **Why this priority:** [FIX_1_PRIORITY_RATIONALE] <!-- Example: "A disguised file can run as code on the server. The upload is open to anyone right now." -->
- **Upholds:** [FIX_1_PRINCIPLE] <!-- Example: the charter principle this fix supports, such as "All input is untrusted until validated", or "None directly" when no charter is loaded or none fits -->
- **Depends on:** [FIX_1_DEPENDS_ON] <!-- Optional. Example: "User input validation", naming another finding this fix must follow. Omit this whole line when there is no real dependency. -->
- **Fix:** [FIX_1_CONTROL] <!-- Example: the control to apply, described not applied. For an unchecked upload: validate the file's real type and size, reject anything unexpected, rename it on save, and store it where it cannot be run as code. -->

### [FINDING_2_NAME]

- **Priority:** [FIX_2_PRIORITY]
- **Why this priority:** [FIX_2_PRIORITY_RATIONALE]
- **Upholds:** [FIX_2_PRINCIPLE]
- **Fix:** [FIX_2_CONTROL]

### [FINDING_3_NAME]

- **Priority:** [FIX_3_PRIORITY]
- **Why this priority:** [FIX_3_PRIORITY_RATIONALE]
- **Upholds:** [FIX_3_PRINCIPLE]
- **Fix:** [FIX_3_CONTROL]

## Open questions

<!--
  Optional. List anything in scope that the detect map did not cover, so a later pass or the user can resolve it before a fix is planned with confidence. Remove this section if there are none.
-->

- [OPEN_QUESTION_ITEM] <!-- Example: a path or concern in scope that the detect map does not cover yet, so no fix is planned for it until detect maps it -->
