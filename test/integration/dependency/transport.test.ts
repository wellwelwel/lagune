import { describe, it, strict } from 'poku';
import { isPlainTransport } from '../../../src/hooks/dependency/transport.js';

describe('a URL travels in the clear unless it stays on the machine, written so every URL parser reads the same host', () => {
  const cases: Array<[string, boolean]> = [
    ['http://registry.example.com/simple', true],
    ['git://github.com/me/repo.git', true],
    ['git+http://git.example.com/repo.git', true],
    ['sparse+http://index.example.com/', true],
    ['https://registry.example.com/simple', false],
    ['http://localhost:4873/pad/-/pad-1.0.0.tgz', false],
    ['http://localhost', false],
    ['http://LOCALHOST/simple', false],
    ['http://127.0.0.1:3141/root/pypi/+simple/', false],
    ['http://127.10.0.1/simple', false],
    ['http://[::1]:8081/repository/maven-public/', false],
    ['git://localhost/repo.git', false],
    ['git+http://localhost/repo.git', false],
    ['sparse+http://localhost:8000/index/', false],
    ['http://localhost@evil.example/simple', true],
    ['http://localhost\\@evil.example/simple', true],
    ['http://localhost:4873@evil.example/simple', true],
    ['http://127.0.0.1.evil.example/simple', true],
    ['http://evil.localhost/simple', true],
    ['http://localhost./simple', true],
    ['http://0x7f.0.0.1/simple', true],
    ['http://2130706433/simple', true],
    ['http://[::ffff:127.0.0.1]/simple', true],
    ['http://0.0.0.0/', true],
  ];

  for (const [url, plain] of cases)
    it(`reads ${url} as ${plain ? 'plain' : 'protected or local'}`, () => {
      strict.strictEqual(isPlainTransport(url), plain);
    });
});
