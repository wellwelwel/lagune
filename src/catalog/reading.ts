import type { SpecializationPhase } from '../types/catalog.js';
import { deepFreeze } from '../core/collections.js';
import { bulletText } from '../core/markdown/lines.js';

export const SPECIALIZATION_PHASES: readonly SpecializationPhase[] = deepFreeze(
  ['detect', 'verify']
);

const SECTION_MARKER = '## ';
const GUIDANCE_HEADING = 'how to act on the result';
const QUOTE_MARKER = '>';
const SOURCE_LEAD = 'Source:';
const PHASE_LEAD = '**In ';

export const isSpecializationPhase = (
  value: string
): value is SpecializationPhase =>
  SPECIALIZATION_PHASES.some((phase) => phase === value);

export const isBlank = (text: string | undefined): boolean =>
  text === undefined || text.trim() === '';

const isIndented = (line: string): boolean =>
  line.startsWith(' ') || line.startsWith('\t');

const isSection = (line: string): boolean => line.startsWith(SECTION_MARKER);

const isGuidanceHeading = (line: string): boolean =>
  isSection(line) &&
  line.slice(SECTION_MARKER.length).trim().toLowerCase() === GUIDANCE_HEADING;

const unquoted = (line: string): string => line;

const quoted = (line: string): string | undefined => {
  if (!line.startsWith(QUOTE_MARKER)) return undefined;

  const content = line.slice(QUOTE_MARKER.length);

  return content.startsWith(' ') ? content.slice(1) : content;
};

const isSourceCredit = (line: string): boolean => {
  const content = quoted(line);

  if (content === undefined) return false;

  return bulletText(content)?.startsWith(SOURCE_LEAD) === true;
};

const phaseAddressed = (line: string): SpecializationPhase | undefined => {
  const item = bulletText(line);

  if (item === null || !item.startsWith(PHASE_LEAD)) return undefined;

  const label = item.slice(PHASE_LEAD.length);

  return SPECIALIZATION_PHASES.find((phase) => label.startsWith(phase));
};

const addressesAnother = (
  line: string,
  reader: SpecializationPhase | undefined
): boolean => {
  const addressed = phaseAddressed(line);

  return addressed !== undefined && addressed !== reader;
};

/** Where a list item ends: after the last indented line under its bullet */
const itemEnd = (
  lines: string[],
  bullet: number,
  contentOf: (line: string) => string | undefined
): number => {
  let end = bullet + 1;

  for (let index = end; index < lines.length; index += 1) {
    const content = contentOf(lines[index]);

    if (content === undefined) break;
    if (isBlank(content)) continue;
    if (!isIndented(content)) break;

    end = index + 1;
  }

  return end;
};

/** The lines without the list items a rule drops, leaving one blank line where an item sat between two */
const withoutItems = (
  lines: string[],
  drops: (line: string) => boolean,
  contentOf: (line: string) => string | undefined
): string[] => {
  const kept: string[] = [];
  let index = 0;

  while (index < lines.length) {
    if (!drops(lines[index])) {
      kept.push(lines[index]);
      index += 1;
      continue;
    }

    index = itemEnd(lines, index, contentOf);

    if (isBlank(kept.at(-1)) && isBlank(lines[index])) index += 1;
  }

  return kept;
};

const sectionStart = (lines: string[], from: number): number => {
  const start = lines.findIndex(
    (line, index) => index >= from && isSection(line)
  );

  return start === -1 ? lines.length : start;
};

/** The lines without the source credit the opening quote carries */
const withoutSource = (lines: string[]): string[] => {
  const opening = sectionStart(lines, 0);

  return [
    ...withoutItems(lines.slice(0, opening), isSourceCredit, quoted),
    ...lines.slice(opening),
  ];
};

/** The lines without the guidance addressed to a phase other than the reader, and no guidance section when none is left */
const withGuidanceFor = (
  lines: string[],
  reader: SpecializationPhase | undefined
): string[] => {
  const heading = lines.findIndex(isGuidanceHeading);

  if (heading === -1) return lines;

  const end = sectionStart(lines, heading + 1);
  const [title, ...guidance] = withoutItems(
    lines.slice(heading, end),
    (line) => addressesAnother(line, reader),
    unquoted
  );
  const section = guidance.every(isBlank) ? [] : [title, ...guidance];

  return [...lines.slice(0, heading), ...section, ...lines.slice(end)];
};

/** The specialization as its reader needs it: without its source credit, and with the guidance addressed to a phase only when that phase is the reader */
export const tailorSpecialization = (
  text: string,
  reader: SpecializationPhase | undefined
): string =>
  withGuidanceFor(withoutSource(text.split('\n')), reader).join('\n');
