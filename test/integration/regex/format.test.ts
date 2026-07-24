import { describe, it, strict } from 'poku';
import { format } from '../../../src/hooks/regex/format.js';

describe('format renders findings grouped by file with no colors', () => {
  it('reports plainly when every section is empty', () => {
    strict.strictEqual(
      format({ unsafe: [], dynamic: [], staticWrap: [] }),
      'no unsafe patterns found\n'
    );
  });

  it('groups every source under its file, sorted, indented', () => {
    strict.strictEqual(
      format({
        unsafe: [
          { file: 'b.js', source: '(.+)$' },
          { file: 'a.js', source: '(a+)+$' },
          { file: 'a.js', source: '(.*)x' },
        ],
        dynamic: [],
        staticWrap: [],
      }),
      'Vulnerable regular expressions found:\n\na.js\n  (a+)+$\n  (.*)x\n\nb.js\n  (.+)$\n'
    );
  });

  it('orders unsafe, dynamic, and static-wrap sections, each only when present', () => {
    strict.strictEqual(
      format({
        unsafe: [{ file: 'a.js', source: '(a+)+$' }],
        dynamic: ['lib/build.py', 'src/router.js'],
        staticWrap: ['src/wrap.js'],
      }),
      'Vulnerable regular expressions found:\n\na.js\n  (a+)+$\n\n' +
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
        dynamic: [],
        staticWrap: ['src/wrap.js'],
      }),
      'Static regex wrapped in a constructor (use a literal instead):\n\nsrc/wrap.js\n'
    );
  });

  it('carries no ANSI escape sequence', () => {
    const output = format({
      unsafe: [{ file: 'a.js', source: '(a+)+$' }],
      dynamic: ['b.js'],
      staticWrap: ['c.js'],
    });

    strict.strictEqual(output.includes(String.fromCharCode(27)), false);
  });
});
