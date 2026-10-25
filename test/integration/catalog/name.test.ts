import { describe, it, strict } from 'poku';
import { isSpecializationName } from '../../../src/catalog/name.js';

describe('a specialization name uses only lowercase letters, digits, and hyphens', () => {
  for (const name of ['regex', 'access-control', 'c-cpp', 'owasp2'])
    it(`accepts ${name}`, () => {
      strict.strictEqual(isSpecializationName(name), true);
    });

  for (const name of [
    '',
    '../configs.json',
    '..',
    'a/b',
    'a\\b',
    'regex.md',
    'Regex',
    'regex ',
    'regex\n',
    'reg ex',
    'régex',
  ])
    it(`rejects ${JSON.stringify(name)}`, () => {
      strict.strictEqual(isSpecializationName(name), false);
    });
});
