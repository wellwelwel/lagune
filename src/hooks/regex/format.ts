import type { RegexFinding, RegexScanResult } from '../../types/hooks/regex.js';
import { groupedSection } from '../../core/scan/report.js';

const EMPTY = 'no unsafe patterns found\n';

const UNSAFE_HEADER = 'Vulnerable regular expressions found:';

const UNDETERMINED_HEADER =
  'Regular expressions the analysis could not settle (review manually):';

const DYNAMIC_HEADER =
  'Dynamically built regular expressions (review manually by simulating a constructed regex):';

const STATIC_WRAP_HEADER =
  'Static regex wrapped in a constructor (use a literal instead):';

const findingLine = ({
  source,
  flags,
  reason,
  scope,
}: RegexFinding): string => {
  const details = [
    reason,
    ...(scope === null ? [] : [scope]),
    ...(flags === '' ? [] : [`flags: ${flags}`]),
  ];

  return `${source} (${details.join(', ')})`;
};

const findingSection = (header: string, findings: RegexFinding[]): string =>
  groupedSection(
    header,
    findings.map((finding) => ({
      file: finding.file,
      detail: findingLine(finding),
    }))
  );

const fileSection = (header: string, files: string[]): string =>
  `${header}\n\n${files.join('\n')}`;

export const format = ({
  unsafe,
  undetermined,
  dynamic,
  staticWrap,
}: RegexScanResult): string => {
  const sections: string[] = [];

  if (unsafe.length > 0) sections.push(findingSection(UNSAFE_HEADER, unsafe));
  if (undetermined.length > 0)
    sections.push(findingSection(UNDETERMINED_HEADER, undetermined));
  if (dynamic.length > 0) sections.push(fileSection(DYNAMIC_HEADER, dynamic));
  if (staticWrap.length > 0)
    sections.push(fileSection(STATIC_WRAP_HEADER, staticWrap));

  if (sections.length === 0) return EMPTY;

  return `${sections.join('\n\n')}\n`;
};
