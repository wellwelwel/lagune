import type { Block } from '../../types/core.js';
import { bulletField } from '../../core/markdown/fields.js';
import { sectionBlocks, sectionBullets } from '../../core/markdown/sections.js';
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

const APPLIED_FIELDS = ['Status', 'What changed', 'Where', 'Verdict'];
const STATUS_VALUES = ['Applied', 'Partial', 'Blocked'];
const VERDICT_VALUES = ['Pending', '❌ Reproved', '❓ Inconclusive'];
const REASONED_VERDICTS = ['❌ Reproved', '❓ Inconclusive'];

const verdictProblems = (block: Block): string[] => {
  const verdict = bulletField(block.body, 'Verdict');
  const reason = bulletField(block.body, 'Reason');

  return [
    ...allowedValueProblems(
      'applied block',
      block.name,
      'Verdict',
      verdict,
      VERDICT_VALUES
    ),
    ...(verdict !== null &&
    REASONED_VERDICTS.includes(verdict) &&
    reason === null
      ? [
          `the applied block "${block.name}" carries a "${verdict}" Verdict with no "Reason" line`,
        ]
      : []),
    ...(verdict === 'Pending' && reason !== null
      ? [
          `the applied block "${block.name}" carries a "Reason" while its Verdict is Pending`,
        ]
      : []),
  ];
};

const remainingProblems = (harden: string, blocks: Block[]): string[] => {
  const remaining = sectionBullets(harden, 'Remaining');

  return blocks.flatMap((block) => {
    const status = bulletField(block.body, 'Status');

    if (status !== 'Partial' && status !== 'Blocked') return [];

    return remaining.some((item) => item.includes(block.name))
      ? []
      : [
          `the applied block "${block.name}" is ${status} but no "Remaining" entry names it`,
        ];
  });
};

const traceProblems = (blocks: Block[], plan: string | null): string[] => {
  if (plan === null)
    return [
      'the defense plan is absent, so no applied block can be traced back to a fix',
    ];

  const fixes = new Set(
    sectionBlocks(plan, 'Fixes').map((block) => block.name)
  );

  return blocks
    .filter((block) => !fixes.has(block.name))
    .map(
      (block) =>
        `the applied block "${block.name}" matches no fix in the defense plan`
    );
};

export const validateHarden = (
  harden: string,
  plan: string | null
): string[] => {
  const blocks = sectionBlocks(harden, 'Applied');
  const shape = sectionBlockProblems(harden, 'Applied', blocks, 'applied');

  return [
    ...titleProblems(harden, 'Hardening Record'),
    ...placeholderProblems(harden),
    ...missingFieldProblems(harden, 'Scope'),
    ...dateProblems(harden, 'Hardened'),
    ...(shape.length > 0
      ? shape
      : [
          ...duplicateNameProblems('applied blocks', blocks),
          ...blocks.flatMap((block) => [
            ...requiredFieldProblems('applied block', block, APPLIED_FIELDS),
            ...allowedValueProblems(
              'applied block',
              block.name,
              'Status',
              bulletField(block.body, 'Status'),
              STATUS_VALUES
            ),
            ...verdictProblems(block),
          ]),
          ...remainingProblems(harden, blocks),
          ...traceProblems(blocks, plan),
        ]),
  ];
};
