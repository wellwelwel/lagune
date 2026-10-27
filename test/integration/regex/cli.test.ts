import { chdir, cwd } from 'node:process';
import { describe, it, strict } from 'poku';
import { parseArgs, run } from '../../../src/hooks/regex/cli.js';
import { newWorkspace, writeFiles } from './__utils__.js';

describe('parseArgs chooses a mode from the flags', () => {
  it('defaults to a whole-project scan with no flags', () => {
    strict.deepStrictEqual(parseArgs([]), {
      mode: 'scan',
      targets: [],
      repetitionLimit: undefined,
    });
  });

  it('scopes the scan with -d or -f', () => {
    strict.deepStrictEqual(parseArgs(['-d', 'src/auth']), {
      mode: 'scan',
      targets: ['src/auth'],
      repetitionLimit: undefined,
    });
    strict.deepStrictEqual(parseArgs(['-f', 'src/auth.ts']), {
      mode: 'scan',
      targets: ['src/auth.ts'],
      repetitionLimit: undefined,
    });
  });

  it('collects several -d and -f targets, dirs before files', () => {
    strict.deepStrictEqual(
      parseArgs(['-d', 'src', '-d', 'lib', '-f', 'a.ts']),
      {
        mode: 'scan',
        targets: ['src', 'lib', 'a.ts'],
        repetitionLimit: undefined,
      }
    );
  });

  it('applies -l to a scan as well as a check', () => {
    strict.deepStrictEqual(parseArgs(['-d', 'src', '-l', '10']), {
      mode: 'scan',
      targets: ['src'],
      repetitionLimit: 10,
    });
    strict.deepStrictEqual(parseArgs(['-l', '10']), {
      mode: 'scan',
      targets: [],
      repetitionLimit: 10,
    });
  });

  it('collects one or many -p patterns in order', () => {
    strict.deepStrictEqual(parseArgs(['-p', '(a+)+']), {
      mode: 'check',
      flags: '',
      patterns: ['(a+)+'],
      repetitionLimit: undefined,
    });
    strict.deepStrictEqual(parseArgs(['-p', 'a', '-p', 'b', '-p', 'c']), {
      mode: 'check',
      flags: '',
      patterns: ['a', 'b', 'c'],
      repetitionLimit: undefined,
    });
  });

  it('reads --flags into the check, shared by every -p pattern', () => {
    strict.deepStrictEqual(parseArgs(['-p', 'a', '-p', 'b', '--flags', 'iu']), {
      mode: 'check',
      patterns: ['a', 'b'],
      flags: 'iu',
      repetitionLimit: undefined,
    });
  });

  it('rejects --flags in a scan, where each literal carries its own', () => {
    strict.throws(() => parseArgs(['-d', 'src', '--flags', 'i']), {
      message:
        '--flags applies to -p patterns, a scan reads each literal with its own flags',
    });
  });

  it('reads -l into the repetition limit for the checks', () => {
    strict.deepStrictEqual(parseArgs(['-p', 'a?a?a?', '-l', '2']), {
      mode: 'check',
      flags: '',
      patterns: ['a?a?a?'],
      repetitionLimit: 2,
    });
  });

  it('accepts the long-form aliases', () => {
    strict.deepStrictEqual(parseArgs(['--pattern', '(a+)+', '--limit', '3']), {
      mode: 'check',
      flags: '',
      patterns: ['(a+)+'],
      repetitionLimit: 3,
    });
    strict.deepStrictEqual(parseArgs(['--dir', 'src']), {
      mode: 'scan',
      targets: ['src'],
      repetitionLimit: undefined,
    });
    strict.deepStrictEqual(parseArgs(['--file', 'src/a.ts']), {
      mode: 'scan',
      targets: ['src/a.ts'],
      repetitionLimit: undefined,
    });
  });

  it('rejects mixing a pattern check with a scan scope', () => {
    strict.throws(() => parseArgs(['-p', '(a+)+', '-d', 'src']), {
      message: '-p checks a pattern and cannot be combined with -d or -f',
    });
    strict.throws(() => parseArgs(['-p', '(a+)+', '-f', 'a.ts']), {
      message: '-p checks a pattern and cannot be combined with -d or -f',
    });
  });

  it('rejects a flag with no value', () => {
    for (const args of [['-p'], ['-d'], ['-f'], ['-l'], ['--file']])
      strict.throws(() => parseArgs(args), {
        code: 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
      });
  });

  it('does not swallow a following flag as a value', () => {
    for (const args of [
      ['-l', '-p', '(a+)+'],
      ['-p', '-f', 'x'],
      ['-p', '-d'],
    ])
      strict.throws(() => parseArgs(args), {
        code: 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
      });
  });

  it('rejects a repetition limit that is not a plain decimal integer', () => {
    for (const bad of ['', '0x10', '+7', '1.5', 'abc', ' 5 ']) {
      strict.throws(() => parseArgs(['-p', 'a', '-l', bad]), {
        message: `repetition limit must be a non-negative integer, got "${bad}"`,
      });
    }
  });

  it('rejects a negative repetition limit', () => {
    strict.throws(() => parseArgs(['-p', 'a', '-l', '-1']), {
      code: 'ERR_PARSE_ARGS_INVALID_OPTION_VALUE',
    });
  });

  it('rejects an unknown flag and a bare positional', () => {
    strict.throws(() => parseArgs(['--bogus']), {
      code: 'ERR_PARSE_ARGS_UNKNOWN_OPTION',
    });
    strict.throws(() => parseArgs(['(a+)+']), {
      code: 'ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL',
    });
  });
});

