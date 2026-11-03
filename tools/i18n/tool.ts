import type { Site } from './site';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { translationLocales } from '../../website/i18n/locales';
import { checkLocale, renderReport } from './check';
import { resolveDoc } from './docs';
import {
  MESSAGE_FILES,
  messageFilePath,
  readMessages,
  regenerate,
  serializeMessages,
} from './messages';
import { copyPage, diffPage, stampPage } from './pages';
import { displayPath, resolveLocale, WEBSITE } from './site';

export type ToolResult = {
  code: number;
  stdout: string;
  stderr: string;
};

type Command = {
  usage: string;
  arity: number[];
  run: (site: Site, args: string[]) => Promise<ToolResult>;
};

const succeeded = (stdout: string): ToolResult => ({
  code: 0,
  stdout,
  stderr: '',
});

const failed = (stderr: string): ToolResult => ({
  code: 1,
  stdout: '',
  stderr,
});

const addLocale = async (
  site: Site,
  [code = '']: string[]
): Promise<ToolResult> => {
  const locale = await resolveLocale(site, code);
  const lines = await Promise.all(
    MESSAGE_FILES.map(async (file) => {
      const target = await messageFilePath(locale, file);
      const { messages, added, dropped, marked } = regenerate(
        await file.englishMessages(site),
        await readMessages(target)
      );

      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, serializeMessages(messages), 'utf8');

      return [
        `${displayPath(site, target)}: ${Object.keys(messages).length} messages, ${added.length} new, ${marked.length} to translate`,
        ...dropped.map((id) => `  dropped ${id}, which English no longer has`),
      ].join('\n');
    })
  );

  return succeeded(lines.join('\n'));
};

const pageCommand =
  (operation: typeof copyPage): Command['run'] =>
  async (site, [code = '', docId = '']) =>
    succeeded(
      await operation(
        site,
        await resolveLocale(site, code),
        await resolveDoc(site, docId)
      )
    );

const checkLocales = async (
  site: Site,
  [code]: string[]
): Promise<ToolResult> => {
  const locales = await Promise.all(
    (code === undefined
      ? translationLocales().map((locale) => locale.code)
      : [code]
    ).map((localeCode) => resolveLocale(site, localeCode))
  );
  const reports = await Promise.all(
    locales.map((locale) => checkLocale(site, locale))
  );
  const hasErrors = reports.some((report) =>
    report.findings.some(({ severity }) => severity === 'error')
  );

  return {
    code: hasErrors ? 1 : 0,
    stdout: reports.map(renderReport).join('\n\n'),
    stderr: '',
  };
};

const COMMANDS: Record<string, Command> = {
  add: {
    usage:
      "add <code>              Generates a registered locale's code.json, nav.json, and data.json, keeping every translation",
    arity: [1],
    run: addLocale,
  },
  copy: {
    usage:
      'copy <code> <doc id>    Copies an English page into the locale folder and records its source_hash',
    arity: [2],
    run: pageCommand(copyPage),
  },
  stamp: {
    usage:
      'stamp <code> <doc id>   Accepts the current English source for a re-synced translation',
    arity: [2],
    run: pageCommand(stampPage),
  },
  diff: {
    usage:
      "diff <code> <doc id>    Shows what changed in English since the translation's source_hash",
    arity: [2],
    run: pageCommand(diffPage),
  },
  check: {
    usage:
      'check [<code>]          Reports coverage, stale pages, and parity, failing on any error',
    arity: [0, 1],
    run: checkLocales,
  },
};

const USAGE = [
  'Usage: bun run --cwd website i18n <command>',
  '',
  ...Object.values(COMMANDS).map(({ usage }) => `  ${usage}`),
].join('\n');

export const runTool = async (
  args: string[],
  site: Site = WEBSITE
): Promise<ToolResult> => {
  const [name = '', ...rest] = args;
  const command = Object.hasOwn(COMMANDS, name) ? COMMANDS[name] : undefined;

  if (command === undefined || !command.arity.includes(rest.length))
    return failed(USAGE);

  try {
    return await command.run(site, rest);
  } catch (error) {
    return failed(error instanceof Error ? error.message : String(error));
  }
};
