import type { RegexAssessment } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { assess, check } from '../../../src/hooks/regex/regex.js';

const expectAll = (verdict: 'safe' | 'unsafe', patterns: string[]): void => {
  for (const pattern of patterns)
    it(`treats ${pattern} as ${verdict}`, () => {
      strict.strictEqual(check(pattern), verdict);
    });
};

const expectAssessments = (
  cases: readonly [string, string, RegexAssessment][]
): void => {
  for (const [pattern, flags, assessment] of cases)
    it(`reads ${pattern}${flags === '' ? '' : ` with ${flags}`} as ${JSON.stringify(assessment)}`, () => {
      strict.deepStrictEqual(assess(pattern, { flags }), assessment);
    });
};

const keywordsFrom = (letters: (index: number) => string): string =>
  `\\b(?:${Array.from({ length: 1500 }, (_, index) => letters(index)).join('|')})\\b`;

describe('check reports plainly safe patterns as safe', () => {
  expectAll('safe', [
    'foobar',
    'a{1,2}',
    '(a|b|c)d?',
    '[a-z0-9]+',
    'a*b*c*',
    '(ab)*',
    '\\(a*\\)*',
    '[(){}]+',
    '',
    'a',
  ]);
});

describe('an ambiguity nothing after it can fail is unsafe once the whole input must match', () => {
  expectAll('unsafe', [
    '(a*)*',
    '(a+)+',
    '((a*))*',
    '(a*)+',
    'a+a+',
    '(a|a)+',
    '([a-z]+)*',
    '(a+)+a',
    '.+.+',
    'Content-Type:\\s*([^\\r\\n]+)',
  ]);

  expectAll('safe', ['(a?)*', '(a(b(c)*)*)*', '(a|ab)+']);
});

describe('the same ambiguity is unsafe once a required failing element follows it', () => {
  expectAll('unsafe', [
    '(a*)*$',
    '^(a+)+$',
    '(a*)+b',
    '(x+x+)+y',
    '([a-z]+)*$',
    'a+a+b',
    '.*.*=.*',
    '\\w+\\d+x',
    '(a|a)+$',
    '(\\w|\\d)+!',
    '^([a-d]|[b-f])+$',
    '^(?:[a-z0-9]+\\.?)+$',
  ]);
});

describe('two runs that can trade characters before a failing anchor are unsafe', () => {
  expectAll('unsafe', [
    '^([IVXLC]+)\\.\\s*(.*)$',
    '^\\s*(.*)$',
    '^.*a.*a$',
    '^(a+)\\1$',
  ]);
});

describe('a run the search loop rescans from every starting position is unsafe', () => {
  expectAll('unsafe', [
    'boundary=(.+)$',
    '(.+)$',
    '(.*)$',
    '(.+?)$',
    'x.+$',
    '[a-z]+$',
    '\\s+$',
    '(abc)+$',
    '(a+abc)$',
    '([0-9]+x)$',
    '(a*)b',
    'a+b+',
    '\\d*;',
    '[abc]*x',
    '\\d+\\.\\d+',
    '[0-9]+[a-z]+x',
    '(.*)x',
    '([^"]*)"',
    '<([^>]+)>',
    '(a|ab)+$',
    '(\\w+)$',
    '(a.+)$',
    '(.+|x)$',
    '(.+abc)$',
  ]);
});

describe('adjacent runs and alternatives that share characters are unsafe', () => {
  expectAll('unsafe', ['\\d+[0-9]+x', '([a-d]|[b-f])+$', '([a-d]|[c-f])c*$']);
});

describe('a run is safe when anchored, opened by a delimiter it cannot consume, or alone', () => {
  expectAll('safe', [
    '^(.+)$',
    '^.+$',
    '^(.*)x',
    '^\\d+\\.\\d+$',
    '^filename="([^"]*)"',
    'filename="([^"]*)"',
    '"([^"]*)"',
    '([^"]*)',
    '[^\\r\\n]+',
    '^[^\\d]+[0-9]*$',
    '^[^\\w]+a*$',
    '([a]|[^a])+$',
    '^([a-c]|[d-f])+$',
    '^(?:[a-z]+\\.)+[a-z]+$',
    '\\b\\w+_(?:A|B)\\b',
  ]);
});

