import type {
  HistoryAppend,
  HistoryEntry,
  LockedState,
} from '../../types/core.js';
import { stripComments } from '../../core/markdown/comments.js';
import { bulletField } from '../../core/markdown/fields.js';
import { inlineText } from '../../core/markdown/lines.js';
import { sectionBlocks } from '../../core/markdown/sections.js';
import { readStateFile, writeStateFile } from '../../core/state-file.js';

const HISTORY_PATH = '.lagune/memory/history.md';
const DETECT_PATH = '.lagune/memory/detect.md';
const PLAN_PATH = '.lagune/memory/plan.md';
const HISTORY_SECTION = 'Closed findings';
const HISTORY_HEADER = `# Lagune History\n\n## ${HISTORY_SECTION}\n`;
const UNRANKED = 'Unranked';

const readMemory = async (
  cwd: string,
  file: string
): Promise<string | null> => {
  const raw = await readStateFile(cwd, file);

  return raw === null ? null : stripComments(raw);
};

const toIsoDate = (now: Date): string => now.toISOString().slice(0, 10);

const distill = (
  names: string[],
  detect: string | null,
  plan: string | null,
  closed: string
): HistoryEntry[] => {
  const detected = sectionBlocks(detect, 'Findings');
  const planned = sectionBlocks(plan, 'Fixes');
  const wanted = new Set(names);

  return detected
    .filter((block) => wanted.has(block.name))
    .map((block) => {
      const fix = planned.find((entry) => entry.name === block.name);

      return {
        name: block.name,
        classification:
          inlineText(fix ? bulletField(fix.body, 'Priority') : null) ||
          UNRANKED,
        category: inlineText(fix ? bulletField(fix.body, 'Category') : null),
        whatItIs: inlineText(bulletField(block.body, 'What it is')),
        closed,
      };
    });
};

const renderEntry = (entry: HistoryEntry): string =>
  [
    `### ${entry.name}`,
    '',
    `- **Classification:** ${entry.classification}`,
    ...(entry.category ? [`- **Category:** ${entry.category}`] : []),
    `- **What it is:** ${entry.whatItIs}`,
    `- **Closed:** ${entry.closed}`,
  ].join('\n');

const withTrailingBlank = (text: string): string => {
  if (text.endsWith('\n\n')) return text;
  if (text.endsWith('\n')) return `${text}\n`;

  return `${text}\n\n`;
};

export const appendClosedFindings = async (
  state: LockedState,
  names: string[],
  now: Date
): Promise<HistoryAppend> => {
  const [detect, plan] = await Promise.all([
    readMemory(state.cwd, DETECT_PATH),
    readMemory(state.cwd, PLAN_PATH),
  ]);

  const entries = distill(names, detect, plan, toIsoDate(now));

  if (entries.length === 0) return { file: HISTORY_PATH, recorded: [] };

  const existing =
    (await readStateFile(state.cwd, HISTORY_PATH)) ?? HISTORY_HEADER;
  const block = entries.map(renderEntry).join('\n\n');

  await writeStateFile(
    state,
    HISTORY_PATH,
    `${withTrailingBlank(existing)}${block}\n`
  );

  return { file: HISTORY_PATH, recorded: entries.map((entry) => entry.name) };
};
