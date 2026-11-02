import { execFileSync as readPlaygroundProcess } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

type PlaygroundProcess = { parent: number; command: string };

const [entry, logFile, route] = process.argv.slice(2);

if (!entry || !logFile || !route) {
  process.stderr.write(
    'Usage: instrument.ts <engine entry> <log file> <route>\n'
  );
  process.exit(1);
}

const playgroundProcess = (processId: number): PlaygroundProcess | null => {
  try {
    const [parent, ...command] = readPlaygroundProcess(
      'ps',
      ['-ww', '-o', 'ppid=,command=', '-p', String(processId)],
      { encoding: 'utf8' }
    )
      .trim()
      .split(/\s+/);

    return { parent: Number(parent), command: command.join(' ') };
  } catch {
    return null;
  }
};

const playgroundLauncher = (
  processId: number,
  depth: number
): string | null => {
  if (depth === 0 || processId <= 1) return null;

  const found = playgroundProcess(processId);

  if (!found) return null;

  return found.command.startsWith('npm exec ')
    ? found.command
    : playgroundLauncher(found.parent, depth - 1);
};

const fields = [
  'at: new Date().toISOString()',
  'pid: process.pid',
  `route: ${JSON.stringify(route)}`,
  'args: process.argv.slice(2)',
  'cwd: process.cwd()',
  'parent: playgroundProcess(process.ppid)?.command ?? null',
  "npx: { command: playgroundLauncher(process.ppid, 3), yes: process.env.npm_config_yes === 'true' }",
];
// Node erases the types in place, leaving each function's source plain JavaScript
const prologue = [
  "import { appendFileSync as appendPlaygroundCall } from 'node:fs';",
  "import { execFileSync as readPlaygroundProcess } from 'node:child_process';",
  `const playgroundProcess = ${playgroundProcess.toString()};`,
  `const playgroundLauncher = ${playgroundLauncher.toString()};`,
  `try { appendPlaygroundCall(${JSON.stringify(logFile)}, JSON.stringify({ ${fields.join(', ')} }) + '\\n'); } catch {}`,
  `process.on('exit', (code) => { try { appendPlaygroundCall(${JSON.stringify(logFile)}, JSON.stringify({ at: new Date().toISOString(), pid: process.pid, exit: code }) + '\\n'); } catch {} });`,
  '',
].join('\n');

const source = await readFile(entry, 'utf8');
const shebangEnd = source.startsWith('#!') ? source.indexOf('\n') + 1 : 0;

await writeFile(
  entry,
  `${source.slice(0, shebangEnd)}${prologue}${source.slice(shebangEnd)}`
);
