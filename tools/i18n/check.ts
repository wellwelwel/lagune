import type { TranslationMessages } from '../../website/src/data/messages';
import type { SourceDoc } from './docs';
import type { MessageFile } from './messages';
import type { LocaleFolder, Site } from './site';
import { readFile } from 'node:fs/promises';
import { docsNav } from '../../website/plugins/docs-content/nav';
import {
  pageState,
  SOURCE_HASH,
  sourceHash,
} from '../../website/plugins/docs-content/translation';
import { pageFiles, sourceDocs } from './docs';
import { frontmatterOf } from './frontmatter';
import {
  isMarked,
  MESSAGE_FILES,
  messageFilePath,
  readMessages,
} from './messages';
import { translationFile } from './pages';
import { pageParity, textParity } from './parity';
import { displayPath, readIfPresent } from './site';

export type Severity = 'error' | 'warning';

export type Finding = {
  severity: Severity;
  subject: string;
  problem: string;
};

export type Coverage = {
  name: string;
  translated: number;
  total: number;
};

export type PageCounts = {
  translated: number;
  stale: number;
  untranslated: number;
};

export type LocaleReport = {
  locale: LocaleFolder;
  pages: PageCounts;
  messages: Coverage[];
  findings: Finding[];
};

type PageReport = {
  state: keyof PageCounts;
  findings: Finding[];
};

type MessageReport = {
  coverage: Coverage;
  findings: Finding[];
};

const MINIMUM_CATEGORY = 'get-started';

const finding = (
  severity: Severity,
  subject: string,
  problem: string
): Finding => ({
  severity,
  subject,
  problem,
});

