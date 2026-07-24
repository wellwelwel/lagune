import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { analyze, analyzeFor } from '../../../src/hooks/secrets/secrets.js';

// Fixture hygiene: build token bodies from parts / obvious fillers so no
// real-looking secret is ever committed.
const GITHUB_TOKEN = 'ghp_' + 'x'.repeat(36);
const AWS_KEY = 'AKIA' + 'IOSFODNN7EXAMPLE';

describe('analyzeFor flags hardcoded credentials as findings', () => {
  it('reviews a secret-named identifier bound to a string literal', () => {
    const result = analyzeFor(
      'javascript',
      'const apiKey = "s3cr3t-value-1234";'
    );

    strict.strictEqual(result.findings.length, 0);
    strict.strictEqual(result.review.length, 1);
  });

  it('reviews a compound camelCase / snake_case secret identifier', () => {
    strict.strictEqual(
      analyzeFor('javascript', 'const accessToken = "s3cr3t-value-1234";')
        .review.length,
      1
    );
    strict.strictEqual(
      analyzeFor('python', 'db_password = "s3cr3t-value-1234"').review.length,
      1
    );
  });

  it('reviews a secret-named literal by provenance, not by value shape', () => {
    // a UUID or hex value can be a real token, so it is surfaced as a lead to
    // confirm rather than judged (and silently dropped) by its shape
    strict.strictEqual(
      analyzeFor(
        'javascript',
        'const apiToken = "550e8400-e29b-41d4-a716-446655440000";'
      ).review.length,
      1
    );
    strict.strictEqual(
      analyzeFor('rust', 'let secret = "5f4dcc3b5aa765d61d8327deb882cf99";')
        .review.length,
      1
    );
  });

  it('flags a credential embedded in a connection string, in any language', () => {
    strict.strictEqual(
      analyzeFor(
        'javascript',
        'const db = "postgres://admin:S3cr3tP4ss99@db.prod:5432/app";'
      ).findings.length,
      1
    );
    strict.strictEqual(
      analyzeFor(
        'go',
        'dsn := "postgres://admin:S3cr3tP4ss99@db.prod:5432/app"'
      ).findings.length,
      1
    );
  });

  it('passes a secret-named identifier read from the environment', () => {
    const result = analyzeFor(
      'javascript',
      'const apiKey = process.env.API_KEY;'
    );

    strict.strictEqual(result.findings.length, 0);
    strict.strictEqual(result.review.length, 0);
  });

  it('passes a placeholder or too-short literal', () => {
    strict.strictEqual(
      analyzeFor('javascript', 'const token = "changeme";').findings.length,
      0
    );
    strict.strictEqual(
      analyzeFor('javascript', 'const token = "";').findings.length,
      0
    );
  });

  it('flags a committed provider token by its format, language-agnostic', () => {
    strict.ok(
      analyzeFor('rust', `let t = "${GITHUB_TOKEN}";`).findings.length >= 1
    );
  });
});

describe('analyzeFor reads the environment fallback in each language', () => {
  const cases: [language: LanguageId, line: string][] = [
    [
      'javascript',
      'const key = process.env.API_KEY ?? "fallback-secret-1234";',
    ],
    ['python', 'API_KEY = os.getenv("API_KEY", "fallback-secret-1234")'],
    ['python', 'API_KEY = os.getenv("API_KEY") or "fallback-secret-1234"'],
    ['ruby', 'api_key = ENV.fetch("API_KEY", "fallback-secret-1234")'],
    ['php', '$key = getenv("API_KEY") ?: "fallback-secret-1234";'],
    ['kotlin', 'val key = System.getenv("API_KEY") ?: "fallback-secret-1234"'],
    [
      'csharp',
      'var key = Environment.GetEnvironmentVariable("API_KEY") ?? "fallback-secret-1234";',
    ],
  ];

  for (const [language, line] of cases)
    it(`flags a hardcoded env default in ${language}`, () => {
      strict.strictEqual(analyzeFor(language, line).findings.length, 1);
    });

  it('passes a placeholder env default', () => {
    strict.strictEqual(
      analyzeFor('python', 'API_KEY = os.getenv("API_KEY", "changeme")')
        .findings.length,
      0
    );
  });

  it('passes a non-secret env var default', () => {
    strict.strictEqual(
      analyzeFor(
        'javascript',
        'const env = process.env.NODE_ENV ?? "development";'
      ).findings.length,
      0
    );
    strict.strictEqual(
      analyzeFor(
        'go',
        'host := cmp.Or(os.Getenv("DB_HOST"), "database.internal")'
      ).findings.length,
      0
    );
  });
});

