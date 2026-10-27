import type {
  ReportHeadings,
  ScanFinding,
  ScanNote,
  ScanReport,
} from '../../types/scan.js';

const groupByFile = (
  items: readonly (ScanFinding | ScanNote)[]
): Map<string, string[]> => {
  const groups = new Map<string, string[]>();

  for (const { file, detail } of items) {
    const details = groups.get(file) ?? [];

    details.push(detail);
    groups.set(file, details);
  }

  return groups;
};

/** Lists each file once under the header, sorted, with its details indented beneath it */
export const groupedSection = (
  header: string,
  items: readonly (ScanFinding | ScanNote)[]
): string => {
  const blocks = [...groupByFile(items)]
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([file, details]) => {
      const lines = details.map((detail) => `  ${detail}`).join('\n');

      return `${file}\n${lines}`;
    });

  return `${header}\n\n${blocks.join('\n\n')}`;
};

export const formatReport = (
  report: ScanReport,
  headings: ReportHeadings
): string => {
  const sections: string[] = [];

  if (report.findings.length > 0)
    sections.push(groupedSection(headings.findings, report.findings));

  if (report.review.length > 0 && headings.review !== undefined)
    sections.push(groupedSection(headings.review, report.review));

  if (report.advisory.length > 0 && headings.advisory !== undefined)
    sections.push(groupedSection(headings.advisory, report.advisory));

  if (sections.length === 0) return headings.sentinel;

  return `${sections.join('\n\n')}\n`;
};