const attempt = async <Result>(
  run: () => Promise<Result>
): Promise<Result | Error> => {
  try {
    return await run();
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
};

const minimumDocIds = (docs: SourceDoc[]): Set<string> => {
  const category = docsNav.find(
    (entry) => typeof entry !== 'string' && entry.key === MINIMUM_CATEGORY
  );
  const items = typeof category === 'object' ? category.items : [];

  return new Set([
    ...items,
    ...docs
      .filter((doc) => doc.parent !== undefined && items.includes(doc.parent))
      .map((doc) => doc.docId),
  ]);
};

const untranslatedSeverity = (
  locale: LocaleFolder,
  inMinimum: boolean
): Severity =>
  locale.status === 'published' && inMinimum ? 'error' : 'warning';

const checkMessages = async (
  locale: LocaleFolder,
  file: MessageFile,
  english: TranslationMessages
): Promise<MessageReport> => {
  const total = Object.keys(english).length;
  const empty = { name: file.name, translated: 0, total };
  const current = await attempt(async () =>
    readMessages(await messageFilePath(locale, file))
  );

  if (current instanceof Error)
    return {
      coverage: empty,
      findings: [finding('error', file.name, current.message)],
    };

  if (current === undefined)
    return {
      coverage: empty,
      findings: [
        finding(
          untranslatedSeverity(locale, true),
          file.name,
          `is missing, so run add ${locale.code}`
        ),
      ],
    };

  const translatedIds = Object.keys(english).filter((id) => {
    const message = Object.hasOwn(current, id) ? current[id] : undefined;

    return message !== undefined && !isMarked(message);
  });
  const parity = translatedIds.flatMap((id) =>
    textParity(english[id]?.message ?? '', current[id]?.message ?? '').map(
      (problem) => finding('error', `${file.name} ${id}`, problem)
    )
  );
  const unknown = Object.keys(current)
    .filter((id) => !Object.hasOwn(english, id))
    .map((id) =>
      finding(
        'warning',
        `${file.name} ${id}`,
        `no longer exists in English, so add ${locale.code} drops it`
      )
    );
  const untranslated = total - translatedIds.length;

  return {
    coverage: { name: file.name, translated: translatedIds.length, total },
    findings: [
      ...parity,
      ...unknown,
      ...(untranslated > 0
        ? [
            finding(
              untranslatedSeverity(locale, true),
              file.name,
              `has ${untranslated} untranslated messages, each still marked in its description`
            ),
          ]
        : []),
    ],
  };
};

const checkPage = async (
  locale: LocaleFolder,
  doc: SourceDoc,
  inMinimum: boolean
): Promise<PageReport> => {
  const translated = await attempt(async () =>
    readIfPresent(await translationFile(locale, doc))
  );

  if (translated instanceof Error)
    return {
      state: 'untranslated',
      findings: [finding('error', doc.docId, translated.message)],
    };

  if (translated === undefined)
    return {
      state: 'untranslated',
      findings: [
        finding(
          untranslatedSeverity(locale, inMinimum),
          doc.docId,
          'is untranslated'
        ),
      ],
    };

  const english = await readFile(doc.file, 'utf8');
  const recorded = frontmatterOf(translated)?.source_hash;
  const state = pageState({ sourceHash: recorded }, sourceHash(english));
  const hashProblem =
    typeof recorded !== 'string'
      ? 'has no source_hash, so run stamp once it matches English'
      : SOURCE_HASH.test(recorded)
        ? undefined
        : 'has a malformed source_hash, and only copy and stamp write it';

  return {
    state,
    findings: [
      ...(hashProblem ? [finding('error', doc.docId, hashProblem)] : []),
      ...(state === 'stale'
        ? [
            finding(
              'warning',
              doc.docId,
              'is stale: English changed since it was translated, so run diff, update it, then stamp'
            ),
          ]
        : []),
      ...pageParity(english, translated).map((problem) =>
        finding('error', doc.docId, problem)
      ),
    ],
  };
};

const orphanFindings = async (
  site: Site,
  locale: LocaleFolder,
  docs: SourceDoc[]
): Promise<Finding[]> => {
  const translatedFiles = await attempt(() => pageFiles(locale.contentFolder));

  if (translatedFiles instanceof Error) return [];

  const sources = new Set(docs.map((doc) => doc.relativeFile));

  return translatedFiles
    .filter((relativeFile) => !sources.has(relativeFile))
    .map((relativeFile) =>
      finding(
        'warning',
        displayPath(site, `${locale.contentFolder}/${relativeFile}`),
        'has no English source, so it never renders'
      )
    );
};

const countStates = (reports: PageReport[]): PageCounts => ({
  translated: reports.filter(({ state }) => state === 'translated').length,
  stale: reports.filter(({ state }) => state === 'stale').length,
  untranslated: reports.filter(({ state }) => state === 'untranslated').length,
});

export const checkLocale = async (
  site: Site,
  locale: LocaleFolder
): Promise<LocaleReport> => {
  const docs = await sourceDocs(site);
  const minimum = minimumDocIds(docs);
  const messages = await Promise.all(
    MESSAGE_FILES.map(async (file) =>
      checkMessages(locale, file, await file.englishMessages(site))
    )
  );
  const pages = await Promise.all(
    docs.map((doc) => checkPage(locale, doc, minimum.has(doc.docId)))
  );

  return {
    locale,
    pages: countStates(pages),
    messages: messages.map(({ coverage }) => coverage),
    findings: [
      ...messages.flatMap(({ findings }) => findings),
      ...pages.flatMap(({ findings }) => findings),
      ...(await orphanFindings(site, locale, docs)),
    ],
  };
};

export const renderReport = (report: LocaleReport): string => {
  const errors = report.findings.filter(({ severity }) => severity === 'error');
  const warnings = report.findings.filter(
    ({ severity }) => severity === 'warning'
  );
  const { translated, stale, untranslated } = report.pages;

  return [
    `${report.locale.code}, ${report.locale.label}, ${report.locale.status}`,
    `Pages: ${translated} translated, ${stale} stale, ${untranslated} untranslated`,
    `Messages: ${report.messages
      .map(({ name, translated, total }) => `${name} ${translated} of ${total}`)
      .join(', ')}`,
    ...[...errors, ...warnings].map(
      ({ severity, subject, problem }) => `${severity} ${subject}: ${problem}`
    ),
    `${errors.length} errors, ${warnings.length} warnings`,
  ].join('\n');
};
