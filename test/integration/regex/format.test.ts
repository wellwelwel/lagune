import type { RegexFinding } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { format } from '../../../src/hooks/regex/format.js';

const exponential = (file: string, source: string): RegexFinding => ({
  file,
  source,
  flags: '',
  reason: 'exponential',
  scope: 'search',
});

describe('format renders findings grouped by file with no colors', () => {
  it('reports plainly when every section is empty', () => {
    strict.strictEqual(
      format({ unsafe: [], undetermined: [], dynamic: [], staticWrap: [] }),
      'no unsafe patterns found\n'
    );
  });

  it('groups every source under its file, sorted, indented', () => {
    strict.strictEqual(
      format({
        unsafe: [
          exponential('b.js', '(.+)$'),
          exponential('a.js', '(a+)+$'),
          exponential('a.js', '(.*)x'),
        ],
        undetermined: [],
        dynamic: [],
        staticWrap: [],
      }),
      'Vulnerable regular expressions found:\n\na.js\n  (a+)+$ (exponential, search)\n  (.*)x (exponential, search)\n\nb.js\n  (.+)$ (exponential, search)\n'
    );
  });

  it('names the reason, the scope when there is one, and the flags as the literal writes them', () => {
    strict.strictEqual(
      format({
        unsafe: [
          {
            file: 'a.js',
            source: '^\\s*#[^\\n]+',
            flags: 'gm',
            reason: 'polynomial of degree 2',
            scope: 'search',
          },
          {
            file: 'a.js',
            source: '(a+)+a',
            flags: '',
            reason: 'exponential',
            scope: 'whole match',
          },
          {
            file: 'a.js',
            source: 'a?a?a?',
            flags: '',
            reason: 'more than 2 quantifiers',
            scope: null,
          },
        ],
        undetermined: [],
        dynamic: [],
        staticWrap: [],
      }),
      'Vulnerable regular expressions found:\n\na.js\n  ^\\s*#[^\\n]+ (polynomial of degree 2, search, flags: gm)\n  (a+)+a (exponential, whole match)\n  a?a?a? (more than 2 quantifiers)\n'
    );
  });

  it('lists the patterns the analysis could not settle right after the vulnerable ones', () => {
    strict.strictEqual(
      format({
        unsafe: [exponential('a.js', '(a+)+$')],
        undetermined: [
          {
            file: 'b.js',
            source: '(?:x+){1,9}y',
            flags: 'i',
            reason: 'work cap reached',
            scope: null,
          },
        ],
        dynamic: ['c.js'],
        staticWrap: [],
      }),
      'Vulnerable regular expressions found:\n\na.js\n  (a+)+$ (exponential, search)\n\n' +
        'Regular expressions the analysis could not settle (review manually):\n\nb.js\n  (?:x+){1,9}y (work cap reached, flags: i)\n\n' +
        'Dynamically built regular expressions (review manually by simulating a constructed regex):\n\nc.js\n'
    );
  });

  it('orders unsafe, dynamic, and static-wrap sections, each only when present', () => {
    strict.strictEqual(
      format({
        unsafe: [exponential('a.js', '(a+)+$')],
        undetermined: [],
        dynamic: ['lib/build.py', 'src/router.js'],
        staticWrap: ['src/wrap.js'],
      }),
      'Vulnerable regular expressions found:\n\na.js\n  (a+)+$ (exponential, search)\n\n' +
        'Dynamically built regular expressions (review manually by simulating a constructed regex):\n\n' +
        'lib/build.py\nsrc/router.js\n\n' +
        'Static regex wrapped in a constructor (use a literal instead):\n\n' +
        'src/wrap.js\n'
    );
  });

  it('shows the static-wrap section on its own when it is the only finding', () => {
    strict.strictEqual(
      format({
        unsafe: [],
        undetermined: [],
        dynamic: [],
        staticWrap: ['src/wrap.js'],
      }),
      'Static regex wrapped in a constructor (use a literal instead):\n\nsrc/wrap.js\n'
    );
  });

  it('carries no ANSI escape sequence', () => {
    const output = format({
      unsafe: [exponential('a.js', '(a+)+$')],
      undetermined: [],
      dynamic: ['b.js'],
      staticWrap: ['c.js'],
    });

    strict.strictEqual(output.includes(String.fromCharCode(27)), false);
  });
});
