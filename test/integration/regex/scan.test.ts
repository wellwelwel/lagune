import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  buildsDynamicRegex,
  wrapsStaticRegex,
} from '../../../src/hooks/regex/dynamic.js';
import { extractCandidates } from '../../../src/hooks/regex/extract.js';
import { format } from '../../../src/hooks/regex/format.js';
import { scan } from '../../../src/hooks/regex/scan.js';

describe('extractCandidates is gated to each language', () => {
  it('keeps a genuine JavaScript regex literal', () => {
    strict.deepStrictEqual(
      extractCandidates('const re = /(a+)+$/;', 'javascript'),
      ['(a+)+$']
    );
  });

  it('keeps an arrow-body regex literal', () => {
    strict.deepStrictEqual(
      extractCandidates('const f = () => /(a+)+$/;', 'javascript'),
      ['(a+)+$']
    );
  });

  it('keeps a regex passed to a RegExp constructor or String method', () => {
    strict.deepStrictEqual(
      extractCandidates('const re = new RegExp("(a+)+$");', 'javascript'),
      ['(a+)+$']
    );
    strict.deepStrictEqual(
      extractCandidates('s.match("(a+)+$")', 'javascript'),
      ['(a+)+$']
    );
  });

  it('never scrapes a JavaScript template literal', () => {
    strict.deepStrictEqual(
      extractCandidates('const x = `${a ? b : c} ${d}`;', 'javascript'),
      []
    );
  });

  it('never scrapes division or a slash comment in JavaScript', () => {
    strict.deepStrictEqual(
      extractCandidates('const n = a / b / c;', 'javascript'),
      []
    );
    strict.deepStrictEqual(extractCandidates('/* (a+)+ */', 'javascript'), []);
    strict.deepStrictEqual(
      extractCandidates('// match (a+)+', 'javascript'),
      []
    );
  });

  it('drops a bare JavaScript string that is not a regex argument', () => {
    strict.deepStrictEqual(
      extractCandidates('const x = "just a message";', 'javascript'),
      []
    );
    strict.deepStrictEqual(
      extractCandidates('const x = "(a+)+$";', 'javascript'),
      []
    );
  });

  it('keeps an indirect literal in a constructor language', () => {
    strict.deepStrictEqual(
      extractCandidates('pat = "(a+)+$"\nre.compile(pat)', 'python'),
      ['(a+)+$']
    );
    strict.deepStrictEqual(extractCandidates('p := "(a+)+$"', 'go'), [
      '(a+)+$',
    ]);
  });

  it('does not run across a newline inside a literal', () => {
    strict.deepStrictEqual(extractCandidates('p = "(a+\n)+$"', 'python'), []);
  });
});