describe('flags change which characters the steps share', () => {
  it('folds case under the i flag, merging alternatives that differ only in case', () => {
    strict.strictEqual(check('^(?:a|A)+$', { flags: 'i' }), 'unsafe');
    strict.strictEqual(check('^(?:a|A)+$'), 'safe');
  });

  it('folds the Kelvin sign into \\w only under the iu flags', () => {
    strict.strictEqual(check('^(?:\\w|K)+$', { flags: 'iu' }), 'unsafe');
    strict.strictEqual(check('^(?:\\w|K)+$', { flags: 'u' }), 'safe');
  });

  it('folds final sigma and sigma together only under the iu flags', () => {
    strict.strictEqual(
      check('^(?:\\u03c2|\\u03c3)+$', { flags: 'iu' }),
      'unsafe'
    );
    strict.strictEqual(check('^(?:\\u03c2|\\u03c3)+$', { flags: 'u' }), 'safe');
  });

  it('keeps the dotless i apart from I under caseless matching', () => {
    strict.strictEqual(check('^(?:\\u0131|I)+$', { flags: 'iu' }), 'safe');
    strict.strictEqual(check('^(?:\\u0131|I)+$', { flags: 'i' }), 'safe');
  });

  it('lets the dot reach a newline only under the s flag', () => {
    strict.strictEqual(check('^(?:.|\\n)*!$', { flags: 's' }), 'unsafe');
    strict.strictEqual(check('^(?:.|\\n)*!$'), 'safe');
  });

  it('lets $ succeed before a newline under the m flag', () => {
    strict.strictEqual(check('(.*)$'), 'unsafe');
    strict.strictEqual(check('(.*)$', { flags: 'm' }), 'safe');
  });
});

describe('Unicode classes cover the characters the engine assigns to them', () => {
  it('reads \\s as every Unicode space and nothing else', () => {
    strict.strictEqual(check('^(?:\\s|\\u3000)+$'), 'unsafe');
    strict.strictEqual(check('^(?:\\s|\\u200b)+$'), 'safe');
  });

  it('reads a general category property by the letters it holds', () => {
    strict.strictEqual(check('^(?:\\p{L}|a)+$', { flags: 'u' }), 'unsafe');
    strict.strictEqual(check('^(?:\\p{Lu}|a)+$', { flags: 'u' }), 'safe');
  });

  it('widens a property to the other case under the iu flags', () => {
    strict.strictEqual(check('^(?:\\p{Lu}|a)+$', { flags: 'iu' }), 'unsafe');
  });

  it('reads a script property by its value', () => {
    strict.strictEqual(
      check('^(?:\\p{Script=Greek}|\\u03b1)+$', { flags: 'u' }),
      'unsafe'
    );
    strict.strictEqual(
      check('^(?:\\p{Script=Greek}|a)+$', { flags: 'u' }),
      'safe'
    );
  });

  it('reads a property of strings by the emoji it holds', () => {
    strict.strictEqual(
      check('^\\u{1f600}*\\p{RGI_Emoji}\\u{1f600}*$', { flags: 'v' }),
      'unsafe'
    );
    strict.strictEqual(check('^a*\\p{RGI_Emoji}a*$', { flags: 'v' }), 'safe');
  });
});

describe('a lookaround is judged by the work it repeats', () => {
  expectAll('safe', [
    '^a(?=a+a+)$',
    '^a(?!a+a+)$',
    '^a(?<=a+a+)$',
    '^a(?<!a+a+)$',
    '^(?=.*\\d.*\\d)',
    '^(?=.*\\d)(?=.*[a-z]).{8,}$',
    '(?<!\\\\)"',
  ]);

  expectAll('unsafe', ['^a+(?=a+a+)$', '(?=.*x)', '(?<=\\s+)\\S']);
});

describe('a lookbehind lets a search start only where the text already read allows it', () => {
  expectAll('safe', [
    '(?<=a)b+$',
    '(?<!\\\\)(\\\\*)\\$\\{([^${}]+)\\}',
    '(?<!\\\\)(?:\\\\\\\\)*(?:&NewLine;|&#0*10;)',
  ]);

  expectAll('unsafe', [
    '(?<!a)b+$',
    '(?<=x)\\d+\\d+y',
    '(?<!\\\\)(?:\\\\\\\\)*"(.*)$',
  ]);
});

describe('a backreference is judged by the text it can read again', () => {
  expectAll('safe', [
    '^(\\w+)\\s\\1$',
    '^(["\'])(?:\\\\.|(?!\\1)[^\\\\\\r\\n])*\\1$',
    '\\.|\\[(?:[^[\\]]*|(["\'])(?:(?!\\1)[^\\\\]|\\\\.)*?\\1)\\]',
    '^\\b(([gimyus])(?![gimyus]*\\2))+\\b',
  ]);

  expectAll('unsafe', ['(["\'])(?:\\\\.|(?!\\1)[^\\\\\\r\\n])*\\1']);
});

