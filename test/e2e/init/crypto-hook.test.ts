import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import { initInto, newWorkspace, spawnHook } from './__utils__.js';

await describe('the scaffolded crypto hook runs without install', async () => {
  await it('scores a snippet and scans a file', async () => {
    const workspace = await newWorkspace();

    await initInto(workspace, { init: true, agent: 'claude' });

    const weak = await spawnHook(workspace, 'crypto.mjs', [
      '-l',
      'javascript',
      '-p',
      'createCipher("aes-256-cbc", key)',
    ]);
    strict.strictEqual(weak.stdout.trim(), 'weak');
    strict.strictEqual(weak.code, 1);

    const review = await spawnHook(workspace, 'crypto.mjs', [
      '-l',
      'python',
      '-p',
      'hashlib.md5(data)',
    ]);
    strict.strictEqual(review.stdout.trim(), 'review');
    strict.strictEqual(review.code, 0);

    const safe = await spawnHook(workspace, 'crypto.mjs', [
      '-l',
      'javascript',
      '-p',
      'randomBytes(16)',
    ]);
    strict.strictEqual(safe.stdout.trim(), 'safe');
    strict.strictEqual(safe.code, 0);

    await writeFile(
      join(workspace, 'cipher.ts'),
      'import c from "node:crypto";\nexport const d = () => c.createCipher("aes-256-cbc", key);\n',
      'utf8'
    );
    const scan = await spawnHook(workspace, 'crypto.mjs', ['-f', 'cipher.ts']);
    strict.ok(scan.stdout.includes('Weak cryptography found:'));
    strict.strictEqual(scan.code, 1);

    await writeFile(
      join(workspace, 'cipher.go'),
      'package main\n\nimport "crypto/des"\n\nfunc newCipher(key []byte) { des.NewCipher(key) }\n',
      'utf8'
    );
    const go = await spawnHook(workspace, 'crypto.mjs', ['-f', 'cipher.go']);
    strict.ok(go.stdout.includes('Weak cryptography found:'));
    strict.strictEqual(go.code, 1);
  });
});
