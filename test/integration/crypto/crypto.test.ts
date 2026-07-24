import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import {
  analyze,
  analyzeFor,
  classify,
} from '../../../src/hooks/crypto/crypto.js';

const expectAll = (
  verdict: 'weak' | 'review' | 'safe' | 'invalid',
  cases: [snippet: string, language: LanguageId][]
): void => {
  for (const [snippet, language] of cases)
    it(`classifies ${JSON.stringify(snippet)} (${language}) as ${verdict}`, () => {
      strict.strictEqual(classify(snippet, language), verdict);
    });
};

describe('classify reports decidably weak ciphers as weak across languages', () => {
  expectAll('weak', [
    ['const c = crypto.createCipher("aes-256-cbc", key)', 'javascript'],
    ['createDecipher("aes192", key)', 'javascript'],
    ['const algo = "des-ede3-cbc"', 'javascript'],
    ['const mode = "aes-128-ecb"', 'javascript'],
    ['cipher = DES.new(key, DES.MODE_CBC, iv)', 'python'],
    ['enc = Cipher(algorithms.TripleDES(key), modes.CBC(iv))', 'python'],
    ['cipher = AES.new(key, AES.MODE_ECB)', 'python'],
    ['block, _ := des.NewCipher(key)', 'go'],
    ['Cipher c = Cipher.getInstance("DES/CBC/PKCS5Padding")', 'java'],
    ['let cipher = Rc4::new(key.into());', 'rust'],
    ['using var des = DES.Create();', 'csharp'],
    ['$enc = openssl_encrypt($d, "des-ede3-cbc", $k);', 'php'],
    ["c = OpenSSL::Cipher.new('des-cbc')", 'ruby'],
  ]);
});

describe('classify reports MD5/SHA-1 digests as review across languages', () => {
  expectAll('review', [
    ['crypto.createHash("md5")', 'javascript'],
    ["createHash('sha1')", 'javascript'],
    ['h = hashlib.md5(data).hexdigest()', 'python'],
    ['sum := sha1.Sum(data)', 'go'],
    ['MessageDigest.getInstance("MD5")', 'java'],
    ['h = Digest::MD5.hexdigest(x)', 'ruby'],
    ['$h = md5($data);', 'php'],
    ['using var h = MD5.Create();', 'csharp'],
    ['MD5(data, len, out);', 'c'],
  ]);
});

describe('classify reports sound crypto usage as safe', () => {
  expectAll('safe', [
    ['crypto.createHash("sha256")', 'javascript'],
    ['crypto.createCipheriv("aes-256-gcm", key, iv)', 'javascript'],
    ['MessageDigest.getInstance("SHA-256")', 'java'],
    ['token = secrets.token_hex(32)', 'python'],
    ['sum := sha256.Sum256(data)', 'go'],
  ]);
});

describe('classify reports snippets with no crypto construct as invalid', () => {
  expectAll('invalid', [
    ['const total = a + b', 'javascript'],
    ['return res.json({ ok: true })', 'javascript'],
    ['x = a + b', 'python'],
    ['', 'javascript'],
  ]);
});

describe('analyze splits weak findings from review leads per language', () => {
  it('flags a weak cipher as a finding, no review', () => {
    const result = analyzeFor(
      'javascript',
      'const c = crypto.createCipher("aes-256-cbc", key)'
    );

    strict.strictEqual(result.findings.length, 1);
    strict.strictEqual(result.review.length, 0);
  });

  it('reviews a python md5 digest, leaving intent to the reader', () => {
    const result = analyzeFor('python', 'h = hashlib.md5(x).hexdigest()');

    strict.strictEqual(result.findings.length, 0);
    strict.strictEqual(result.review.length, 1);
  });

  it('flags Math.random only in a security context, as review', () => {
    strict.strictEqual(
      analyzeFor('javascript', 'const token = Math.random().toString(36)')
        .review.length,
      1
    );
    strict.strictEqual(
      analyzeFor('javascript', 'const jitter = Math.random() * 100').review
        .length,
      0
    );
  });

  it('flags a non-crypto RNG only in a security context (php)', () => {
    strict.strictEqual(
      analyzeFor('php', '$token = mt_rand();').review.length,
      1
    );
    strict.strictEqual(
      analyzeFor('php', '$jitter = mt_rand();').review.length,
      0
    );
  });

  it('flags a timing-unsafe hmac comparison as review, not a finding', () => {
    const result = analyzeFor(
      'javascript',
      'if (hmac === expected) return true'
    );

    strict.strictEqual(result.findings.length, 0);
    strict.strictEqual(result.review.length, 1);
  });

  it('flags single-DES in a non-ECB mode as weak (javascript)', () => {
    strict.strictEqual(
      classify("crypto.createCipheriv('des-cbc', k, iv)", 'javascript'),
      'weak'
    );
  });

  it('does not treat a bare rand.Seed as a security-context PRNG (go)', () => {
    strict.strictEqual(
      classify('rand.Seed(time.Now().UnixNano())', 'go'),
      'safe'
    );
    strict.strictEqual(classify('salt := rand.Intn(n)', 'go'), 'review');
  });

  it('requires a whole word for a C# timing comparison', () => {
    strict.strictEqual(
      analyzeFor('csharp', 'if (algorithmDigestName == config) {}').review
        .length,
      0
    );
    strict.strictEqual(
      analyzeFor('csharp', 'if (hmac == expected) {}').review.length,
      1
    );
  });

  it('recognizes canonical safe crypto so it is not invalid', () => {
    strict.strictEqual(
      classify('cipher = AES.new(key, AES.MODE_GCM)', 'python'),
      'safe'
    );
    strict.strictEqual(classify('let c = Aes256Gcm::new(key)', 'rust'), 'safe');
  });

  it('still sees the security context after a closed block comment', () => {
    const result = analyzeFor(
      'javascript',
      '/* setup */\nconst token = Math.random().toString(36)'
    );

    strict.strictEqual(result.review.length, 1);
  });
});

describe('analyze dispatches by file extension and isolates languages', () => {
  it('routes a Go file to the Go rules', () => {
    strict.ok(
      analyze('cipher.go', 'block, _ := des.NewCipher(key)').findings.length >=
        1
    );
  });

  it('skips a file of an unknown extension', () => {
    const result = analyze('notes.txt', 'des.NewCipher(key)');

    strict.strictEqual(result.findings.length, 0);
    strict.strictEqual(result.review.length, 0);
  });

  it('does not read a JavaScript cipher under python', () => {
    strict.strictEqual(
      analyzeFor('python', 'createCipher("aes-256-cbc", key)').findings.length,
      0
    );
  });
});
