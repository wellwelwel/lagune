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
const SKILL_PATH = '.lagune/skills/';

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

const appliedSkillsProblems = (detect: string): string[] => {
  if (!hasSection(detect, 'Applied sub-skills')) return [];

  const rows = sectionBullets(detect, 'Applied sub-skills');

  return rows.some((row) => row.includes(SKILL_PATH))
    ? []
    : [
        `the "Applied sub-skills" section names no sub-skill file under ${SKILL_PATH}`,
      ];
};

export const validateDetect = (detect: string): string[] => [
  ...titleProblems(detect, 'Detect Map'),
  ...placeholderProblems(detect),
  ...missingFieldProblems(detect, 'Scope'),
  ...dateProblems(detect, 'Mapped'),
  ...findingProblems(detect),
  ...appliedSkillsProblems(detect),
];
