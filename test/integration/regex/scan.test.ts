import type { RegexScanResult } from '../../../src/types/hooks/regex.js';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { scan } from '../../../src/hooks/regex/scan.js';
import { newWorkspace, writeFiles } from './__utils__.js';

await describe('scan maps unsafe regex across a path, language-gated', async () => {
  const withWorkspace = async (
    files: Record<string, string>,
    assert: (result: RegexScanResult) => void
  ) => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, files);

    assert(await scan(workspace, [workspace]));
  };

  await it('finds the unsafe pattern in any language and ignores prose', async () => {
    await withWorkspace(
      {
        'auth.js': 'const re = /(a+)+$/;\nconst label = "just a message here";',
        'parse.py': 'pattern = "(.*)x"',
        'route.go': 'var ok = regexp.MustCompile("[a-z0-9_]+")',
        'readme.md': 'This describes the feature in plain words.',
      },
      ({ unsafe }) => {
        const seen = unsafe
          .map((finding) => `${finding.file}:${finding.source}`)
          .toSorted();

        strict.deepStrictEqual(seen, ['auth.js:(a+)+$', 'parse.py:(.*)x']);
      }
    );
  });

  await it('judges each pattern with the flags and escapes the program gives it', async () => {
    await withWorkspace(
      {
        'lines.js': 'const re = /^\\s*#[^\\n]+/m;',
        'Main.java': 'Pattern p = Pattern.compile("^(\\\\w+\\\\s?)*$");',
      },
      ({ unsafe }) => {
        strict.deepStrictEqual(
          unsafe.toSorted((left, right) => left.file.localeCompare(right.file)),
          [
            {
              file: 'lines.js',
              source: '^\\s*#[^\\n]+',
              flags: 'm',
              reason: 'polynomial of degree 2',
              scope: 'search',
            },
            {
              file: 'Main.java',
              source: '^(\\w+\\s?)*$',
              flags: '',
              reason: 'exponential',
              scope: 'search',
            },
          ]
        );
      }
    );
  });

  await it('unions several targets and lists each file once', async () => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, {
      'src/a.js': 'const re = /(a+)+$/;',
      'lib/b.js': 'const re = /(.+)$/;',
    });

    const { unsafe } = await scan(workspace, [
      join(workspace, 'src'),
      join(workspace, 'lib'),
      join(workspace, 'src', 'a.js'),
    ]);

    strict.deepStrictEqual(
      unsafe.map((finding) => `${finding.file}:${finding.source}`).toSorted(),
      [join('lib', 'b.js') + ':(.+)$', join('src', 'a.js') + ':(a+)+$']
    );
  });

  await it('honors a tighter repetition limit passed to scan', async () => {
    const workspace = await newWorkspace();

    await writeFiles(workspace, { 'a.js': 'const re = /a?a?a?/;' });

    const loose = await scan(workspace, [workspace]);
    const tight = await scan(workspace, [workspace], 2);

    strict.deepStrictEqual(loose.unsafe, []);
    strict.deepStrictEqual(
      tight.unsafe.map((finding) => finding.source),
      ['a?a?a?']
    );
  });

  await it('lists files that build a regex dynamically, ignoring static literals', async () => {
    await withWorkspace(
      {
        'router.js': 'const re = new RegExp(userInput);',
        'validate.py': 're.compile(base + suffix)',
        'static.go': 'var ok = regexp.MustCompile("[a-z]+")',
        'plain.js': 'const re = new RegExp("(a+)+$");',
      },
      ({ dynamic }) => {
        strict.deepStrictEqual(dynamic, ['router.js', 'validate.py']);
      }
    );
  });

  await it('returns empty lists for an unreadable path', async () => {
    const result = await scan('/nope', ['/nope/missing']);

    strict.deepStrictEqual(result, {
      unsafe: [],
      undetermined: [],
      dynamic: [],
      staticWrap: [],
    });
  });

  await it('lists a pattern the analysis could not settle apart from the vulnerable ones', async () => {
    const nested = `${'('.repeat(600)}a+${')'.repeat(600)}`;

    await withWorkspace(
      { 'deep.js': `const re = /${nested}/;\nconst bad = /(a+)+$/;` },
      ({ unsafe, undetermined }) => {
        strict.deepStrictEqual(
          unsafe.map(({ source, reason }) => `${source} ${reason}`),
          ['(a+)+$ exponential']
        );
        strict.deepStrictEqual(undetermined, [
          {
            file: 'deep.js',
            source: nested,
            flags: '',
            reason: 'work cap reached',
            scope: null,
          },
        ]);
      }
    );
  });

  await it('reports nothing for template literals, URLs, prose strings, and shell globs', async () => {
    await withWorkspace(
      {
        'reporter.ts': 'const line = `${a ? b : c} ${d.relative}`;',
        'url.ts': 'const u = `${base}?t=${now()}`;',
        'page.tsx': 'const copy = "Installing Foo with Bar + Baz";',
        'lint.sh': 'prettier --write .github/workflows/*.yml .',
      },
      ({ unsafe, dynamic, staticWrap }) => {
        strict.deepStrictEqual(unsafe, []);
        strict.deepStrictEqual(dynamic, []);
        strict.deepStrictEqual(staticWrap, []);
      }
    );
  });

  await it('does not leak one language form into another', async () => {
    await withWorkspace(
      {
        'real.rb': 'rx = /user-#{id}/',
        'fake.js': 'const note = "/user-#{id}/ is ruby";',
        'real.pl': 'my $re = qr/$pat/;',
        'fake.ts': 'const note = "qr/$pat/ is perl";',
      },
      ({ dynamic }) => {
        strict.deepStrictEqual(dynamic, ['real.pl', 'real.rb']);
      }
    );
  });

  await it('skips files of an unknown language entirely', async () => {
    await withWorkspace(
      { 'glob.sh': 'grep -E "(a+)+$" file && ls *.yml' },
      ({ unsafe, dynamic, staticWrap }) => {
        strict.deepStrictEqual(unsafe, []);
        strict.deepStrictEqual(dynamic, []);
        strict.deepStrictEqual(staticWrap, []);
      }
    );
  });

  await it('lists files that wrap a static regex in a constructor, JS and Ruby only', async () => {
    await withWorkspace(
      {
        'wrap.js': 'const re = new RegExp("(a+)+$");',
        'wrap.rb': 'rx = Regexp.new("\\\\d+")',
        'python.py': 're.compile("\\\\d+")',
        'go.go': 'regexp.MustCompile("[a-z]+")',
        'dynamic.js': 'const re = new RegExp(userInput);',
      },
      ({ staticWrap }) => {
        strict.deepStrictEqual(staticWrap, ['wrap.js', 'wrap.rb']);
      }
    );
  });

  await it('classifies Clojure, Elixir, R, C, and Go files end to end', async () => {
    await withWorkspace(
      {
        'core.clj': '(re-find #"[0-9]+" s)',
        'app.ex': 'Regex.compile(pattern)',
        'stats.R': 'grepl(pattern, x)',
        'parser.c': 'regcomp(&re, argv[1], 0);',
        'plain.go': 'regexp.MustCompile("[a-z]+")',
      },
      ({ dynamic, staticWrap }) => {
        strict.deepStrictEqual(dynamic, ['app.ex', 'parser.c', 'stats.R']);
        strict.deepStrictEqual(staticWrap, ['core.clj']);
      }
    );
  });
});
