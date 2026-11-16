import type {
  BoundCandidate,
  ExtractedFile,
  ReachingFile,
  RegexCandidate,
  RegexEvidence,
  TieredFile,
} from '../../types/hooks/regex.js';
import type { LanguageId } from '../../types/scan.js';
import { readingKey } from './extract.js';

const DECLARES = /reg(?:ular)?_?ex/i;

const SUGGESTS = /pattern/i;

const TAKES_TEXT = /escape|quote|literal/i;

const NONE: ReadonlySet<string> = new Set();

const FAMILIES: Partial<Record<LanguageId, LanguageId>> = {
  cpp: 'c',
  objc: 'c',
  kotlin: 'java',
  scala: 'java',
};

/** The family of languages a language shares its declarations with */
export const familyOf = (language: LanguageId): LanguageId =>
  FAMILIES[language] ?? language;

/** Joins the names the regex calls of every file compile, by language family */
export const reachingNames = (
  extracted: readonly ReachingFile[]
): Map<LanguageId, Set<string>> => {
  const families = new Map<LanguageId, Set<string>>();

  for (const { language, reaching } of extracted) {
    const family = familyOf(language);
    const names = families.get(family) ?? new Set<string>();

    for (const name of reaching) names.add(name);

    families.set(family, names);
  }

  return families;
};

const isNamed = (
  { names, label }: BoundCandidate,
  holds: (name: string) => boolean
): boolean => names.some(holds) || (label !== '' && holds(label));

const calleeSays = ({ callee }: BoundCandidate, cue: RegExp): boolean =>
  callee !== '' && cue.test(callee) && !TAKES_TEXT.test(callee);

const evidenceOf = (
  candidate: BoundCandidate,
  reaching: ReadonlySet<string>,
  untraced: boolean
): RegexEvidence => {
  if (
    isNamed(candidate, (name) => reaching.has(name) || DECLARES.test(name)) ||
    calleeSays(candidate, DECLARES)
  )
    return 'proven';

  return untraced ||
    isNamed(candidate, (name) => SUGGESTS.test(name)) ||
    calleeSays(candidate, SUGGESTS)
    ? 'plausible'
    : 'none';
};

const byReading = (left: RegexCandidate, right: RegexCandidate): number =>
  left.source.localeCompare(right.source) ||
  left.flags.localeCompare(right.flags);

const distinct = (
  candidates: readonly RegexCandidate[],
  except: ReadonlySet<string> = NONE
): RegexCandidate[] =>
  [
    ...new Map(
      candidates.map(({ source, flags }): [string, RegexCandidate] => [
        readingKey({ source, flags }),
        { source, flags },
      ])
    ),
  ]
    .filter(([key]) => !except.has(key))
    .map(([, candidate]) => candidate)
    .toSorted(byReading);

/** The language families that hold a string none of these files proves a regex, the only ones another file could still prove */
export const unprovenFamilies = (
  extracted: readonly ExtractedFile[],
  reaching: ReadonlyMap<LanguageId, ReadonlySet<string>>
): Set<LanguageId> =>
  new Set(
    extracted
      .filter(({ language, bound }) => {
        const reached = reaching.get(familyOf(language)) ?? NONE;

        return bound.some(
          (candidate) => evidenceOf(candidate, reached, false) !== 'proven'
        );
      })
      .map(({ language }) => familyOf(language))
  );

/** Sets the tier each string of a file earns: proven when its code compiles it, binds it to a name a regex call compiles, or names it a regex, and plausible when a name only suggests a pattern or the file compiles a value none of its own strings is bound to */
export const tiersOf = (
  entry: ExtractedFile,
  reaching: ReadonlyMap<LanguageId, ReadonlySet<string>>
): TieredFile => {
  const reached = reaching.get(familyOf(entry.language)) ?? NONE;
  const held = new Set(entry.names);
  const untraced = entry.receivers.some(
    (names) => !names.some((name) => held.has(name))
  );
  const judged = entry.bound.map((candidate) => ({
    candidate,
    evidence: evidenceOf(candidate, reached, untraced),
  }));
  const earning = (tier: RegexEvidence): BoundCandidate[] =>
    judged
      .filter(({ evidence }) => evidence === tier)
      .map(({ candidate }) => candidate);
  const proven = distinct([...entry.proven, ...earning('proven')]);

  return {
    file: entry.file,
    proven,
    plausible: distinct(earning('plausible'), new Set(proven.map(readingKey))),
  };
};
