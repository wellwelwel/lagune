import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import { analyze, analyzeFor, classify } from '../../../src/hooks/jwt/jwt.js';

const expectAll = (
  verdict: 'unpinned' | 'safe' | 'invalid',
  cases: [snippet: string, language: LanguageId][]
): void => {
  for (const [snippet, language] of cases)
    it(`classifies ${JSON.stringify(snippet)} (${language}) as ${verdict}`, () => {
      strict.strictEqual(classify(snippet, language), verdict);
    });
};

describe('classify flags unpinned, unsafe, and disabled verification across languages', () => {
  expectAll('unpinned', [
    ['jwt.verify(token, secret)', 'javascript'],
    ['jwt.verify(t, k, { algorithms: ["none"] })', 'javascript'],
    ['jwt.verify(t, k, { algorithms: ["RS256", "HS256"] })', 'javascript'],
    ['jwt.decode(token, key, algorithms=["none"])', 'python'],
    ['jwt.decode(token, key, options={"verify_signature": False})', 'python'],
    ['jwt.decode(token, key)', 'python'],
    ['token, err := jwt.Parse(tokenString, keyFunc)', 'go'],
    ['token, _, err := jwt.ParseUnverified(tokenString, claims)', 'go'],
    ['Jwts.parser().unsecured().build().parseClaimsJwt(jwt)', 'java'],
    ["JWT::decode($jwt, new Key($key, 'none'))", 'php'],
    ['JWT.decode(token, key, false)', 'ruby'],
    ['JWT.decode(token, key)', 'ruby'],
    ['validation.insecure_disable_signature_validation();', 'rust'],
    [
      'var p = new TokenValidationParameters { RequireSignedTokens = false };',
      'csharp',
    ],
  ]);
});

describe('classify reports a soundly or implicitly pinned verify as safe', () => {
  expectAll('safe', [
    ['jwt.verify(token, secret, { algorithms: ["HS256"] })', 'javascript'],
    ['await jwtVerify(token, key, { algorithms: ["RS256"] })', 'javascript'],
    ['jwt.decode(token, key, algorithms=["HS256"])', 'python'],
    ['jwt.decode(token, key, algorithms=ALLOWED)', 'python'],
    ['jwt.Parse(t, kf, jwt.WithValidMethods([]string{"RS256"}))', 'go'],
    ['Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt)', 'java'],
    ["JWT::decode($jwt, new Key($key, 'HS256'))", 'php'],
    ["JWT.decode(token, key, true, { algorithm: 'HS256' })", 'ruby'],
    [
      'decode::<Claims>(&token, &key, &Validation::new(Algorithm::HS256))',
      'rust',
    ],
  ]);
});

describe('classify reports a snippet with no verify call as invalid', () => {
  expectAll('invalid', [
    ['jwt.sign(payload, secret)', 'javascript'],
    ['jwt.encode(payload, key, algorithm="HS256")', 'python'],
    ['JWT decoded = JWT.decode(token);', 'java'],
    ['const x = 1', 'javascript'],
    ['', 'javascript'],
  ]);
});

describe('classify never flags ordinary same-name calls', () => {
  for (const [snippet, language] of [
    ['mockService.verify(payload);', 'java'],
    ['logger.info("verifying token with RS256")', 'java'],
    ['const decoded = jwt.decode(token);', 'javascript'],
    ['requests.get(url, verify=False)', 'python'],
    ['admin.auth().verifyIdToken(idToken)', 'javascript'],
  ] as [string, LanguageId][])
    it(`leaves ${JSON.stringify(snippet)} (${language}) unflagged`, () => {
      strict.notStrictEqual(classify(snippet, language), 'unpinned');
    });
});

describe('analyze flags an unpinned verify across its option window', () => {
  it('flags a JS verify whose options omit the algorithms pin', () => {
    const result = analyze(
      'auth.ts',
      'const payload = jwt.verify(token, secret, {\n  audience: "app",\n  issuer: "me",\n})'
    );

    strict.strictEqual(result.findings.length, 1);
  });

  it('passes a JS verify that pins algorithms in the option window', () => {
    const result = analyze(
      'auth.ts',
      'const payload = jwt.verify(token, secret, {\n  algorithms: ["RS256"],\n})'
    );

    strict.strictEqual(result.findings.length, 0);
  });

  it('routes a Go file to the Go rules', () => {
    strict.strictEqual(
      analyzeFor('go', 'token, err := jwt.Parse(tokenString, keyFunc)').findings
        .length,
      1
    );
  });

  it('skips a file of an unknown extension', () => {
    strict.strictEqual(
      analyze('notes.txt', 'jwt.verify(token, secret)').findings.length,
      0
    );
  });
});
