import type {
  ReportHeadings,
  ScanDetail,
  ScanReport,
  SkippedCounts,
} from '../../types/scan.js';
import { allOf, deepFreeze } from '../collections.js';
import { CONFIGS_FILE } from '../configs.js';

const SKIPPED_ORIGINS: readonly (readonly [keyof SkippedCounts, string])[] =
  deepFreeze([
    ['git', 'Git'],
    ['configs', CONFIGS_FILE],
  ]);

const groupByFile = (items: readonly ScanDetail[]): Map<string, string[]> => {
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
  items: readonly ScanDetail[]
): string => {
  const blocks = [...groupByFile(items)]
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([file, details]) => {
      const lines = details.map((detail) => `  ${detail}`).join('\n');

      return `${file}\n${lines}`;
    });

  return `${header}\n\n${blocks.join('\n\n')}`;
};

const ignoredBy = (count: number, origin: string): string =>
  `${count} ${count === 1 ? 'path' : 'paths'} that ${origin} ignores`;

/** Ends a report with how many paths the scan left out, by what ignores them */
export const withSkipped = (output: string, skipped: SkippedCounts): string => {
  const counted = SKIPPED_ORIGINS.filter(([origin]) => skipped[origin] > 0).map(
    ([origin, name]) => ignoredBy(skipped[origin], name)
  );

  if (counted.length === 0) return output;

  return `${output}\nSkipped ${allOf(counted)}. Name one with --dir or --file to scan it.\n`;
};

const reportBody = (report: ScanReport, headings: ReportHeadings): string => {
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

export const formatReport = (
  report: ScanReport,
  headings: ReportHeadings
): string => withSkipped(reportBody(report, headings), report.skipped);
