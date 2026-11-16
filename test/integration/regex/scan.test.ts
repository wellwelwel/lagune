import type {
  RegexFinding,
  RegexScanResult,
} from '../../../src/types/hooks/regex.js';
import type {
  RegexPatternCase,
  RegexSourceCase,
} from '../../../src/types/test.js';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { scan } from '../../../src/hooks/regex/scan.js';
import { newWorkspace, writeFiles } from './__utils__.js';

const NOTHING: RegexScanResult = {
  unsafe: [],
  undetermined: [],
  unconfirmed: [],
  dynamic: [],
  staticWrap: [],
  skipped: { git: 0, configs: 0 },
};

const LOOK_ALIKES: RegexSourceCase[] = [
  [
    'a cron expression',
    'ReportJob.java',
    '@Scheduled(cron = "0 0 * * * *")\npublic void hourly() {}',
  ],
  [
    'a SQL wildcard',
    'users.go',
    'row := db.QueryRow("SELECT u.* FROM users u WHERE u.id = $1", id)',
  ],
  [
    'a printf precision',
    'log.c',
    'fprintf(stderr, "token: %.*s\\n", (int)len, buf);',
  ],
  ['a bullet in command-line output', 'report.rs', 'println!("  * {}", name);'],
  [
    'an XPath wildcard',
    'prices.py',
    `prices = response.xpath('//*[@class="price"]/text()')`,
  ],
  [
    'a catch-all route',
    'router.ex',
    'get "/*path", PageController, :not_found',
  ],
  [
    'a wildcard resource name',
    'policy.py',
    'POLICY = {\n    "Resource": "arn:aws:logs:*:*:*",\n}',
  ],
  [
    'a glob with a character class',
    'plugins.py',
    'modules = Path(__file__).parent.glob("[!_]*.py")',
  ],
  [
    'an aspect pointcut',
    'TimingAspect.java',
    '@Around("execution(public * *(..))")\npublic Object time() { return null; }',
  ],
  [
    'a test filter',
    'build.gradle.kts',
    'tasks.test { filter { includeTestsMatching("com.acme.*Test") } }',
  ],
  [
    'a documentation emitter',
    'DocWriter.java',
    'doc.append(" * @param ").append(param);',
  ],
  [
    'arithmetic in a MATLAB file',
    'weighted_mean.m',
    "m = sum(x' .* w') / sum(w);",
  ],
  ['a text the code escapes', 'Escape.cs', 'var text = Regex.Escape("(.*)x");'],
];

const COMMENTS: RegexSourceCase[] = [
  [
    'a Python line comment',
    'handlers.py',
    '# pattern = re.compile(r"^(\\w+\\s?)*$")\nwords = line.split()',
  ],
  [
    'a Go line comment',
    'handlers.go',
    '// pattern := regexp.MustCompile("^(\\\\w+\\\\s?)*$")\nwords := strings.Fields(line)',
  ],
  [
    'a TypeScript line comment',
    'handlers.ts',
    '// const pattern = new RegExp("^(\\\\w+\\\\s?)*$");\nconst words = line.split(" ");',
  ],
  [
    'a Java block comment',
    'Handlers.java',
    '/*\n * Pattern.compile("^(\\\\w+\\\\s?)*$")\n */\nString[] words = line.split(" ");',
  ],
  [
    'an example in a Python docstring',
    'words.py',
    'def words(line):\n    """\n    >>> re.compile("^(\\\\w+\\\\s?)*$")\n    """\n    return line.split()',
  ],
  [
    'an example in a Go raw string',
    'help.go',
    'const usage = `\nfilter with regexp.MustCompile("^(\\\\w+\\\\s?)*$")\n`',
  ],
  [
    'a documentation comment that names the constructor',
    'escape.ts',
    '/**\n * Escapes a value for a pattern built with new RegExp(value)\n */\nexport const escapePattern = (value: string): string => value;',
  ],
];

