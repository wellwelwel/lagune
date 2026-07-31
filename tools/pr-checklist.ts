import { readFile } from 'node:fs/promises';
import process, { argv, env } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export type ChecklistItem = {
  ticked: boolean;
  label: string;
};

type PullRequest = {
  number: number;
  body: string;
};

type Credentials = {
  token: string;
  eventPath: string;
  repository: string;
};

export const CHECKLIST_START = '<!-- lagune:checklist:start -->';
export const CHECKLIST_END = '<!-- lagune:checklist:end -->';

const BULLETS = new Set(['-', '*']);
const MARKS = new Set([' ', 'x', 'X']);
const GITHUB_API = 'https://api.github.com';
const TEMPLATE_PATH = fileURLToPath(
  new URL('../.github/pull_request_template.md', import.meta.url)
);

export const CLOSING_COMMENT = [
  '### This pull request was closed automatically',
  '',
  'This contribution falls outside the [guidelines](https://github.com/wellwelwel/lagune/blob/main/CONTRIBUTING.md), or arrived corrupted. Either way, work written with care cannot be told apart here from work that was generated and opened with nobody looking.',
  '',
  "You're welcome to reopen this pull request once a human has reviewed it from end to end 🤝",
].join('\n');

export const readPullRequest = (payload: unknown): PullRequest => {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('pull_request' in payload)
  )
    throw new Error('The event payload carries no pull request.');

  const pullRequest = payload.pull_request;

  if (typeof pullRequest !== 'object' || pullRequest === null)
    throw new Error('The pull request payload is not an object.');

  const number = 'number' in pullRequest ? pullRequest.number : undefined;

  if (typeof number !== 'number' || !Number.isInteger(number) || number <= 0)
    throw new Error('The pull request payload carries no valid number.');

  const body =
    'body' in pullRequest && typeof pullRequest.body === 'string'
      ? pullRequest.body
      : '';

  return { number, body };
};

const isMeaningful = (character: string) => {
  const code = character.codePointAt(0) ?? 0;

  if (code < 0x20 || code === 0x7f) return false;
  if (code >= 0x202a && code <= 0x202e) return false;
  if (code >= 0x2066 && code <= 0x2069) return false;

  return true;
};

const normalizeLabel = (label: string) =>
  Array.from(label).filter(isMeaningful).join('').trim();

export const parseChecklistItem = (line: string): ChecklistItem | undefined => {
  const trimmed = line.trim();

  if (!BULLETS.has(trimmed.slice(0, 1))) return undefined;

  const afterBullet = trimmed.slice(1);
  const box = afterBullet.trimStart();

  if (box === afterBullet) return undefined;
  if (box.slice(0, 1) !== '[' || box.slice(2, 3) !== ']') return undefined;

  const mark = box.slice(1, 2);

  if (!MARKS.has(mark)) return undefined;

  return { ticked: mark !== ' ', label: normalizeLabel(box.slice(3)) };
};

const readChecklistItems = (source: string) =>
  source
    .split('\n')
    .map((line) => parseChecklistItem(line))
    .filter((item) => item !== undefined);

export const readRequiredLabels = (template: string) => {
  const opening = template.indexOf(CHECKLIST_START);
  const closing = template.indexOf(
    CHECKLIST_END,
    opening + CHECKLIST_START.length
  );

  if (opening === -1 || closing === -1)
    throw new Error('The pull request template carries no checklist markers.');

  const required = readChecklistItems(
    template.slice(opening + CHECKLIST_START.length, closing)
  ).map((item) => item.label);

  if (required.length === 0)
    throw new Error('The pull request template carries no checklist.');

  return required;
};

export const answersRequired = (body: string, required: string[]) => {
  const ticked = new Set(
    readChecklistItems(body)
      .filter((item) => item.ticked)
      .map((item) => item.label)
  );

  return required.every((label) => ticked.has(label));
};

const readCredentials = (): Credentials => {
  const { GITHUB_TOKEN, GITHUB_EVENT_PATH, GITHUB_REPOSITORY } = env;

  if (!GITHUB_TOKEN || !GITHUB_EVENT_PATH || !GITHUB_REPOSITORY)
    throw new Error(
      'Missing GITHUB_TOKEN, GITHUB_EVENT_PATH, or GITHUB_REPOSITORY.'
    );

  return {
    token: GITHUB_TOKEN,
    eventPath: GITHUB_EVENT_PATH,
    repository: GITHUB_REPOSITORY,
  };
};

const request = async (
  credentials: Credentials,
  path: string,
  method: string,
  body: unknown
) => {
  const response = await fetch(
    `${GITHUB_API}/repos/${credentials.repository}${path}`,
    {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${credentials.token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok)
    throw new Error(
      `${method} ${path} failed with ${response.status} ${response.statusText}.`
    );
};

const closePullRequest = async (
  credentials: Credentials,
  pullRequest: PullRequest
) => {
  await request(credentials, `/pulls/${pullRequest.number}`, 'PATCH', {
    state: 'closed',
  });

  console.log(`Closed pull request #${pullRequest.number}.`);

  await request(credentials, `/issues/${pullRequest.number}/comments`, 'POST', {
    body: CLOSING_COMMENT,
  });
};

const run = async () => {
  const credentials = readCredentials();
  const required = readRequiredLabels(await readFile(TEMPLATE_PATH, 'utf8'));
  const payload: unknown = JSON.parse(
    await readFile(credentials.eventPath, 'utf8')
  );
  const pullRequest = readPullRequest(payload);

  if (answersRequired(pullRequest.body, required)) {
    console.log(
      `Pull request #${pullRequest.number} answered all ${required.length} required items.`
    );
    return;
  }

  await closePullRequest(credentials, pullRequest);
};

if (import.meta.url === pathToFileURL(argv[1] ?? '').href)
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
