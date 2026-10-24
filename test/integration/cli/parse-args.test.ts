import { describe, it, strict } from 'poku';
import { parseCliArgs } from '../../../src/cli/parse-args.js';

describe('commands and their values', () => {
  it('reads the categories after add --categories', () => {
    const parsed = parseCliArgs(['add', '--categories', 'owasp', 'javascript']);

    strict.strictEqual(parsed.command, 'add');
    strict.strictEqual(parsed.categoriesRequested, true);
    strict.deepStrictEqual(parsed.values, ['owasp', 'javascript']);
  });

  it('marks the categories requested with no value', () => {
    const parsed = parseCliArgs(['remove', '--categories']);

    strict.strictEqual(parsed.command, 'remove');
    strict.strictEqual(parsed.categoriesRequested, true);
    strict.deepStrictEqual(parsed.values, []);
  });

  it('keeps a value without the flag apart from a requested category', () => {
    const parsed = parseCliArgs(['add', 'owasp']);

    strict.strictEqual(parsed.categoriesRequested, false);
    strict.deepStrictEqual(parsed.values, ['owasp']);
  });

  it('reads the name after catalog', () => {
    const parsed = parseCliArgs(['catalog', 'regex']);

    strict.strictEqual(parsed.command, 'catalog');
    strict.deepStrictEqual(parsed.values, ['regex']);
  });

  it('reads both list targets', () => {
    const parsed = parseCliArgs(['list', '--findings', '--categories']);

    strict.strictEqual(parsed.command, 'list');
    strict.strictEqual(parsed.findingsRequested, true);
    strict.strictEqual(parsed.categoriesRequested, true);
  });

  it('still recognizes the commands that moved to the skills CLI', () => {
    for (const command of ['init', 'pull', 'update'])
      strict.strictEqual(parseCliArgs([command]).command, command);
  });

  it('reports an unknown command by name, never as bare', () => {
    const parsed = parseCliArgs(['bogus', 'value']);

    strict.strictEqual(parsed.command, undefined);
    strict.strictEqual(parsed.unknown, 'bogus');
    strict.strictEqual(parsed.bare, false);
  });
});

describe('flags', () => {
  it('reads help and version in full and short forms', () => {
    strict.strictEqual(parseCliArgs(['--help']).help, true);
    strict.strictEqual(parseCliArgs(['-h']).help, true);
    strict.strictEqual(parseCliArgs(['--version']).version, true);
    strict.strictEqual(parseCliArgs(['-v']).version, true);
  });

  it('reads the port in full and short forms', () => {
    strict.strictEqual(
      parseCliArgs(['dashboard', '--port', '3001']).port,
      3001
    );
    strict.strictEqual(parseCliArgs(['dashboard', '-p', '3001']).port, 3001);
    strict.strictEqual(parseCliArgs(['dashboard']).port, undefined);
  });

  it('stays bare when only the port is given, so the dashboard opens', () => {
    const parsed = parseCliArgs(['--port', '5000']);

    strict.strictEqual(parsed.command, undefined);
    strict.strictEqual(parsed.bare, true);
    strict.strictEqual(parsed.port, 5000);
  });

  it('is not bare when a flag routes elsewhere', () => {
    for (const flag of ['--help', '--version', '--categories', '--findings'])
      strict.strictEqual(parseCliArgs([flag]).bare, false);
  });

  for (const port of ['abc', '70000', '0', '80'])
    it(`rejects the port ${port}`, () => {
      strict.throws(() => parseCliArgs(['dashboard', '--port', port]));
    });

  it('accepts 1024 as the lowest port', () => {
    strict.strictEqual(
      parseCliArgs(['dashboard', '--port', '1024']).port,
      1024
    );
  });

  it('returns empty defaults for no arguments', () => {
    strict.deepStrictEqual(parseCliArgs([]), {
      command: undefined,
      unknown: undefined,
      values: [],
      categoriesRequested: false,
      findingsRequested: false,
      help: false,
      version: false,
      bare: true,
      port: undefined,
    });
  });
});
