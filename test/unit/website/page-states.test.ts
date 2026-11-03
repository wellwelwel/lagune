import { describe, it, strict } from 'poku';
import {
  pageState,
  sourceHash,
} from '../../../website/plugins/docs-content/translation.js';

const ENGLISH_HASH =
  'fdae74b653d0d4f2edb0867b7d5c34402f2ae42326d3df4cf8555853e30d32d4';

describe('the state of a page in a translated locale', () => {
  it('records the English source as the SHA-256 of its content with LF line endings', () => {
    strict.strictEqual(sourceHash('Run it.\nThen check.\n'), ENGLISH_HASH);
    strict.strictEqual(sourceHash('Run it.\r\nThen check.\r\n'), ENGLISH_HASH);
  });

  it('is untranslated while the locale has no translation of the page', () => {
    strict.strictEqual(pageState(undefined, ENGLISH_HASH), 'untranslated');
  });

  it('is translated while the translation records the current English source', () => {
    strict.strictEqual(
      pageState({ sourceHash: ENGLISH_HASH }, ENGLISH_HASH),
      'translated'
    );
  });

  const staleCases = [
    {
      name: 'the English source changed since',
      recorded:
        '2ac7b62fcc6d5e00b07677ed2dc35b5138137002e169b9a67d23fa3f7a34c1a9',
    },
    { name: 'it records no source', recorded: undefined },
    { name: 'it records a malformed source', recorded: 'not-a-hash' },
    { name: 'its source is not text', recorded: 42 },
  ];

  for (const { name, recorded } of staleCases)
    it(`is stale when a translation exists but ${name}`, () => {
      strict.strictEqual(
        pageState({ sourceHash: recorded }, ENGLISH_HASH),
        'stale'
      );
    });
});
