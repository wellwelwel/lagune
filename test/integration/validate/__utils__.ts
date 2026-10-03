import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach } from 'poku';

const workspaces: string[] = [];

export const newWorkspace = async (): Promise<string> => {
  const workspace = await mkdtemp(join(tmpdir(), 'lagune-validate-'));

  workspaces.push(workspace);
  return workspace;
};

export const seedMemory = async (
  workspace: string,
  fileName: string,
  content: string
): Promise<void> => {
  const path = join(workspace, '.lagune/memory', fileName);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
};

afterEach(async () => {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true })
    )
  );

  workspaces.length = 0;
});

export const validCharter = `# Demo Security Charter

## Principles

### I. Secrets never live in code

Never commit a secret. Always load secrets from the environment.

- Why: a leaked key in git history is a full account takeover.

## Baseline discipline

Lagune holds this charter, every principle, every time.

### Only the controls the project needs

Lagune recommends and applies only the controls this project's context calls for.

- Why: effort spent on risks the project does not have buries the risks it does have.

### Prefer the simplest vetted control

Reach for the safest option already proven.

- Why: hand-rolled security is where subtle, unaudited bugs live.

### When a control seems skippable

A control is held even when a reason to skip it feels reasonable:

- "Too small to need a control": small gaps are where breaches start.

## Governance

This charter supersedes ad hoc decisions.

Version: 1.0.0 | Ratified: 2026-06-11
`;

export const validDetect = `# Demo Detect Map

- **Scope:** full project scan
- **Mapped:** 2026-06-11

## Findings

### Unrestricted file upload

- **What it is:** the system accepts files uploaded by users.
- **Why it matters:** a file disguised as an image could become code execution.
- **Evidence:** the upload route keeps the original filename.
`;

export const validPlan = `# Demo Defense Plan

- **Scope:** all detect findings
- **Planned:** 2026-06-12

## Fixes

### Unrestricted file upload

- **Category:** Unrestricted file upload (CWE-434)
- **CVSS:** CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N (9.3, Critical)
- **Priority:** Critical
- **Why this priority:** anyone can reach the upload over the internet.
- **Upholds:** All input is untrusted until validated
- **Fix:** validate the file's real type and size, and rename it on save.
`;

export const validHarden = `# Demo Hardening Record

- **Scope:** all plan fixes
- **Hardened:** 2026-06-13

## Applied

### Unrestricted file upload

- **Status:** Applied
- **What changed:** added real file-type and size validation.
- **Where:** the upload handler.
- **Verdict:** Pending
`;
