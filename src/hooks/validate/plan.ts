import type { Block, PlanRatingCheck } from '../../types/core.js';
import type { CvssSeverity } from '../../types/cvss.js';
import { isDefined } from '../../core/cvss/metrics.js';
import { CVSS_PREFIX, isProblem, parseVector } from '../../core/cvss/parse.js';
import {
  formatScore,
  rateVector,
  readRatingLine,
} from '../../core/cvss/rating.js';
import { bulletField } from '../../core/markdown/fields.js';
import { sectionBlocks } from '../../core/markdown/sections.js';
import {
  allowedValueProblems,
  dateProblems,
  duplicateNameProblems,
  missingFieldProblems,
  placeholderProblems,
  requiredFieldProblems,
  sectionBlockProblems,
  titleProblems,
} from './shared.js';

const FIX_FIELDS = [
  'Category',
  'CVSS',
  'Priority',
  'Why this priority',
  'Upholds',
  'Fix',
];
const PRIORITY_BANDS = ['Critical', 'High', 'Medium', 'Low'];

const detectNames = (detect: string | null): string[] =>
  detect === null
    ? []
    : sectionBlocks(detect, 'Findings').map((block) => block.name);

const unchecked = (problem: string): PlanRatingCheck => ({
  problem,
  severity: null,
});

const checkRating = (name: string, cvss: string): PlanRatingCheck => {
  if (!cvss.startsWith(CVSS_PREFIX))
    return unchecked(
      `the CVSS line on the fix "${name}" does not carry a ${CVSS_PREFIX} vector`
    );

  const written = readRatingLine(cvss);

  if (written === null)
    return unchecked(
      `the CVSS line on the fix "${name}" is not the vector followed by "(score, band)"`
    );

  const reading = parseVector(written.vector);

  if (isProblem(reading))
    return unchecked(
      `the CVSS line on the fix "${name}" carries an invalid vector: ${reading.problem}`
    );

  const { overall } = rateVector(reading.metrics);

  if (overall.score !== written.score || overall.severity !== written.severity)
    return unchecked(
      `the CVSS line on the fix "${name}" reads (${formatScore(written)}), but its vector scores (${formatScore(overall)}): run the cvss hook and copy the score and band it prints`
    );

  return { problem: null, severity: overall.severity };
};

const priorityProblems = (
  name: string,
  priority: string | null,
  severity: CvssSeverity | null
): string[] => {
  if (
    priority === null ||
    severity === null ||
    !PRIORITY_BANDS.includes(priority)
  )
    return [];

  if (severity === 'None')
    return [
      `the CVSS line on the fix "${name}" scores (0.0, None), which fits no Priority band`,
    ];

  return priority === severity
    ? []
    : [
        `the Priority "${priority}" on the fix "${name}" is not the band "${severity}" its CVSS line scores`,
      ];
};

const ratingProblems = (block: Block): string[] => {
  const cvss = bulletField(block.body, 'CVSS');
  const priority = bulletField(block.body, 'Priority');
  const check =
    cvss === null
      ? { problem: null, severity: null }
      : checkRating(block.name, cvss);

  return [
    ...(check.problem === null ? [] : [check.problem]),
    ...allowedValueProblems(
      'fix',
      block.name,
      'Priority',
      priority,
      PRIORITY_BANDS
    ),
    ...priorityProblems(block.name, priority, check.severity),
  ];
};

const traceProblems = (blocks: Block[], detect: string | null): string[] => {
  if (detect === null)
    return [
      'the detect map is absent, so no fix can be traced back to a finding',
    ];

  const findings = new Set(detectNames(detect));

  return blocks
    .filter((block) => !findings.has(block.name))
    .map(
      (block) => `the fix "${block.name}" matches no finding in the detect map`
    );
};

const loopsBack = (
  start: string,
  dependencies: Map<string, string | null>
): boolean => {
  const seen = new Set<string>();
  let current = dependencies.get(start) ?? null;

  while (current !== null) {
    if (current === start) return true;
    if (seen.has(current)) return false;

    seen.add(current);
    current = dependencies.get(current) ?? null;
  }

  return false;
};

const dependencyProblems = (
  blocks: Block[],
  detect: string | null
): string[] => {
  const known = new Set([
    ...blocks.map((block) => block.name),
    ...detectNames(detect),
  ]);
  const dependencies = new Map(
    blocks.map((block) => [block.name, bulletField(block.body, 'Depends on')])
  );

  const unknown = blocks.flatMap((block) => {
    const dependency = dependencies.get(block.name) ?? null;

    if (dependency === null || known.has(dependency)) return [];

    return [
      `the dependency "${dependency}" on the fix "${block.name}" names no fix or detect finding`,
    ];
  });

  const loops = blocks
    .filter((block) => loopsBack(block.name, dependencies))
    .map(
      (block) =>
        `the dependency chain on the fix "${block.name}" loops back to itself`
    );

  return [...unknown, ...loops];
};

export const validatePlan = (plan: string, detect: string | null): string[] => {
  const blocks = sectionBlocks(plan, 'Fixes');
  const shape = sectionBlockProblems(plan, 'Fixes', blocks, 'fix');

  return [
    ...titleProblems(plan, 'Defense Plan'),
    ...placeholderProblems(plan),
    ...missingFieldProblems(plan, 'Scope'),
    ...dateProblems(plan, 'Planned'),
    ...(shape.length > 0
      ? shape
      : [
          ...duplicateNameProblems('fixes', blocks),
          ...blocks.flatMap((block) => [
            ...requiredFieldProblems('fix', block, FIX_FIELDS),
            ...ratingProblems(block),
          ]),
          ...traceProblems(blocks, detect),
          ...dependencyProblems(blocks, detect),
        ]),
  ];
};

const threatWarnings = (block: Block): string[] => {
  const cvss = bulletField(block.body, 'CVSS');
  const reading = cvss === null ? null : parseVector(cvss.split(/\s+/)[0]);

  if (reading === null || isProblem(reading) || !isDefined(reading.metrics.E))
    return [];

  return [
    `the CVSS line on the fix "${block.name}" carries the Threat metric E, which the rating guide keeps out of scope`,
  ];
};

export const planWarnings = (plan: string): string[] =>
  sectionBlocks(plan, 'Fixes').flatMap(threatWarnings);
