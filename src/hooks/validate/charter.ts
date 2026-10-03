import { afterSeparator, bulletField } from '../../core/markdown/fields.js';
import {
  firstParagraph,
  sectionBlocks,
  sectionIntro,
} from '../../core/markdown/sections.js';
import {
  duplicateNameProblems,
  hasSection,
  isIsoDate,
  placeholderProblems,
  requiredFieldProblems,
  sectionBlockProblems,
  structuralLines,
  titleProblems,
} from './shared.js';

const BASELINE_BLOCKS = [
  'Only the controls the project needs',
  'Prefer the simplest vetted control',
  'When a control seems skippable',
];

const VERSION_LABEL = 'version';
const RATIFIED_LABEL = 'ratified';

const principleProblems = (charter: string): string[] => {
  const blocks = sectionBlocks(charter, 'Principles');
  const shape = sectionBlockProblems(
    charter,
    'Principles',
    blocks,
    'principle'
  );

  if (shape.length > 0) return shape;

  return [
    ...duplicateNameProblems('principles', blocks),
    ...blocks.flatMap((block) => [
      ...(firstParagraph(block.body) === ''
        ? [`the principle "${block.name}" is missing its rule paragraph`]
        : []),
      ...requiredFieldProblems('principle', block, ['Why']),
    ]),
  ];
};

const baselineProblems = (charter: string): string[] => {
  if (!hasSection(charter, 'Baseline discipline'))
    return ['the "Baseline discipline" section is missing'];

  const present = new Set(
    sectionBlocks(charter, 'Baseline discipline').map((block) => block.name)
  );

  return BASELINE_BLOCKS.filter((name) => !present.has(name)).map(
    (name) =>
      `the "${name}" block is missing from the "Baseline discipline" section`
  );
};

const labelValue = (
  line: string,
  label: string,
  from: number
): string | null => {
  const index = line.toLowerCase().indexOf(label, from);

  if (index === -1) return null;

  const cursor = afterSeparator(line, index + label.length);

  if (cursor === -1) return null;

  const value = line.slice(cursor).trim().split(' ')[0].split('|')[0];

  return value === '' ? null : value;
};

const versionLineProblems = (charter: string): string[] => {
  const line = structuralLines(charter).find(
    (text) =>
      text.slice(0, VERSION_LABEL.length).toLowerCase() === VERSION_LABEL &&
      afterSeparator(text, VERSION_LABEL.length) !== -1
  );

  if (line === undefined)
    return [
      'the "Version: <version> | Ratified: <date>" line is missing from the "Governance" section',
    ];

  const ratified = labelValue(line, RATIFIED_LABEL, VERSION_LABEL.length);

  if (ratified === null)
    return ['the version line carries no "Ratified:" date'];

  return isIsoDate(ratified)
    ? []
    : [`the ratification date "${ratified}" is not an ISO date (YYYY-MM-DD)`];
};

const governanceProblems = (charter: string): string[] => {
  if (!hasSection(charter, 'Governance'))
    return ['the "Governance" section is missing'];

  return [
    ...(sectionIntro(charter, 'Governance') === ''
      ? ['the "Governance" section is empty']
      : []),
    ...versionLineProblems(charter),
  ];
};

export const validateCharter = (charter: string): string[] => [
  ...titleProblems(charter, 'Security Charter'),
  ...placeholderProblems(charter),
  ...principleProblems(charter),
  ...baselineProblems(charter),
  ...governanceProblems(charter),
];

const PRINCIPLE_CEILING = 1024;
const WHY_CEILING = 512;

export const charterWarnings = (charter: string): string[] =>
  sectionBlocks(charter, 'Principles').flatMap((block) => {
    const why = bulletField(block.body, 'Why');

    return [
      ...(block.body.length > PRINCIPLE_CEILING
        ? [
            `the principle "${block.name}" runs ${block.body.length} characters where ${PRINCIPLE_CEILING} is already generous, so consider tightening its rule`,
          ]
        : []),
      ...(why !== null && why.length > WHY_CEILING
        ? [
            `the "Why" line on the principle "${block.name}" runs ${why.length} characters where ${WHY_CEILING} is already generous, so consider tightening the risk to one line`,
          ]
        : []),
    ];
  });