describe('a bounded repetition is unsafe once a search piles up more than 200 paths on one input', () => {
  expectAll('unsafe', [
    '(?:a|a){7}x',
    '(?:a|a){10}x',
    '(?:a|a){20}x',
    '^(?:a|a){20}x',
    '^(?:a|a){16}.*x$',
    '^(?:\\s*,?){0,20}$',
  ]);

  it('treats a case-insensitive IPv6 pattern as unsafe', () => {
    strict.strictEqual(
      check(
        '^(::)?(((\\d{1,3}\\.){3}(\\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$',
        { flags: 'i' }
      ),
      'unsafe'
    );
  });

  expectAll('safe', [
    '(?:a|a){6}x',
    '^(?:a|a){7}x',
    '\\s{0,31}!important$',
    '^\\/(.{1,4096})\\/([gimsuy]{0,6})$',
  ]);
});

describe('an iteration that matches nothing ends the repetition instead of multiplying its paths', () => {
  expectAll('safe', ['^(?:a?){0,30}b$', '^(?:a|){2,20}b$']);
});

describe('a large pattern is judged in full instead of refused for its size', () => {
  it('keeps a long alternation of keywords that part ways early safe', () => {
    const pattern = keywordsFrom(
      (index) =>
        `${String.fromCharCode(97 + (index % 26), 97 + (Math.floor(index / 26) % 26), 97 + Math.floor(index / 676))}word`
    );

    strict.strictEqual(check(pattern), 'safe');
  });
});

describe('check enforces the repetition limit', () => {
  it('keeps repetitions at the default limit safe', () => {
    strict.strictEqual(check('a?'.repeat(25)), 'safe');
  });

  it('reports repetitions above the default limit as unsafe', () => {
    strict.strictEqual(check('a?'.repeat(26)), 'unsafe');
  });

  it('honors a custom, stricter limit', () => {
    strict.strictEqual(check('a?a?a?', { repetitionLimit: 2 }), 'unsafe');
    strict.strictEqual(check('a?a?a?', { repetitionLimit: 3 }), 'safe');
  });
});

describe('check ignores the flags that do not change what a step matches', () => {
  it('keeps a vulnerable pattern unsafe under the d and g flags', () => {
    strict.strictEqual(check('(a+)+$', { flags: 'dg' }), 'unsafe');
  });
});

describe('check reports patterns that are not valid regexes as invalid regex', () => {
  const invalid = ['a)b', '(abc', '*abc', '[abc', 'a{2,1}', '\\'];

  for (const pattern of invalid) {
    it(`reports ${JSON.stringify(pattern)} as invalid regex`, () => {
      strict.strictEqual(check(pattern), 'invalid regex');
    });
  }
});

describe('an unsafe verdict names its strongest reason and the scope it appears in', () => {
  expectAssessments([
    [
      '(a+)+a',
      '',
      { verdict: 'unsafe', reason: 'exponential', scope: 'whole match' },
    ],
    [
      '^(a+)+$',
      '',
      { verdict: 'unsafe', reason: 'exponential', scope: 'search' },
    ],
    [
      '\\d+\\.\\d+',
      '',
      { verdict: 'unsafe', reason: 'polynomial of degree 2', scope: 'search' },
    ],
    [
      '\\d+[0-9]+x',
      '',
      { verdict: 'unsafe', reason: 'polynomial of degree 3', scope: 'search' },
    ],
    [
      '(?:a|a){7}x',
      '',
      {
        verdict: 'unsafe',
        reason: 'amplification score above 200',
        scope: 'search',
      },
    ],
    [
      'a?'.repeat(26),
      '',
      { verdict: 'unsafe', reason: 'more than 25 quantifiers', scope: null },
    ],
    ['^[a-z]+$', '', { verdict: 'safe' }],
    ['(abc', '', { verdict: 'invalid regex' }],
  ]);
});

describe('a pattern the analysis cannot settle reads undetermined, naming the cap it reached', () => {
  expectAssessments([
    [
      `${'('.repeat(600)}a+${')'.repeat(600)}`,
      '',
      { verdict: 'undetermined', reason: 'work cap reached', scope: null },
    ],
  ]);
});

