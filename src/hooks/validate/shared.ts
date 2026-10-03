import type { Block } from '../../types/core.js';
import { bulletField } from '../../core/markdown/fields.js';
import { headingLevel, markdownLines } from '../../core/markdown/lines.js';

const PLACEHOLDER_TOKEN = /\[[A-Z][A-Z0-9_]*\](?!\()/g;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const structuralLines = (text: string): string[] =>
  markdownLines(text)
    .filter((line) => !line.code)
    .map((line) => line.text);

export const isIsoDate = (value: string): boolean => ISO_DATE.test(value);

export const oneOf = (values: string[]): string => {
  if (values.length <= 1) return values[0] ?? '';
  if (values.length === 2) return `${values[0]} or ${values[1]}`;

  return `${values.slice(0, -1).join(', ')}, or ${values[values.length - 1]}`;
};

export const placeholderProblems = (text: string): string[] => {
  const tokens = structuralLines(text).flatMap((line) =>
    [...line.matchAll(PLACEHOLDER_TOKEN)].map((match) => match[0])
  );

  return [...new Set(tokens)].map(
    (token) => `the placeholder token ${token} was left unfilled`
  );
};

export const titleProblems = (text: string, suffix: string): string[] =>
  structuralLines(text).some(
    (line) => headingLevel(line) === 1 && line.trim().endsWith(suffix)
  )
    ? []
    : [`the "# <project name> ${suffix}" title heading is missing`];

export const hasSection = (text: string, header: string): boolean =>
  structuralLines(text).some(
    (line) =>
      line.startsWith('## ') &&
      line.slice(3).trim().toLowerCase() === header.toLowerCase()
  );

export const missingFieldProblems = (text: string, field: string): string[] =>
  bulletField(text, field) === null
    ? [`the "${field}" line is missing or empty`]
    : [];

export const dateProblems = (text: string, field: string): string[] => {
  const value = bulletField(text, field);

  if (value === null) return [`the "${field}" line is missing or empty`];

  return isIsoDate(value)
    ? []
    : [`the "${field}" date "${value}" is not an ISO date (YYYY-MM-DD)`];
};

export const sectionBlockProblems = (
  text: string,
  section: string,
  blocks: Block[],
  kind: string
): string[] => {
  if (!hasSection(text, section))
    return [`the "${section}" section is missing`];

  return blocks.length === 0
    ? [`the "${section}" section has no ${kind} block`]
    : [];
};

export const duplicateNameProblems = (
  kindPlural: string,
  blocks: Block[]
): string[] => {
  const names = blocks.map((block) => block.name);
  const repeated = names.filter((name, index) => names.indexOf(name) !== index);

  return [...new Set(repeated)].map(
    (name) =>
      `two ${kindPlural} share the name "${name}", so the chain cannot tell them apart`
  );
};

export const requiredFieldProblems = (
  kind: string,
  block: Block,
  fields: string[]
): string[] =>
  fields
    .filter((field) => bulletField(block.body, field) === null)
    .map(
      (field) =>
        `the "${field}" line is missing or empty on the ${kind} "${block.name}"`
    );

export const allowedValueProblems = (
  kind: string,
  name: string,
  field: string,
  value: string | null,
  allowed: string[]
): string[] => {
  if (value === null || allowed.includes(value)) return [];

  return [
    `the ${field} "${value}" on the ${kind} "${name}" is not one of ${oneOf(allowed)}`,
  ];
};
