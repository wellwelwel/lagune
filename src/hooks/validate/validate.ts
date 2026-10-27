import type {
  ArtifactValidation,
  HookResult,
  MemoryContents,
  ValidateSummary,
  ValidateTarget,
} from '../../types/core.js';
import { join } from 'node:path';
import { CONFIGS_FILE } from '../../core/configs.js';
import { commentSpans, stripComments } from '../../core/markdown/comments.js';
import { readText } from '../../core/markdown/read.js';
import { charterWarnings, validateCharter } from './charter.js';
import { configsWarnings } from './configs.js';
import { validateDetect } from './detect.js';
import { validateHarden } from './harden.js';
import { planWarnings, validatePlan } from './plan.js';

const MEMORY_FILES: Record<ValidateTarget, string> = {
  charter: '.lagune/memory/charter.md',
  detect: '.lagune/memory/detect.md',
  plan: '.lagune/memory/plan.md',
  harden: '.lagune/memory/harden.md',
};

const TARGETS: ValidateTarget[] = ['charter', 'detect', 'plan', 'harden'];

const RULES: Record<
  ValidateTarget,
  (content: string, memory: MemoryContents) => string[]
> = {
  charter: (content) => validateCharter(content),
  detect: (content) => validateDetect(content),
  plan: (content, memory) => validatePlan(content, memory.detect),
  harden: (content, memory) => validateHarden(content, memory.plan),
};

const WARNING_RULES: Record<ValidateTarget, (content: string) => string[]> = {
  charter: (content) => charterWarnings(content),
  detect: () => [],
  plan: (content) => planWarnings(content),
  harden: () => [],
};

const isTarget = (value: string): value is ValidateTarget =>
  TARGETS.some((target) => target === value);

const parseTargets = (raw: string): ValidateTarget[] => {
  const requested = raw.trim();

  if (requested === '') return [...TARGETS];

  if (!isTarget(requested))
    throw new Error(
      'validate input needs one of charter, detect, plan, or harden, or no argument to validate every memory artifact'
    );

  return [requested];
};

const strippedOf = (content: string | null): string | null =>
  content === null ? null : stripComments(content);

const commentWarnings = (content: string): string[] => {
  const count = commentSpans(content).length;

  if (count === 0) return [];

  const phrase =
    count === 1 ? 'one markdown comment' : `${count} markdown comments`;

  return [
    `the file carries ${phrase}, likely leftover template guidance that nothing in the chain reads`,
  ];
};

const validateOne = (
  memory: MemoryContents,
  stripped: MemoryContents,
  target: ValidateTarget,
  required: boolean
): ArtifactValidation => {
  const file = MEMORY_FILES[target];
  const content = memory[target];
  const structural = stripped[target];

  if (content === null || structural === null)
    return {
      target,
      file,
      status: 'absent',
      problems: required
        ? [
            `${file} is missing. Make sure the artifact was written at this exact path, moving it here if it was saved elsewhere, then rerun this hook.`,
          ]
        : [],
      warnings: [],
    };

  const problems = RULES[target](structural, stripped);

  return {
    target,
    file,
    status: problems.length === 0 ? 'valid' : 'invalid',
    problems,
    warnings: [
      ...WARNING_RULES[target](structural),
      ...commentWarnings(content),
    ],
  };
};

const validateArtifacts = (
  memory: MemoryContents,
  targets: ValidateTarget[],
  required: boolean
): ArtifactValidation[] => {
  const stripped: MemoryContents = {
    charter: strippedOf(memory.charter),
    detect: strippedOf(memory.detect),
    plan: strippedOf(memory.plan),
    harden: strippedOf(memory.harden),
  };

  return targets.map((target) =>
    validateOne(memory, stripped, target, required)
  );
};

const loadMemory = async (targetDir: string): Promise<MemoryContents> => {
  const [charter, detect, plan, harden] = await Promise.all(
    TARGETS.map((target) => readText(join(targetDir, MEMORY_FILES[target])))
  );

  return { charter, detect, plan, harden };
};

const ALL_CLEAR = 'no template drift found\n';
const NOTHING_TO_VALIDATE =
  'no memory artifact exists under .lagune/memory/. Make sure the memories were written in that exact directory, moving them there if they were saved elsewhere, then rerun this hook.\n';
const INSTRUCTION =
  'Fix each problem above, then rerun this hook until it prints "no template drift found".';

const problemsFound = (results: ArtifactValidation[]): boolean =>
  results.some((result) => result.problems.length > 0);

const allAbsent = (results: ArtifactValidation[]): boolean =>
  results.every((result) => result.status === 'absent');

const formatProblems = (result: ArtifactValidation): string | null => {
  if (result.problems.length === 0) return null;

  if (result.status === 'absent') return result.problems.join('\n');

  return [
    `${result.file} drifted from its template:`,
    ...result.problems.map((problem) => `- ${problem}`),
  ].join('\n');
};

const formatWarnings = (file: string, warnings: string[]): string | null =>
  warnings.length === 0
    ? null
    : [
        `${file} deserves attention:`,
        ...warnings.map((warning) => `- ${warning}`),
      ].join('\n');

const formatArtifacts = (results: ArtifactValidation[]): string => {
  const sections = results
    .flatMap((result) => [
      formatProblems(result),
      formatWarnings(result.file, result.warnings),
    ])
    .filter((section): section is string => section !== null);

  if (sections.length === 0)
    return allAbsent(results) ? NOTHING_TO_VALIDATE : ALL_CLEAR;

  if (!problemsFound(results))
    return `${ALL_CLEAR}\n${sections.join('\n\n')}\n`;

  const instruction = results.some((result) => result.status === 'invalid')
    ? [INSTRUCTION]
    : [];

  return `${[...sections, ...instruction].join('\n\n')}\n`;
};

const formatSummary = (summary: ValidateSummary): string => {
  const artifacts = formatArtifacts(summary.results);
  const configs = formatWarnings(CONFIGS_FILE, summary.configsWarnings);

  return configs === null ? artifacts : `${artifacts}\n${configs}\n`;
};

export const validate = async (
  targetDir: string,
  payload: string
): Promise<HookResult> => {
  const targets = parseTargets(payload);
  const [memory, configs] = await Promise.all([
    loadMemory(targetDir),
    readText(join(targetDir, CONFIGS_FILE)),
  ]);
  const summary: ValidateSummary = {
    results: validateArtifacts(memory, targets, payload.trim() !== ''),
    configsWarnings: configsWarnings(configs),
  };

  return {
    output: formatSummary(summary),
    hasFinding: problemsFound(summary.results) || allAbsent(summary.results),
  };
};
