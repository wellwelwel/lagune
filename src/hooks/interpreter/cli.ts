import type { HookResult } from '../../types/core.js';
import type { ReportHeadings } from '../../types/scan.js';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { parseArgs as parseNodeArgs } from 'node:util';
import { scanReport } from '../../core/scan/driver.js';
import { SOURCE_FILTER } from '../../core/scan/filters.js';
import { formatReport } from '../../core/scan/report.js';
import { analyze, classify } from './interpreter.js';
import { isSupportedLanguage, SUPPORTED_LANGUAGES } from './patterns.js';

const OPTIONS = {
  pattern: { type: 'string', short: 'p', multiple: true },
  lang: { type: 'string', short: 'l' },
  dir: { type: 'string', short: 'd', multiple: true },
  file: { type: 'string', short: 'f', multiple: true },
} as const;

const HEADINGS: ReportHeadings = {
  sentinel: 'no dynamic-execution sinks found\n',
  findings: 'Dynamic-execution sinks found:',
  review: 'Dynamic-execution sinks to review (read them, never run them):',
};

const LANGUAGE_LIST = SUPPORTED_LANGUAGES.join(', ');

const runCheck = (snippets: string[], lang: string | undefined): HookResult => {
  if (lang === undefined)
    throw new Error(`-p needs -l <language> (${LANGUAGE_LIST})`);

  if (!isSupportedLanguage(lang))
    throw new Error(`unknown language "${lang}": use ${LANGUAGE_LIST}`);

  const verdicts = snippets.map((snippet) => classify(snippet, lang));

  return { output: verdicts.join('\n') + '\n', hasFinding: false };
};

const runScan = async (targets: string[]): Promise<HookResult> => {
  const root = cwd();
  const paths = (targets.length > 0 ? targets : ['.']).map((target) =>
    resolve(root, target)
  );
  const report = await scanReport(root, paths, SOURCE_FILTER, analyze);

  return { output: formatReport(report, HEADINGS), hasFinding: false };
};

export const run = async (args: string[]): Promise<HookResult> => {
  const { values } = parseNodeArgs({ args, options: OPTIONS, strict: true });
  const snippets = values.pattern ?? [];
  const targets = [...(values.dir ?? []), ...(values.file ?? [])];

  if (snippets.length > 0) {
    if (targets.length > 0)
      throw new Error(
        '-p checks a snippet and cannot be combined with -d or -f'
      );

    return runCheck(snippets, values.lang);
  }

  return runScan(targets);
};
