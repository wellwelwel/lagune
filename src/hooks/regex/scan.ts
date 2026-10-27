import type {
  ExtractedFile,
  RegexAssessment,
  RegexCandidate,
  RegexFinding,
  RegexScanResult,
} from '../../types/hooks/regex.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SOURCE_FILTER } from '../../core/scan/filters.js';
import { languageOf } from '../../core/scan/language.js';
import { walk } from '../../core/scan/walk.js';
import { extractPatterns, readingKey } from './extract.js';
import { assessReadings } from './pool.js';
import { regexUsage } from './usage.js';

const byReading = (left: RegexCandidate, right: RegexCandidate): number =>
  left.source.localeCompare(right.source) ||
  left.flags.localeCompare(right.flags);

const extractFile = async (
  root: string,
  file: string
): Promise<ExtractedFile | null> => {
  const language = languageOf(file);

  if (language === null) return null;

  let text;

  try {
    text = await readFile(join(root, file), 'utf8');
  } catch {
    return null;
  }

  return {
    file,
    candidates: extractPatterns(text, language).toSorted(byReading),
    ...regexUsage(text, language),
  };
};

const isExtracted = (entry: ExtractedFile | null): entry is ExtractedFile =>
  entry !== null;

const distinctReadings = (
  extracted: readonly ExtractedFile[]
): Map<string, RegexCandidate> =>
  new Map(
    extracted.flatMap(({ candidates }) =>
      candidates.map((candidate): [string, RegexCandidate] => [
        readingKey(candidate),
        candidate,
      ])
    )
  );

const findingsOf = (
  extracted: readonly ExtractedFile[],
  assessments: ReadonlyMap<string, RegexAssessment>,
  verdict: 'unsafe' | 'undetermined'
): RegexFinding[] =>
  extracted.flatMap(({ file, candidates }) =>
    candidates.flatMap((candidate) => {
      const assessment = assessments.get(readingKey(candidate));

      return assessment?.verdict === verdict
        ? [
            {
              file,
              source: candidate.source,
              flags: candidate.flags,
              reason: assessment.reason,
              scope: assessment.scope,
            },
          ]
        : [];
    })
  );

const filesWhere = (
  extracted: readonly ExtractedFile[],
  holds: (entry: ExtractedFile) => boolean
): string[] =>
  extracted
    .filter(holds)
    .map(({ file }) => file)
    .toSorted((left, right) => left.localeCompare(right));

/** Maps ReDoS-prone, unsettled, and dynamic regexes across paths, judging each distinct reading once */
export const scan = async (
  root: string,
  targets: string[],
  repetitionLimit?: number
): Promise<RegexScanResult> => {
  const walked = await Promise.all(
    targets.map((target) => walk(root, target, SOURCE_FILTER))
  );
  const files = [...new Set(walked.flat())];
  const read = await Promise.all(files.map((file) => extractFile(root, file)));
  const extracted = read.filter(isExtracted);
  const assessments = await assessReadings(
    distinctReadings(extracted),
    repetitionLimit
  );

  return {
    unsafe: findingsOf(extracted, assessments, 'unsafe'),
    undetermined: findingsOf(extracted, assessments, 'undetermined'),
    dynamic: filesWhere(extracted, ({ dynamic }) => dynamic),
    staticWrap: filesWhere(extracted, ({ staticWrap }) => staticWrap),
  };
};
