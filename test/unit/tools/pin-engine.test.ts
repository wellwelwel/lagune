import { describe, it, strict } from 'poku';
import { pinEngine } from '../../../tools/pin-engine.js';

describe('pinning the engine for a release', () => {
  it('moves every engine call to the release version, pinned or not', () => {
    const text = [
      'npx --yes lagune catalog',
      'Run `npx --yes lagune@0.15.0 validate plan` from the project root.',
      "npx --yes lagune@1.0.0-rc.1 regex --pattern '<PATTERN>'",
    ].join('\n');

    strict.strictEqual(
      pinEngine(text, '0.16.0'),
      [
        'npx --yes lagune@0.16.0 catalog',
        'Run `npx --yes lagune@0.16.0 validate plan` from the project root.',
        "npx --yes lagune@0.16.0 regex --pattern '<PATTERN>'",
      ].join('\n')
    );
  });

  it('leaves every version that is not the engine call untouched', () => {
    const text = [
      'Set `Version` to `1.0.0`.',
      'npx --yes skills@1.7.4 add . --list',
      'https://cdn.jsdelivr.net/npm/lagune@0.15.0/schemas/configs.json',
      'npx lagune@latest catalog',
    ].join('\n');

    strict.strictEqual(pinEngine(text, '0.16.0'), text);
  });
});