const DECLARATIONS: RegexSourceCase[] = [
  [
    'a generated regular expression',
    'Slug.cs',
    '[GeneratedRegex(@"^[a-z0-9-]{1,64}$")]\nprivate static partial Regex SlugPattern();',
  ],
  [
    'a method that returns a regular expression',
    'Matcher.cs',
    'public static Regex Default() => Digits;',
  ],
];

const DECLARED: RegexPatternCase[] = [
  [
    'a validation annotation',
    'User.java',
    '@Pattern(regexp = "^(\\\\w+\\\\s?)*$")\nprivate String name;',
    '^(\\w+\\s?)*$',
  ],
  [
    'a constant named after a regular expression',
    'rules.py',
    'WORDS_REGEX = "^(\\\\w+\\\\s?)*$"',
    '^(\\w+\\s?)*$',
  ],
  [
    'a validator named after a regular expression',
    'forms.py',
    'validator = RegexValidator(r"^(\\w+\\s?)*$")',
    '^(\\w+\\s?)*$',
  ],
  [
    'a validation attribute',
    'User.cs',
    '[RegularExpression(@"^(\\w+\\s?)*$")]\npublic string Name { get; set; }',
    '^(\\w+\\s?)*$',
  ],
];

const DIRECT: RegexPatternCase[] = [
  [
    'a Java string method',
    'Validate.java',
    'boolean valid = value.matches("^(\\\\w+\\\\s?)*$");',
    '^(\\w+\\s?)*$',
  ],
  [
    'a Django route',
    'urls.py',
    'urlpatterns = [re_path(r"^articles/(\\w+\\s?)*$", views.article)]',
    '^articles/(\\w+\\s?)*$',
  ],
  [
    'a Python split',
    'split.py',
    'parts = re.split(r"^(\\w+\\s?)*$", line)',
    '^(\\w+\\s?)*$',
  ],
  [
    'a Go match',
    'match.go',
    'matched, _ := regexp.Match("^(\\\\w+\\\\s?)*$", data)',
    '^(\\w+\\s?)*$',
  ],
  [
    'a C# split',
    'Split.cs',
    'var parts = Regex.Split(value, @"^(\\w+\\s?)*$");',
    '^(\\w+\\s?)*$',
  ],
  [
    'a PHP callback replace',
    'clean.php',
    "<?php\n$clean = preg_replace_callback('/^(\\w+\\s?)*$/', $callback, $value);",
    '^(\\w+\\s?)*$',
  ],
  [
    'an R search',
    'search.r',
    'hits <- grep("^(\\\\w+\\\\s?)*$", lines)',
    '^(\\w+\\s?)*$',
  ],
  [
    'a Clojure literal',
    'core.clj',
    '(def words #"^(\\w+\\s?)*$")',
    '^(\\w+\\s?)*$',
  ],
  ['a Julia literal', 'words.jl', 'words = r"^(\\w+\\s?)*$"', '^(\\w+\\s?)*$'],
  [
    'a Nim literal',
    'words.nim',
    'let words = re"^(\\w+\\s?)*$"',
    '^(\\w+\\s?)*$',
  ],
  [
    'a Kotlin conversion',
    'Words.kt',
    'val words = "^(\\\\w+\\\\s?)*$".toRegex()',
    '^(\\w+\\s?)*$',
  ],
  [
    'a Scala conversion',
    'Words.scala',
    'val words = "^(\\\\w+\\\\s?)*$".r',
    '^(\\w+\\s?)*$',
  ],
  ['an Elixir sigil', 'words.ex', 'words = ~r"^(\\w+\\s?)*$"', '^(\\w+\\s?)*$'],
  [
    'a PowerShell operator',
    'check.ps1',
    "$valid = $value -match '^(\\w+\\s?)*$'",
    '^(\\w+\\s?)*$',
  ],
];

const sightings = (findings: RegexFinding[]): string[] =>
  findings.map(({ file, source }) => `${file}:${source}`).toSorted();

const scanFiles = async (
  files: Record<string, string>,
  targets?: string[]
): Promise<RegexScanResult> => {
  const workspace = await newWorkspace();

  await writeFiles(workspace, files);

  return scan(
    workspace,
    targets === undefined
      ? [workspace]
      : targets.map((target) => join(workspace, target))
  );
};

