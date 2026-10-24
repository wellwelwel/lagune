import { describe, it, strict } from 'poku';
import { BUILTIN_SPECIALIZATIONS } from '../../../src/catalog/builtin.js';
import { builtinsIn, list, merge } from '../../../src/catalog/catalog.js';

const OWASP = [
  'regex',
  'network',
  'interpreter',
  'sql',
  'path',
  'upload',
  'access-control',
  'credential-endpoint',
  'federation',
  'http-request',
  'transport',
  'crypto',
  'secrets',
  'api-endpoint',
  'payment',
  'xml',
  'csv',
  'container',
  'serverless',
];

const namesIn = (keys: string[]): string[] =>
  builtinsIn(BUILTIN_SPECIALIZATIONS, keys).map((entry) => entry.name);

describe('builtinsIn collects the built-ins of the given categories', () => {
  it('returns the built-ins of one category in index order', () => {
    strict.deepStrictEqual(namesIn(['owasp']), OWASP);
    strict.deepStrictEqual(namesIn(['infra']), [
      'container',
      'infra',
      'serverless',
    ]);
  });

  it('merges categories in index order, listing a shared built-in once', () => {
    strict.deepStrictEqual(namesIn(['javascript', 'owasp']), [
      'regex',
      'javascript',
      'browser',
      ...OWASP.slice(1),
    ]);
  });

  it('matches the key strictly and returns nothing for no category', () => {
    strict.deepStrictEqual(namesIn(['OWASP']), []);
    strict.deepStrictEqual(namesIn([]), []);
  });
});

describe('merge folds the project own specializations into the built-ins', () => {
  it('keeps every built-in when the project adds nothing', () => {
    const builtin = [{ name: 'regex', tags: ['RegExp'], required: true }];

    strict.deepStrictEqual(merge(builtin, []), builtin);
  });

  it('appends an own specialization after the built-ins', () => {
    strict.deepStrictEqual(
      merge(
        [{ name: 'regex', tags: ['RegExp'] }],
        [{ name: 'graphql', tags: ['GraphQL'] }]
      ),
      [
        { name: 'regex', tags: ['RegExp'] },
        { name: 'graphql', tags: ['GraphQL'] },
      ]
    );
  });

  it('lets the own specialization win a name, dropping the built-in flag', () => {
    strict.deepStrictEqual(
      merge(
        [{ name: 'regex', tags: ['RegExp'], required: true }],
        [{ name: 'regex', tags: ['custom'] }]
      ),
      [{ name: 'regex', tags: ['custom'] }]
    );
  });
});

describe('list formats the catalog one specialization per line', () => {
  it('prints each name with its tags', () => {
    strict.strictEqual(
      list([
        { name: 'alpha', tags: ['one', 'two'] },
        { name: 'beta', tags: ['three'] },
      ]),
      'alpha: one, two\nbeta: three\n'
    );
  });

  it('prints the bare name for an entry with no tags', () => {
    strict.strictEqual(list([{ name: 'alpha', tags: [] }]), 'alpha\n');
  });

  it('flags a required entry, with or without tags', () => {
    strict.strictEqual(
      list([
        { name: 'regex', tags: ['Regular Expression'], required: true },
        { name: 'alpha', tags: [], required: true },
        { name: 'beta', tags: ['one'], required: false },
      ]),
      'regex: Regular Expression [required]\nalpha [required]\nbeta: one\n'
    );
  });

  it('says so plainly when the catalog is empty', () => {
    strict.strictEqual(
      list([]),
      "No specialization is in this project's catalog.\n"
    );
  });

  it('never repeats a built-in name inside its own tags', () => {
    const repeating = BUILTIN_SPECIALIZATIONS.filter((entry) =>
      entry.tags.includes(entry.name)
    ).map((entry) => entry.name);

    strict.deepStrictEqual(repeating, []);
  });
});
