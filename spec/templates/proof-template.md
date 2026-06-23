# [FINDING_NAME] <!-- The detect finding's name, verbatim and identical to its section title in the detect map, so this advisory traces back to the finding by name. -->

> This is a defensive proof for responsible disclosure: an automated regression test that asserts the safe behavior and fails while the issue is live. It is not an exploit. <!-- Keep this framing line. Every advisory opens with it. -->

<!--
  This advisory is self-contained on purpose: the user may paste it into a private GitHub Gist per vulnerability, where there is no parent README and no sibling files. Do not reference the proofs index or other findings here. The only outward pointer is the run command for this finding's own test. Write every part in plain language a non-developer can act on. Fill every placeholder and leave no bracket token behind.
-->

**Severity:** [SEVERITY] <!-- Example: Critical, High, Medium, or Low, with one plain-language clause on why it sits there. -->
**Category / CVE:** [CATEGORY_OR_CVE] <!-- Example: the risk class it maps to (such as "SQL injection" or "Prototype pollution"), and a CVE identifier if one already exists for it. If there is no CVE, name the class alone. -->
**Affected:** [AFFECTED] <!-- Example: the affected component and version range, such as "acme-uploads, all versions up to and including 1.4.2". Read it from the project's manifest (package.json name and version) and the finding's location. If the version range cannot be determined from the code, name the component and say the range is unconfirmed rather than guessing. -->

## Impact

[IMPACT] <!-- Example: in plain language, what an attacker gains while the issue is live, and who is affected. State the concrete consequence, not just the mechanism. -->

## How it reproduces

[REPRO] <!-- Example: what the test exercises and what the safe behavior should be. Describe the input and the expected secure outcome, so a reader understands what the proof checks without reading the code. -->

## Proof of Concept

[RUN_COMMAND] <!-- Example: the command that runs this finding's test, matching the runner used, such as "node --test .bluespec/proofs/<slug>/report.test.mjs" for the native Node.js runner, or "node .bluespec/proofs/<slug>/report.test.mjs" when the project uses Poku. Note that it fails while the issue persists and passes once the code is fixed, so a passing run is the evidence the risk is closed. -->

## References <!-- Optional. Add links that give the reviewer context, such as the CWE page for the category, an OWASP cheat sheet, or the source the finding was distilled from. One per line. Remove this whole section when there is nothing to cite beyond the category already named above. Never invent a reference. -->

- [REFERENCE] <!-- Example: "CWE-78: OS Command Injection, https://cwe.mitre.org/data/definitions/78.html" -->