describe('buildsDynamicRegex flags a regex built from a non-literal', () => {
  const expectAll = (
    language: LanguageId,
    verdict: boolean,
    snippets: string[]
  ): void => {
    for (const snippet of snippets)
      it(`treats ${JSON.stringify(snippet)} as ${verdict}`, () => {
        strict.strictEqual(buildsDynamicRegex(snippet, language), verdict);
      });
  };

  describe('JavaScript', () => {
    expectAll('javascript', true, [
      'const re = new RegExp(userInput);',
      'const re = RegExp(pattern, "g");',
      'const re = new RegExp(`^${prefix}-\\\\d+$`);',
      'const re = new RegExp("a" + tail);',
    ]);
    expectAll('javascript', false, [
      'const re = new RegExp("(a+)+$");',
      'const re = /foo/;',
    ]);
  });

  describe('Python', () => {
    expectAll('python', true, [
      'p = re.compile(value)',
      'm = re.match(pat, text)',
    ]);
    expectAll('python', false, ["p = re.compile('\\\\d+')"]);
  });

  describe('Java', () => {
    expectAll('java', true, ['pat = Pattern.compile(input)']);
  });

  describe('C#', () => {
    expectAll('csharp', true, ['var r = new Regex(value);']);
  });

  describe('Go', () => {
    expectAll('go', true, [
      're := regexp.MustCompile(base + suffix)',
      'r := regexp.Compile(p)',
    ]);
    expectAll('go', false, ['var ok = regexp.MustCompile("[a-z]+")']);
  });

  describe('Ruby', () => {
    expectAll('ruby', true, ['rx = Regexp.new(value)', 'rx = /user-#{id}/']);
  });

  describe('PHP', () => {
    expectAll('php', true, ['preg_match($pattern, $subject)']);
    expectAll('php', false, ['preg_match("/[0-9]+/", $subject)']);
  });

  describe('Rust', () => {
    expectAll('rust', true, ['let re = Regex::new(&value).unwrap();']);
    expectAll('rust', false, ['let re = Regex::new("^foo$").unwrap();']);
  });

  describe('C++', () => {
    expectAll('cpp', true, ['std::regex re(pattern);']);
  });

  describe('C (POSIX)', () => {
    expectAll('c', true, [
      'regcomp(&re, pattern, REG_EXTENDED);',
      'regcomp(&re, argv[1], 0);',
    ]);
    expectAll('c', false, ['regcomp(&re, "[a-z]+", 0)']);
  });

  describe('Perl', () => {
    expectAll('perl', true, ['$x =~ /$pat/', 'my $re = qr/$prefix\\d+/']);
    expectAll('perl', false, ['$x =~ /[0-9]+/', 'my $re = qr/\\d+/']);
  });

  describe('Kotlin', () => {
    expectAll('kotlin', true, [
      'val r = Regex(input)',
      'val r = Pattern.compile(value)',
    ]);
    expectAll('kotlin', false, ['val r = Regex("[a-z]+")']);
  });

  describe('Swift', () => {
    expectAll('swift', true, ['let r = NSRegularExpression(pattern: input)']);
  });

  describe('Scala', () => {
    expectAll('scala', true, [
      'val r = new Regex(value)',
      'val r = s"$prefix.*".r',
    ]);
  });

  describe('Dart', () => {
    expectAll('dart', true, ['final r = RegExp(input);']);
  });

  describe('PowerShell', () => {
    expectAll('powershell', true, ['$x -match $pattern', '$s -replace $a, $b']);
    expectAll('powershell', false, ['$x -match "foo"']);
  });

  describe('Elixir', () => {
    expectAll('elixir', true, ['Regex.compile(input)', '~r/#{prefix}\\d+/']);
    expectAll('elixir', false, ['~r/[0-9]+/']);
  });

  describe('Objective-C', () => {
    expectAll('objc', true, [
      '[NSRegularExpression regularExpressionWithPattern:input options:0 error:&e]',
    ]);
  });

  describe('R', () => {
    expectAll('r', true, ['grepl(pattern, x)', 'gsub(pat, repl, x)']);
    expectAll('r', false, ['grepl("[0-9]+", x)']);
  });

  describe('Julia', () => {
    expectAll('julia', true, ['r = Regex(input)']);
    expectAll('julia', false, ['r = r"[0-9]+"']);
  });

  describe('Clojure', () => {
    expectAll('clojure', true, [
      '(re-pattern input)',
      '(re-find (re-pattern p) s)',
    ]);
    expectAll('clojure', false, ['(re-pattern "\\\\d+")', '#"[0-9]+"']);
  });

  describe('Crystal', () => {
    expectAll('crystal', true, ['r = Regex.new(value)']);
  });

  describe('Nim', () => {
    expectAll('nim', true, ['let r = nre.re(value)']);
  });

  describe('V', () => {
    expectAll('vlang', true, [
      'mut re := regex.regex_opt(pattern) or { panic(err) }',
    ]);
  });

  describe('D', () => {
    expectAll('dlang', true, ['auto r = regex(pattern);']);
  });

  describe('word boundaries reject substrings of an API name', () => {
    expectAll('javascript', false, [
      'dispatch(handler)',
      'val MyRegExp = build()',
      'the response here',
      'description = "x";',
    ]);
    expectAll('python', false, ['rematch(a, b)', 'subscribe(topic)']);
  });

  describe('not a regex API', () => {
    expectAll('javascript', false, ['const label = "just a message";']);
  });

  describe('a language does not run another language form', () => {
    it('does not flag a Ruby interpolation literal in JavaScript', () => {
      strict.strictEqual(
        buildsDynamicRegex('rx = /user-#{id}/', 'javascript'),
        false
      );
    });
    it('does not flag a Perl qr// in TypeScript-tagged JavaScript', () => {
      strict.strictEqual(
        buildsDynamicRegex('const x = qr/x/;', 'javascript'),
        false
      );
    });
  });
});