describe('analyzeFor reads the log/response sink in each language', () => {
  const cases: [language: LanguageId, line: string][] = [
    ['javascript', 'console.log("auth token", token);'],
    ['python', 'print("api_key", api_key)'],
    ['go', 'fmt.Println("api_key", apiKey)'],
    ['rust', 'println!("token {}", token);'],
    ['ruby', 'puts "password: #{password}"'],
    ['php', 'echo "api_key: " . $apiKey;'],
  ];

  for (const [language, line] of cases)
    it(`reviews a secret flowing into a sink in ${language}`, () => {
      const result = analyzeFor(language, line);

      strict.strictEqual(result.findings.length, 0);
      strict.strictEqual(result.review.length, 1);
    });
});

describe('analyzeFor never flags one language construct in another', () => {
  it('does not read a JS console.log sink under python', () => {
    strict.strictEqual(
      analyzeFor('python', 'console.log("token", token)').review.length,
      0
    );
  });

  it('does not read a JS ?? env fallback under go', () => {
    strict.strictEqual(
      analyzeFor('go', 'key := os.Getenv("API_KEY") ?? "fallback-secret-1234"')
        .findings.length,
      0
    );
  });

  it('does not read a bare-word sink inside a prose string', () => {
    strict.strictEqual(
      analyzeFor('ruby', 'flash[:notice] = "We will never print your password"')
        .review.length,
      0
    );
    strict.strictEqual(
      analyzeFor('php', '$msg = "please print your token";').review.length,
      0
    );
  });
});

describe('analyze dispatches by file extension', () => {
  it('reads a python env fallback from a .py file', () => {
    const result = analyze(
      'config.py',
      'API_KEY = os.getenv("API_KEY", "fallback-secret-1234")'
    );

    strict.strictEqual(result.findings.length, 1);
  });

  it('runs the language-agnostic core on an unknown extension', () => {
    const result = analyze('deploy.sh', `export KEY="${GITHUB_TOKEN}"`);

    strict.ok(result.findings.length >= 1);
  });

  it('skips a language sink on an unknown extension', () => {
    const result = analyze('notes.txt', 'console.log("token", token)');

    strict.strictEqual(result.review.length, 0);
    strict.strictEqual(result.findings.length, 0);
  });
});

describe('provider signatures cover PEM variants and tight OpenAI keys', () => {
  it('flags a PGP private key BLOCK header', () => {
    const result = analyzeFor(
      'javascript',
      '-----BEGIN PGP PRIVATE KEY BLOCK-----'
    );

    strict.ok(result.findings.length >= 1);
  });

  it('flags an encrypted PKCS#8 private key header', () => {
    const result = analyzeFor(
      'javascript',
      '-----BEGIN ENCRYPTED PRIVATE KEY-----'
    );

    strict.ok(result.findings.length >= 1);
  });

  it('flags an OpenAI legacy and project secret key', () => {
    const legacy = 'sk-' + 'A1b2C3d4E5f6G7h8I9j0'.repeat(2) + 'ABCD';
    const project = 'sk-proj-' + 'aB3-_x'.repeat(6);

    strict.ok(
      analyzeFor('javascript', `const k = "${legacy}"`).findings.length >= 1
    );
    strict.ok(
      analyzeFor('javascript', `const k = "${project}"`).findings.length >= 1
    );
  });

  it('does not flag a sk-prefixed kebab-case slug as a finding', () => {
    const result = analyzeFor(
      'javascript',
      'const cls = "sk-button-primary-large-variant";'
    );

    strict.strictEqual(result.findings.length, 0);
  });
});

describe('connection strings cover a password-only DSN', () => {
  it('flags a Redis DSN with an empty username', () => {
    const result = analyzeFor(
      'javascript',
      'const url = "redis://:s3cr3tPass@cache.internal:6379";'
    );

    strict.ok(result.findings.length >= 1);
  });
});

describe('analyze reads C-family preprocessor lines as code', () => {
  it('flags a #define-bound provider signature in C', () => {
    const result = analyze('config.c', `#define AWS_KEY "${AWS_KEY}"`);

    strict.ok(result.findings.length >= 1);
  });

  it('flags a #define-bound provider signature in Objective-C', () => {
    const result = analyze('config.m', `#define AWS_KEY "${AWS_KEY}"`);

    strict.ok(result.findings.length >= 1);
  });
});

describe('analyze does not fire on commented-out code', () => {
  it('skips a secret-named literal inside a /* */ block comment', () => {
    const result = analyze(
      'app.js',
      '/*\n const apiKey = "s3cr3t-value-1234";\n*/'
    );

    strict.strictEqual(result.review.length, 0);
  });

  it('still flags a raw provider signature inside a comment', () => {
    const result = analyze('app.js', `// leftover key ${AWS_KEY}`);

    strict.ok(result.findings.length >= 1);
  });
});
