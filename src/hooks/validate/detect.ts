import {
  APPLIED_HEADINGS,
  appliedEntry,
  LEGACY_SPECIALIZATION_PATH,
} from '../../core/markdown/applied.js';
import { sectionBlocks, sectionBullets } from '../../core/markdown/sections.js';
import {
  dateProblems,
  duplicateNameProblems,
  hasSection,
  missingFieldProblems,
  placeholderProblems,
  requiredFieldProblems,
  sectionBlockProblems,
  titleProblems,
} from './shared.js';

const FINDING_FIELDS = ['What it is', 'Why it matters', 'Evidence'];

const findingProblems = (detect: string): string[] => {
  const blocks = sectionBlocks(detect, 'Findings');
  const shape = sectionBlockProblems(detect, 'Findings', blocks, 'finding');

  if (shape.length > 0) return shape;

  return [
    ...duplicateNameProblems('findings', blocks),
    ...blocks.flatMap((block) =>
      requiredFieldProblems('finding', block, FINDING_FIELDS)
    ),
  ];
};

const namesSpecialization = (row: string): boolean =>
  row.includes(LEGACY_SPECIALIZATION_PATH) || appliedEntry(row) !== undefined;

const appliedProblems = (detect: string): string[] => {
  const heading = APPLIED_HEADINGS.find((header) => hasSection(detect, header));

  if (heading === undefined) return [];

  return sectionBullets(detect, heading).some(namesSpecialization)
    ? []
    : [`the "${heading}" section names no specialization`];
};

export const validateDetect = (detect: string): string[] => [
  ...titleProblems(detect, 'Detect Map'),
  ...placeholderProblems(detect),
  ...missingFieldProblems(detect, 'Scope'),
  ...dateProblems(detect, 'Mapped'),
  ...findingProblems(detect),
  ...appliedProblems(detect),
];