describe('wrapsStaticRegex flags a static literal wrapped in a constructor', () => {
  const expectAll = (
    language: LanguageId,
    verdict: boolean,
    snippets: string[]
  ): void => {
    for (const snippet of snippets)
      it(`treats ${JSON.stringify(snippet)} as ${verdict}`, () => {
        strict.strictEqual(wrapsStaticRegex(snippet, language), verdict);
      });
  };

  describe('JavaScript', () => {
    expectAll('javascript', true, [
      'const re = new RegExp("(a+)+$");',
      'const re = RegExp("[a-z]+");',
    ]);
    expectAll('javascript', false, [
      'const re = new RegExp(userInput);',
      'const re = new RegExp("a" + tail);',
      'const re = /foo/;',
    ]);
  });

  describe('Ruby', () => {
    expectAll('ruby', true, ['rx = Regexp.new("\\\\d+")']);
    expectAll('ruby', false, ['rx = Regexp.new(value)', 'rx = /user-#{id}/']);
  });

  describe('Perl', () => {
    expectAll('perl', true, ['qr/[0-9]+/', '$x =~ m/[a-z]+/']);
  });

  describe('Elixir', () => {
    expectAll('elixir', true, ['~r/[0-9]+/', 'Regex.compile("[0-9]+")']);
  });

  describe('Clojure', () => {
    expectAll('clojure', true, ['#"[0-9]+"']);
  });

  describe('Julia', () => {
    expectAll('julia', true, ['r"[0-9]+"']);
  });

  describe('Nim', () => {
    expectAll('nim', true, ['re"[0-9]+"']);
  });

  describe('Scala', () => {
    expectAll('scala', true, ['val r = "[0-9]+".r']);
  });

  describe('Crystal', () => {
    expectAll('crystal', true, ['r = Regex.new("[a-z]+")']);
  });

  describe('languages without a regex literal stay clear', () => {
    expectAll('python', false, ['re.compile("\\\\d+")']);
    expectAll('csharp', false, [
      'new Regex("^foo$")',
      'var r = Regex("[a-z]+")',
    ]);
    expectAll('go', false, ['regexp.MustCompile("[a-z]+")']);
    expectAll('php', false, ['preg_match("/[0-9]+/", $subject)']);
    expectAll('c', false, ['regcomp(&re, "x", 0)']);
    expectAll('powershell', false, ['$x -match "foo"']);
  });
});

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
        'Dynamically built regular expressions (review manually):\n\n' +
        'lib/build.py\nsrc/router.js\n\n' +
        'Static regex wrapped in a constructor (use a literal instead):\n\n' +
        'src/wrap.js\n'
    );
  });

  it('shows the static-wrap section on its own when it is the only finding', () => {
    strict.strictEqual(
      format({ unsafe: [], dynamic: [], staticWrap: ['src/wrap.js'] }),
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

await describe('scan maps unsafe regex across a path, language-gated', async () => {
  const withWorkspace = async (
    files: Record<string, string>,
    assert: (result: Awaited<ReturnType<typeof scan>>) => void
  ) => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-sweep-'));

    try {
      for (const [name, contents] of Object.entries(files))
        await writeFile(join(workspace, name), contents, 'utf8');

      assert(await scan(workspace, [workspace]));
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
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
        const seen = unsafe.map((f) => `${f.file}:${f.source}`).toSorted();

        strict.deepStrictEqual(seen, ['auth.js:(a+)+$', 'parse.py:(.*)x']);
      }
    );
  });

  await it('is deterministic across repeated runs', async () => {
    await withWorkspace(
      { 'a.js': 'const x = /(a+)+$/; const y = /(.+)$/;' },
      ({ unsafe }) => {
        strict.deepStrictEqual(unsafe.map((f) => f.source).toSorted(), [
          '(.+)$',
          '(a+)+$',
        ]);
      }
    );
  });

  await it('unions several targets and lists each file once', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-multi-'));

    try {
      await mkdir(join(workspace, 'src'), { recursive: true });
      await mkdir(join(workspace, 'lib'), { recursive: true });
      await writeFile(
        join(workspace, 'src', 'a.js'),
        'const re = /(a+)+$/;',
        'utf8'
      );
      await writeFile(
        join(workspace, 'lib', 'b.js'),
        'const re = /(.+)$/;',
        'utf8'
      );

      const { unsafe } = await scan(workspace, [
        join(workspace, 'src'),
        join(workspace, 'lib'),
        join(workspace, 'src', 'a.js'),
      ]);

      strict.deepStrictEqual(
        unsafe.map((f) => `${f.file}:${f.source}`).toSorted(),
        [join('lib', 'b.js') + ':(.+)$', join('src', 'a.js') + ':(a+)+$']
      );
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  });

  await it('honors a tighter repetition limit passed to scan', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-limit-'));

    try {
      await writeFile(join(workspace, 'a.js'), 'const re = /a?a?a?/;', 'utf8');

      const loose = await scan(workspace, [workspace]);
      const tight = await scan(workspace, [workspace], 2);

      strict.deepStrictEqual(loose.unsafe, []);
      strict.deepStrictEqual(
        tight.unsafe.map((f) => f.source),
        ['a?a?a?']
      );
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
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

    strict.deepStrictEqual(result, { unsafe: [], dynamic: [], staticWrap: [] });
  });

  await it('silences false positives that fooled the agnostic scan', async () => {
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

  await it('treats single-file component extensions as JavaScript', async () => {
    await withWorkspace(
      {
        'a.vue': '<script>const re = /(a+)+$/;</script>',
        'b.svelte': '<script>const re = /(a+)+$/;</script>',
        'c.marko': '<script>const re = /(a+)+$/;</script>',
        'd.riot': '<script>const re = /(a+)+$/;</script>',
      },
      ({ unsafe }) => {
        strict.deepStrictEqual(unsafe.map((f) => f.file).toSorted(), [
          'a.vue',
          'b.svelte',
          'c.marko',
          'd.riot',
        ]);
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

  await it('classifies the new languages end to end', async () => {
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

  await it('skips common non-source extensions, test files, and env files', async () => {
    await withWorkspace(
      {
        'app.js': 'const re = /(a+)+$/;',
        'app.test.js': 'const re = /(a+)+$/;',
        'app.spec.ts': 'const re = /(a+)+$/;',
        'data.json': '{"re": "(a+)+$"}',
        'notes.md': 'a pattern (a+)+$ in prose',
        '.env': 'SECRET="(a+)+$"',
        '.env.production': 'SECRET="(a+)+$"',
      },
      ({ unsafe }) => {
        strict.deepStrictEqual(
          unsafe.map((f) => f.file),
          ['app.js']
        );
      }
    );
  });

  await it('skips unambiguous dependency and cache dirs across ecosystems', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-dirs-'));

    try {
      const pattern = 'const re = /(a+)+$/;';

      await writeFile(join(workspace, 'app.js'), pattern, 'utf8');

      for (const dir of [
        'node_modules',
        '.next',
        '__pycache__',
        '.venv',
        'Pods',
        'pkg.egg-info',
      ]) {
        await mkdir(join(workspace, dir), { recursive: true });
        await writeFile(join(workspace, dir, 'noise.js'), pattern, 'utf8');
      }

      const { unsafe } = await scan(workspace, [workspace]);

      strict.deepStrictEqual(
        unsafe.map((f) => f.file),
        ['app.js']
      );
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  });

  await it('scans ambiguous dirs that may hold real source', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-ambig-'));

    try {
      const pattern = 'const re = /(a+)+$/;';

      for (const dir of ['dist', 'build', 'bin', 'vendor']) {
        await mkdir(join(workspace, dir), { recursive: true });
        await writeFile(join(workspace, dir, 'tool.js'), pattern, 'utf8');
      }

      const { unsafe } = await scan(workspace, [workspace]);

      strict.deepStrictEqual(unsafe.map((f) => f.file).toSorted(), [
        join('bin', 'tool.js'),
        join('build', 'tool.js'),
        join('dist', 'tool.js'),
        join('vendor', 'tool.js'),
      ]);
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  });

  await it('ignores the root .bluespec dir and any bluespec.* dir', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-ignore-'));

    try {
      const pattern = 'const re = /(a+)+$/;';

      await writeFile(join(workspace, 'kept.js'), pattern, 'utf8');

      for (const dir of [
        '.bluespec',
        'bluespec.detect',
        'src/bluespec.cache',
      ]) {
        await mkdir(join(workspace, dir), { recursive: true });
        await writeFile(join(workspace, dir, 'noise.js'), pattern, 'utf8');
      }

      const { unsafe } = await scan(workspace, [workspace]);

      strict.deepStrictEqual(
        unsafe.map((f) => f.file),
        ['kept.js']
      );
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  });

  await it('scans a .bluespec dir that is not at the project root', async () => {
    const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-regex-nested-'));

    try {
      await mkdir(join(workspace, 'pkg', '.bluespec'), { recursive: true });
      await writeFile(
        join(workspace, 'pkg', '.bluespec', 'r.js'),
        'const re = /(a+)+$/;',
        'utf8'
      );

      const { unsafe } = await scan(workspace, [workspace]);

      strict.deepStrictEqual(
        unsafe.map((f) => f.file),
        [join('pkg', '.bluespec', 'r.js')]
      );
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  });
});