await describe('run dispatches the check mode', async () => {
  await it('prints one verdict per pattern, in order, newline-terminated', async () => {
    strict.deepStrictEqual(
      await run(['-p', '(a+)+$', '-p', '^[a-z]+$', '-p', '(']),
      { output: 'unsafe\nsafe\ninvalid regex\n', hasFinding: true }
    );
  });

  await it('checks every pattern with the shared flags', async () => {
    strict.deepStrictEqual(
      await run(['-p', '^(?:a|A)+$', '-p', '(.*)$', '--flags', 'im']),
      { output: 'unsafe\nsafe\n', hasFinding: true }
    );
  });

  await it('prints undetermined for a pattern the analysis cannot settle, which is not a finding', async () => {
    strict.deepStrictEqual(
      await run([
        '-p',
        `${'('.repeat(600)}a+${')'.repeat(600)}`,
        '-p',
        '^abc$',
      ]),
      { output: 'undetermined\nsafe\n', hasFinding: false }
    );
  });

  await it('reports flags the engine rejects as an invalid regex', async () => {
    strict.deepStrictEqual(await run(['-p', 'a', '--flags', 'uv']), {
      output: 'invalid regex\n',
      hasFinding: false,
    });
  });

  await it('applies the shared limit to every pattern', async () => {
    strict.deepStrictEqual(await run(['-p', 'a?a?a?', '-l', '2']), {
      output: 'unsafe\n',
      hasFinding: true,
    });
  });

  await it('reports a finding only for unsafe, not safe or invalid', async () => {
    strict.deepStrictEqual(await run(['-p', '^[a-z]+$', '-p', '(']), {
      output: 'safe\ninvalid regex\n',
      hasFinding: false,
    });
  });
});

await describe('run dispatches the scan mode', async () => {
  const inWorkspace = async (
    scenario: () => Promise<void>,
    seed: string
  ): Promise<void> => {
    const workspace = await newWorkspace();
    const previous = cwd();

    await writeFiles(workspace, { 'app.js': seed });

    try {
      chdir(workspace);
      await scenario();
    } finally {
      chdir(previous);
    }
  };

  await it('scans the whole project from cwd when given no scope', async () => {
    await inWorkspace(async () => {
      strict.deepStrictEqual(await run([]), {
        output:
          'Vulnerable regular expressions found:\n\napp.js\n  (a+)+$ (exponential, search)\n',
        hasFinding: true,
      });
    }, 'const re = /(a+)+$/;\n');
  });

  await it('tightens the scan verdict with -l', async () => {
    await inWorkspace(async () => {
      strict.deepStrictEqual(await run([]), {
        output: 'no unsafe patterns found\n',
        hasFinding: false,
      });
      strict.deepStrictEqual(await run(['-l', '2']), {
        output:
          'Vulnerable regular expressions found:\n\napp.js\n  a?a?a? (more than 2 quantifiers)\n',
        hasFinding: true,
      });
    }, 'const re = /a?a?a?/;\n');
  });
});
