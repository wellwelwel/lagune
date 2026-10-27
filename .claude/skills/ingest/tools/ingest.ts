import type { Command, Options } from './types.ts';
import { parseArgs } from 'node:util';
import { anchors } from './commands/anchors.ts';
import { extract } from './commands/extract.ts';
import { files } from './commands/files.ts';
import { is } from './commands/is.ts';
import { outline } from './commands/outline.ts';
import { overview } from './commands/overview.ts';
import { read } from './commands/read.ts';
import { search } from './commands/search.ts';
import { tree } from './commands/tree.ts';
import { loadDigest } from './digest.ts';
import { fail } from './fail.ts';

const USAGE = `Usage: node ${process.argv[1]} <command> <file...> [flags]

Commands
  is         Whether each file is a GitIngest digest, reading only its first bytes
  overview   Size, token estimate, top-level areas, extensions, landmarks, largest files
  tree       Directory tree with file counts and token estimates (--depth)
  files      Flat file list with line counts and token estimates (--sort size)
  search     Lines matching any --term or --pattern
  outline    Declarations and headings of the selected files, with line numbers
  read       File contents with line numbers (--path, --lines, --at path:start-end)
  extract    Write the selected text files under an empty --out directory
  anchors    Check that every \`path:start-end\` anchor in --synthesis resolves

Scope (every command)
  --under <dir>    Only files under this directory, repeatable
  --ext <.ext>     Only files with this extension (or exact name), repeatable
  --name <text>    Only files whose name contains this text
  --noise          Include lockfiles, source maps, minified files, snapshots, and SVGs

Search
  --term <text>    Literal text to find, repeatable
  --pattern <re>   Regular expression, repeatable
  --case           Match case exactly, for terms and patterns
  --context <n>    Lines around each match (default 0)
  --per-file <n>   Matches shown per file (default 8)
  --files-only     List matching files with their match counts

Read
  --path <path>    File to read, repeatable
  --lines <a:b>    Line range for every --path
  --at <anchor>    path:start-end, repeatable

Other
  --limit <n>      Cap on printed results or lines
  --depth <n>      Tree depth (default 2)
  --sort <key>     files: path (default) or size
  --out <dir>      extract: destination, must be missing or empty
  --synthesis <f>  anchors: the synthesis document to check`;

const parseCount = <Fallback>(
  value: string | undefined,
  flag: string,
  fallback: Fallback
): number | Fallback => {
  if (value === undefined) return fallback;

  const count = Number(value);

  return Number.isInteger(count) && count >= 0
    ? count
    : fail(`${flag} must be a non-negative integer, got: ${value}`);
};

const parseSort = (value: string | undefined): Options['sort'] => {
  if (value === undefined || value === 'path') return 'path';
  if (value === 'size') return 'size';

  return fail(`--sort must be path or size, got: ${value}`);
};

const COMMANDS = new Map<string, Command>([
  ['overview', overview],
  ['tree', tree],
  ['files', files],
  ['search', search],
  ['outline', outline],
  ['read', read],
  ['extract', extract],
  ['anchors', anchors],
]);

const parseArguments = (argv: string[]) => {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      help: { type: 'boolean', short: 'h' },
      under: { type: 'string', multiple: true },
      ext: { type: 'string', multiple: true },
      name: { type: 'string' },
      noise: { type: 'boolean' },
      term: { type: 'string', multiple: true },
      pattern: { type: 'string', multiple: true },
      case: { type: 'boolean' },
      context: { type: 'string' },
      'per-file': { type: 'string' },
      'files-only': { type: 'boolean' },
      path: { type: 'string', multiple: true },
      lines: { type: 'string' },
      at: { type: 'string', multiple: true },
      limit: { type: 'string' },
      depth: { type: 'string' },
      sort: { type: 'string' },
      out: { type: 'string' },
      synthesis: { type: 'string' },
    },
  });
  const [command = '', ...digests] = positionals;
  const options: Options = {
    scope: {
      under: values.under ?? [],
      extensions: (values.ext ?? []).map((extension) =>
        extension.startsWith('.') ? extension.toLowerCase() : extension
      ),
      name: values.name ?? null,
      noise: values.noise ?? false,
    },
    terms: values.term ?? [],
    patterns: values.pattern ?? [],
    caseSensitive: values.case ?? false,
    context: parseCount(values.context, '--context', 0),
    limit: parseCount(values.limit, '--limit', null),
    perFile: parseCount(values['per-file'], '--per-file', 8),
    filesOnly: values['files-only'] ?? false,
    paths: values.path ?? [],
    at: values.at ?? [],
    lines: values.lines ?? null,
    depth: parseCount(values.depth, '--depth', 2),
    sort: parseSort(values.sort),
    out: values.out ?? null,
    synthesis: values.synthesis ?? null,
  };

  return { help: values.help ?? false, command, digests, options };
};

const run = async (): Promise<void> => {
  const { help, command, digests, options } = parseArguments(
    process.argv.slice(2)
  );
  const handler = COMMANDS.get(command);
  const known = handler !== undefined || command === 'is';

  if (help || !known) {
    process.stdout.write(`${USAGE}\n`);

    if (!help) process.exitCode = 1;

    return;
  }

  if (digests.length === 0) fail(`${command} needs at least one file`);

  const lines =
    handler === undefined
      ? await is(digests)
      : await handler(await Promise.all(digests.map(loadDigest)), options);

  process.stdout.write(`${lines.join('\n')}\n`);
};

run().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
});