await describe('scan maps unsafe regex across a path, language-gated', async () => {
  await it('finds the unsafe pattern in any language and ignores prose', async () => {
    const { unsafe } = await scanFiles({
      'auth.js': 'const re = /(a+)+$/;\nconst label = "just a message here";',
      'parse.py': 'pattern = "(.*)x"\nre.compile(pattern)',
      'route.go': 'var ok = regexp.MustCompile("[a-z0-9_]+")',
      'readme.md': 'This describes the feature in plain words.',
    });

    strict.deepStrictEqual(sightings(unsafe), [
      'auth.js:(a+)+$',
      'parse.py:(.*)x',
    ]);
  });

  await it('judges each pattern with the flags and escapes the program gives it', async () => {
    const { unsafe } = await scanFiles({
      'lines.js': 'const re = /^\\s*#[^\\n]+/m;',
      'Main.java': 'Pattern p = Pattern.compile("^(\\\\w+\\\\s?)*$");',
    });

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
  });

  await it('unions several targets and lists each file once', async () => {
    const { unsafe } = await scanFiles(
      {
        'src/a.js': 'const re = /(a+)+$/;',
        'lib/b.js': 'const re = /(.+)$/;',
      },
      ['src', 'lib', join('src', 'a.js')]
    );

    strict.deepStrictEqual(sightings(unsafe), [
      join('lib', 'b.js') + ':(.+)$',
      join('src', 'a.js') + ':(a+)+$',
    ]);
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
    const { dynamic } = await scanFiles({
      'router.js': 'const re = new RegExp(userInput);',
      'validate.py': 're.compile(base + suffix)',
      'static.go': 'var ok = regexp.MustCompile("[a-z]+")',
      'plain.js': 'const re = new RegExp("(a+)+$");',
    });

    strict.deepStrictEqual(dynamic, ['router.js', 'validate.py']);
  });

  await it('returns empty lists for an unreadable path', async () => {
    const result = await scan('/nope', ['/nope/missing']);

    strict.deepStrictEqual(result, NOTHING);
  });

  await it('lists a pattern the analysis could not settle apart from the vulnerable ones', async () => {
    const nested = `${'('.repeat(600)}a+${')'.repeat(600)}`;
    const { unsafe, undetermined } = await scanFiles({
      'deep.js': `const re = /${nested}/;\nconst bad = /(a+)+$/;`,
    });

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
  });

  await it('lists a repetition too large to lay out as unsettled, never letting it hide the vulnerable ones', async () => {
    const { unsafe, undetermined } = await scanFiles({
      'planted.js':
        'const huge = /(?:a+){99999999999}/;\nconst bad = /(a+)+$/;',
    });

    strict.deepStrictEqual(
      unsafe.map(({ source, reason }) => `${source} ${reason}`),
      ['(a+)+$ exponential']
    );
    strict.deepStrictEqual(undetermined, [
      {
        file: 'planted.js',
        source: '(?:a+){99999999999}',
        flags: '',
        reason: 'work cap reached',
        scope: null,
      },
    ]);
  });

  await it('reports nothing for template literals, URLs, prose strings, and shell globs', async () => {
    const { unsafe, dynamic, staticWrap } = await scanFiles({
      'reporter.ts': 'const line = `${a ? b : c} ${d.relative}`;',
      'url.ts': 'const u = `${base}?t=${now()}`;',
      'page.tsx': 'const copy = "Installing Foo with Bar + Baz";',
      'lint.sh': 'prettier --write .github/workflows/*.yml .',
    });

    strict.deepStrictEqual(unsafe, []);
    strict.deepStrictEqual(dynamic, []);
    strict.deepStrictEqual(staticWrap, []);
  });

  await it('does not leak one language form into another', async () => {
    const { dynamic } = await scanFiles({
      'real.rb': 'rx = /user-#{id}/',
      'fake.js': 'const note = "/user-#{id}/ is ruby";',
      'real.pl': 'my $re = qr/$pat/;',
      'fake.ts': 'const note = "qr/$pat/ is perl";',
    });

    strict.deepStrictEqual(dynamic, ['real.pl', 'real.rb']);
  });

  await it('skips files of an unknown language entirely', async () => {
    const { unsafe, dynamic, staticWrap } = await scanFiles({
      'glob.sh': 'grep -E "(a+)+$" file && ls *.yml',
    });

    strict.deepStrictEqual(unsafe, []);
    strict.deepStrictEqual(dynamic, []);
    strict.deepStrictEqual(staticWrap, []);
  });

  await it('lists files that wrap a static regex in a constructor, JS and Ruby only', async () => {
    const { staticWrap } = await scanFiles({
      'wrap.js': 'const re = new RegExp("(a+)+$");',
      'wrap.rb': 'rx = Regexp.new("\\\\d+")',
      'python.py': 're.compile("\\\\d+")',
      'go.go': 'regexp.MustCompile("[a-z]+")',
      'dynamic.js': 'const re = new RegExp(userInput);',
    });

    strict.deepStrictEqual(staticWrap, ['wrap.js', 'wrap.rb']);
  });

  await it('classifies Clojure, Elixir, R, C, and Go files end to end', async () => {
    const { dynamic, staticWrap } = await scanFiles({
      'core.clj': '(re-find #"[0-9]+" s)',
      'app.ex': 'Regex.compile(pattern)',
      'stats.R': 'grepl(pattern, x)',
      'parser.c': 'regcomp(&re, argv[1], 0);',
      'plain.go': 'regexp.MustCompile("[a-z]+")',
    });

    strict.deepStrictEqual(dynamic, ['app.ex', 'parser.c', 'stats.R']);
    strict.deepStrictEqual(staticWrap, ['core.clj']);
  });
});

