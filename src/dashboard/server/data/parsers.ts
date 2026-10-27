import type {
  FindingSpecialization,
  Uphold,
} from '../../../types/dashboard/dashboard';
import { APPLIED_HEADINGS, appliedEntry } from '../../../core/markdown/applied';
import { bulletText } from '../../../core/markdown/lines';
import { withinSection } from '../../../core/markdown/sections';
import { specializationLabel } from '../../shared/specialization-meta';

const isAppliedHeading = (heading: string): boolean =>
  APPLIED_HEADINGS.some((header) =>
    heading.toLowerCase().includes(header.toLowerCase())
  );

const appliedRow = (line: string): FindingSpecialization | null => {
  const bullet = bulletText(line);
  const entry = bullet === null ? undefined : appliedEntry(bullet);

  if (entry === undefined) return null;

  return {
    name: entry.name,
    label: specializationLabel(entry.name),
    surfaced: entry.contribution,
  };
};

export const parseApplied = (text: string | null): FindingSpecialization[] => {
  const out: FindingSpecialization[] = [];

  for (const line of withinSection(text, isAppliedHeading)) {
    if (line.code) continue;

    const row = appliedRow(line.text);
    if (row) out.push(row);
  }
  return out;
};

const BASELINE_PHRASES = [
  'Prefer the simplest vetted control',
  'Only the controls the project needs',
];

const startsUphold = (text: string): boolean =>
  /^[IVXLC]+\.\s/.test(text) ||
  BASELINE_PHRASES.some((phrase) => text.startsWith(phrase));

const splitUpholds = (raw: string): string[] => {
  const [first, ...rest] = raw.split(',');
  const parts = [first];

  for (const piece of rest) {
    if (startsUphold(piece.trimStart())) parts.push(piece);
    else parts[parts.length - 1] += `,${piece}`;
  }

  return parts;
};

export const parseUpholds = (raw: string | null): Uphold[] => {
  if (!raw || /^none directly$/i.test(raw.trim())) return [];
  return splitUpholds(raw)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text) => {
      const numbered = text.match(/^([IVXLC]+)\.\s*(\S.*)?$/);
      if (numbered)
        return {
          baseline: false,
          label: `${numbered[1]} · ${numbered[2] ?? ''}`,
          full: text,
        };
      return { baseline: true, label: `Baseline · ${text}`, full: text };
    });
};
