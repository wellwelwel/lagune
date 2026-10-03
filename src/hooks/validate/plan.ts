import type { Block } from '../../types/core.js';
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
const CVSS_PREFIX = 'CVSS:4.0/';

const detectNames = (detect: string | null): string[] =>
  detect === null
    ? []
    : sectionBlocks(detect, 'Findings').map((block) => block.name);

const ratingProblems = (block: Block): string[] => {
  const cvss = bulletField(block.body, 'CVSS');

  return [
    ...(cvss !== null && !cvss.startsWith(CVSS_PREFIX)
      ? [
          `the CVSS line on the fix "${block.name}" does not carry a ${CVSS_PREFIX} vector`,
        ]
      : []),
    ...allowedValueProblems(
      'fix',
      block.name,
      'Priority',
      bulletField(block.body, 'Priority'),
      PRIORITY_BANDS
    ),
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