describe('a search whose long bounded runs pile up at most 200 paths settles as safe', () => {
  expectAssessments([
    [
      '(?:==|!=)\\s{0,16}[^=;{}]{0,40}\\b(?:hmac|digest|mac)\\b|\\b(?:hmac|digest|mac)\\b\\s{0,16}[^=;{}]{0,40}(?:==|!=)',
      'i',
      { verdict: 'safe' },
    ],
    [
      '\\b(?:hmac|digest|mac|tag)\\b[^;=]{0,40}\\.SequenceEqual\\s{0,16}\\(|\\.SequenceEqual\\s{0,16}\\(\\s{0,16}[^)]{0,60}\\b(?:hmac|digest|mac|tag)\\b',
      'i',
      { verdict: 'safe' },
    ],
    [
      'from\\s{1,8}Crypto\\.Cipher\\s{1,8}import\\s{0,16}[^#\\n]{0,120}\\b(?:DES3|DES|ARC4|ARC2|Blowfish)\\b',
      'i',
      { verdict: 'safe' },
    ],
    [
      'from\\s{1,8}Crypto\\.Hash\\s{1,8}import\\s{0,16}[^#\\n]{0,120}\\b(?:MD5|SHA1)\\b|\\b(?:MD5|SHA1)\\.new\\s{0,16}\\(',
      'i',
      { verdict: 'safe' },
    ],
    [
      '^[ \\t]*[\\w-]{0,64}(?:password|secret|token|api_key|access_key|client_secret|private_key)[ \\t]*=[ \\t]*"(?!\\$\\{)[^"]{6,4096}"',
      'im',
      { verdict: 'safe' },
    ],
  ]);
});

describe('the vulnerabilities proven in this repository read as polynomial searches', () => {
  expectAssessments([
    [
      '\\beyJ[A-Za-z0-9_-]{8,}\\.eyJ[A-Za-z0-9_-]{8,}\\.[A-Za-z0-9_-]{8,}\\b',
      '',
      { verdict: 'unsafe', reason: 'polynomial of degree 2', scope: 'search' },
    ],
    [
      '^([IVXLC]+)\\.\\s*(.*)$',
      '',
      { verdict: 'unsafe', reason: 'polynomial of degree 2', scope: 'search' },
    ],
    [
      '^#\\s+(.+?)\\s+(Detect Map|Security Charter)',
      'm',
      { verdict: 'unsafe', reason: 'polynomial of degree 3', scope: 'search' },
    ],
    [
      '^[\'"`]+|[\'"`]+$',
      'g',
      { verdict: 'unsafe', reason: 'polynomial of degree 2', scope: 'search' },
    ],
    [
      '(^|[^:])\\/\\/.*$',
      '',
      { verdict: 'unsafe', reason: 'polynomial of degree 2', scope: 'search' },
    ],
    [
      '\\/\\*[\\s\\S]*?\\*\\/',
      'g',
      { verdict: 'unsafe', reason: 'polynomial of degree 2', scope: 'search' },
    ],
  ]);
});

describe('the matchers of this repository the automaton judges linear never read unsafe', () => {
  const linear: [string, string][] = [
    [
      'System\\.getenv\\s{0,16}\\([^)]{0,200}\\)[^;\\n]{0,120}\\.orElse\\s{0,16}\\(\\s{0,16}([\'"])([^\'"]{8,512})\\1',
      '',
    ],
    [
      '\\benv::var\\w{0,8}\\s{0,16}\\([^)]{0,200}\\)[^;\\n]{0,120}\\.unwrap_or(?:_else)?\\s{0,16}\\([^"\'\\n]{0,40}([\'"])([^\'"]{8,512})\\1',
      '',
    ],
    [
      '\\$\\{\\{\\s{0,16}github\\.event\\.[^}]{0,200}(?:title|body|message|name|email|label|ref|head_ref|comment|description|author|default_branch)[^}]{0,200}\\}\\}',
      'i',
    ],
    [
      'from\\s{1,8}Crypto\\.Cipher\\s{1,8}import\\s{0,16}[^#\\n]{0,120}\\b(?:DES3|DES|ARC4|ARC2|Blowfish)\\b',
      'i',
    ],
    [
      '(?:(?:Set|List|Arrays)\\.(?:of|asList)|JWSVerificationKeySelector\\s{0,4}(?:<[^>]{0,60}>)?)\\s{0,4}\\(\\s{0,4}((?:JWSAlgorithm\\.[A-Za-z0-9]{2,8}\\s{0,3},?\\s{0,3}){1,8})',
      'i',
    ],
  ];

  for (const [pattern, flags] of linear)
    it(`does not read ${pattern.slice(0, 40)}… as unsafe`, () => {
      strict.notStrictEqual(check(pattern, { flags }), 'unsafe');
    });
});