await describe('scan gives nothing to a string no regular expression API receives', async () => {
  for (const [label, file, contents] of LOOK_ALIKES)
    await it(`gives nothing to ${label}`, async () => {
      strict.deepStrictEqual(await scanFiles({ [file]: contents }), NOTHING);
    });
});

await describe('scan ignores a regular expression that exists only in a comment', async () => {
  for (const [label, file, contents] of COMMENTS)
    await it(`ignores ${label}`, async () => {
      strict.deepStrictEqual(await scanFiles({ [file]: contents }), NOTHING);
    });
});

await describe('scan reads a slash as a regular expression only outside a string', async () => {
  await it('finds the literal that follows a wildcard media type', async () => {
    const { unsafe } = await scanFiles({
      'AvatarInput.tsx':
        'const input = <input type="file" accept="image/*" />;\nconst isSlug = (value: string) => /^([a-z0-9]+-?)+$/.test(value);',
    });

    strict.deepStrictEqual(sightings(unsafe), [
      'AvatarInput.tsx:^([a-z0-9]+-?)+$',
    ]);
  });

  await it('finds the literal that follows a glob', async () => {
    const { unsafe } = await scanFiles({
      'loader.rb':
        'Dir["lib/*.rb"].each { |file| require file }\nSLUG = /^([a-z0-9]+-?)+$/',
    });

    strict.deepStrictEqual(sightings(unsafe), ['loader.rb:^([a-z0-9]+-?)+$']);
  });

  await it('finds the PHP pattern that follows a glob', async () => {
    const { unsafe } = await scanFiles({
      'validate.php':
        "<?php\n$files = glob('/var/app/*.php');\n$valid = preg_match('/^(\\w+\\s?)*$/', $value);",
    });

    strict.deepStrictEqual(sightings(unsafe), ['validate.php:^(\\w+\\s?)*$']);
  });

  await it('gives nothing to a path that interpolates a value', async () => {
    const result = await scanFiles({
      'users_controller.rb':
        'redirect_to "/users/#{user.id}/edit"\nurl = "#{base}/#{user.id}/#{name}"',
    });

    strict.deepStrictEqual(result, NOTHING);
  });

  await it('finds the pattern that follows a URL on the single line of a bundle', async () => {
    const { unsafe } = await scanFiles({
      'bundle.js': `function q(s){return/"/.test(s)}var u="http://example.com";${'var x=1;'.repeat(200)}var r=new RegExp("(a+)+$");`,
    });

    strict.deepStrictEqual(sightings(unsafe), ['bundle.js:(a+)+$']);
  });

  await it('finds the literal a Ruby string interpolates', async () => {
    const { unsafe } = await scanFiles({
      'trace.rb': 'lines << "from #{line.gsub(/^([a-z0-9]+-?)+$/, "")}"',
    });

    strict.deepStrictEqual(sightings(unsafe), ['trace.rb:^([a-z0-9]+-?)+$']);
  });

  await it('finds the literal a JavaScript template interpolates', async () => {
    const { unsafe } = await scanFiles({
      'slug.ts':
        "const label = `/tags/${value.replace(/^([a-z0-9]+-?)+$/, '')}/*`;",
    });

    strict.deepStrictEqual(sightings(unsafe), ['slug.ts:^([a-z0-9]+-?)+$']);
  });
});

await describe('scan lists a file as building a regular expression only where it calls a constructor', async () => {
  for (const [label, file, contents] of DECLARATIONS)
    await it(`gives nothing to ${label}`, async () => {
      strict.deepStrictEqual(await scanFiles({ [file]: contents }), NOTHING);
    });
});

await describe('scan fails a string only on proof that it is a regular expression', async () => {
  await it('keeps a string bound to the name a call compiles', async () => {
    const { unsafe, unconfirmed } = await scanFiles({
      'validate.py': 'WORDS = "^(\\\\w+\\\\s?)*$"\n\nre.match(WORDS, value)',
    });

    strict.deepStrictEqual(sightings(unsafe), ['validate.py:^(\\w+\\s?)*$']);
    strict.deepStrictEqual(unconfirmed, []);
  });

  await it('follows the name into the file that compiles it', async () => {
    const { unsafe } = await scanFiles({
      'patterns.py': 'WORDS = "^(\\\\w+\\\\s?)*$"',
      'validate.py': 're.match(patterns.WORDS, value)',
    });

    strict.deepStrictEqual(sightings(unsafe), ['patterns.py:^(\\w+\\s?)*$']);
  });

  await it('follows the name when the scan covers only the file that holds the string', async () => {
    const { unsafe } = await scanFiles(
      {
        'patterns.py': 'WORDS = "^(\\\\w+\\\\s?)*$"',
        'validate.py': 're.match(patterns.WORDS, value)',
      },
      ['patterns.py']
    );

    strict.deepStrictEqual(sightings(unsafe), ['patterns.py:^(\\w+\\s?)*$']);
  });

  await it('follows the name into a string method that compiles it', async () => {
    const { unsafe, dynamic } = await scanFiles({
      'Validate.java':
        'private static final String WORDS = "^(\\\\w+\\\\s?)*$";\nboolean valid = value.matches(WORDS);',
    });

    strict.deepStrictEqual(sightings(unsafe), ['Validate.java:^(\\w+\\s?)*$']);
    strict.deepStrictEqual(dynamic, []);
  });

  await it('keeps a constant wrapped onto the next line', async () => {
    const { unsafe } = await scanFiles({
      'Patterns.java':
        'private static final String WORDS =\n    "^(\\\\w+\\\\s?)*$";',
      'Validate.java': 'Pattern words = Pattern.compile(Patterns.WORDS);',
    });

    strict.deepStrictEqual(sightings(unsafe), ['Patterns.java:^(\\w+\\s?)*$']);
  });

  await it('keeps a pattern a header defines for the file that compiles it', async () => {
    const { unsafe } = await scanFiles({
      'rules.h': '#define WORDS "^([a-z]+ ?)*$"',
      'rules.c': 'regcomp(&compiled, WORDS, REG_EXTENDED);',
    });

    strict.deepStrictEqual(sightings(unsafe), ['rules.h:^([a-z]+ ?)*$']);
  });

  await it('keeps the default value of a parameter a call compiles', async () => {
    const { unsafe } = await scanFiles({
      'validate.py':
        'def is_words(value, pattern="^(\\\\w+\\\\s?)*$"):\n    return re.match(pattern, value)',
    });

    strict.deepStrictEqual(sightings(unsafe), ['validate.py:^(\\w+\\s?)*$']);
  });

  await it('keeps a string in a list bound to the name a call compiles', async () => {
    const { unsafe } = await scanFiles({
      'rules.py':
        'RULES = [\n    "^(\\\\w+\\\\s?)*$",\n]\n\nfirst = re.compile(RULES[0])',
    });

    strict.deepStrictEqual(sightings(unsafe), ['rules.py:^(\\w+\\s?)*$']);
  });

  for (const [label, file, contents, source] of [...DECLARED, ...DIRECT])
    await it(`keeps ${label}`, async () => {
      const { unsafe } = await scanFiles({ [file]: contents });

      strict.deepStrictEqual(sightings(unsafe), [`${file}:${source}`]);
    });

  await it('lists a string as unconfirmed when its file compiles a value the scan cannot trace', async () => {
    const { unsafe, unconfirmed } = await scanFiles({
      'rules.py':
        'HEADER = "^(\\\\w+\\\\s?)*$"\n\ndef compile_for(name):\n    return re.compile(load(name))',
    });

    strict.deepStrictEqual(unsafe, []);
    strict.deepStrictEqual(unconfirmed, [
      {
        file: 'rules.py',
        source: '^(\\w+\\s?)*$',
        flags: '',
        reason: 'exponential',
        scope: 'search',
      },
    ]);
  });

  await it('lists a string as unconfirmed when its name only suggests a pattern', async () => {
    const { unsafe, unconfirmed } = await scanFiles({
      'rules.py': 'WORDS_PATTERN = "^(\\\\w+\\\\s?)*$"',
    });

    strict.deepStrictEqual(unsafe, []);
    strict.deepStrictEqual(sightings(unconfirmed), ['rules.py:^(\\w+\\s?)*$']);
  });

  await it('gives nothing to a string named like a word a multi-line pattern holds', async () => {
    const result = await scanFiles({
      'cookies.py':
        'key = "0 2 * * *"\nCOOKIE = re.compile(r"""\n    (?P<key> [a-z]{1,32} )  # the key\n""", re.VERBOSE)',
    });

    strict.deepStrictEqual(result, { ...NOTHING, dynamic: ['cookies.py'] });
  });

  await it('gives nothing to the text between two multi-line patterns', async () => {
    const result = await scanFiles({
      'cookies.py':
        'LEGAL = "a-z"\nCOOKIE = re.compile(r"""\n    [""" + LEGAL + r"""]+?  # any word\n""", re.VERBOSE)',
    });

    strict.deepStrictEqual(result, { ...NOTHING, dynamic: ['cookies.py'] });
  });

  await it('lists a string as unconfirmed when the value its file compiles is bound only in another file', async () => {
    const { unsafe, unconfirmed } = await scanFiles({
      'robots.py':
        'tail = "^(\\\\w+\\\\s?)*$"\n\ndef compile_for(path):\n    return re.compile(path)',
      'paths.py': 'path = "/tmp"',
    });

    strict.deepStrictEqual(unsafe, []);
    strict.deepStrictEqual(sightings(unconfirmed), ['robots.py:^(\\w+\\s?)*$']);
  });

  await it('keeps a traced string out of the unconfirmed list beside one the file cannot trace', async () => {
    const { unsafe, unconfirmed } = await scanFiles({
      'jobs.py':
        'WORDS = "^(\\\\w+\\\\s?)*$"\nSCHEDULE = "0 2 * * *"\n\nre.match(WORDS, value)',
    });

    strict.deepStrictEqual(sightings(unsafe), ['jobs.py:^(\\w+\\s?)*$']);
    strict.deepStrictEqual(unconfirmed, []);
  });
});
