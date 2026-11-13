import type { CheckersConfig } from '../../../src/types/checkers.js';
import { describe, it, strict } from 'poku';
import {
  checkersPayload,
  configOf,
  scopeChanges,
  sweepsEverything,
  withGit,
  withListChoice,
  withPaths,
} from '../../../src/dashboard/client/domain/hook-settings.js';

const sharedDist: CheckersConfig = configOf({
  shared: { ignore: ['dist'] },
  own: [],
  problem: null,
});

describe('the dashboard edits the hook settings by the rules the engine records them with', () => {
  it('starts a hook given its own list from the shared one, as write add --ignore does', () => {
    const own = withListChoice(sharedDist, 'secrets', 'own');
    const edited = withPaths(own, 'secrets', ['dist', 'vendor']);

    strict.deepStrictEqual(checkersPayload(edited), {
      checkers: Object.assign(Object.create(null), {
        ignore: ['dist'],
        secrets: { ignore: ['dist', 'vendor'] },
      }),
    });
  });

  it('leaves nothing of a hook in the record once each setting follows every hook again', () => {
    const custom = configOf({
      shared: Object.create(null),
      own: [['secrets', { gitignore: false, ignore: ['vendor'] }]],
      problem: null,
    });
    const followsGit = withGit(custom, 'secrets', 'shared');
    const followsAll = withListChoice(followsGit, 'secrets', 'shared');

    strict.deepStrictEqual(checkersPayload(followsAll), {
      checkers: Object.create(null),
    });
  });

  it('keeps the shared defaults out of the record once chosen back', () => {
    const empty = configOf({
      shared: Object.create(null),
      own: [],
      problem: null,
    });
    const scanned = withGit(empty, undefined, 'scan');
    const skipped = withGit(scanned, undefined, 'skip');
    const listed = withPaths(skipped, undefined, ['dist']);
    const cleared = withPaths(listed, undefined, []);

    strict.deepStrictEqual(checkersPayload(scanned), {
      checkers: Object.assign(Object.create(null), { gitignore: false }),
    });
    strict.deepStrictEqual(checkersPayload(cleared), {
      checkers: Object.create(null),
    });
  });

  it('keeps an empty list of a hook its own, so it leaves out nothing', () => {
    const own = withListChoice(sharedDist, 'regex', 'own');
    const emptied = withPaths(own, 'regex', []);

    strict.deepStrictEqual(checkersPayload(emptied), {
      checkers: Object.assign(Object.create(null), {
        ignore: ['dist'],
        regex: { ignore: [] },
      }),
    });
  });
});

describe('the record summary names only what the user changed, in the words of the editor', () => {
  it('lists a change to every hook once, not again on each hook that inherits it', () => {
    const shared = withPaths(sharedDist, undefined, ['dist', 'vendor']);

    strict.deepStrictEqual(scopeChanges(sharedDist, shared), [
      {
        scope: undefined,
        gitignore: null,
        list: null,
        added: ['vendor'],
        removed: [],
      },
    ]);
  });

  it('lists a hook that takes a list of its own, with the paths it adds to what it inherited', () => {
    const own = withListChoice(sharedDist, 'secrets', 'own');
    const edited = withPaths(own, 'secrets', ['dist', 'temp']);

    strict.deepStrictEqual(scopeChanges(sharedDist, edited), [
      {
        scope: 'secrets',
        gitignore: null,
        list: { from: 'Inherit', to: 'Custom' },
        added: ['temp'],
        removed: [],
      },
    ]);
  });

  it('lists a hook that inherits again, with the paths it no longer ignores', () => {
    const custom = configOf({
      shared: { ignore: ['dist'] },
      own: [['regex', { gitignore: false, ignore: ['dist', 'fixtures'] }]],
      problem: null,
    });
    const inherits = withListChoice(
      withGit(custom, 'regex', 'shared'),
      'regex',
      'shared'
    );

    strict.deepStrictEqual(scopeChanges(custom, inherits), [
      {
        scope: 'regex',
        gitignore: { from: 'No', to: 'Inherit' },
        list: { from: 'Custom', to: 'Inherit' },
        added: [],
        removed: ['fixtures'],
      },
    ]);
  });

  it('lists nothing when every scope ends as it started', () => {
    const scanned = withGit(sharedDist, 'jwt', 'scan');
    const back = withGit(scanned, 'jwt', 'shared');

    strict.deepStrictEqual(scopeChanges(sharedDist, back), []);
  });
});

describe('the dashboard warns on a pattern that leaves out almost everything', () => {
  for (const [pattern, sweeps] of [
    ['*', true],
    ['**', true],
    ['**/*', true],
    ['dist/*', false],
    ['*.log', false],
    ['**/dist', false],
  ] as const)
    it(`${sweeps ? 'warns on' : 'stays quiet on'} ${pattern}`, () => {
      strict.strictEqual(sweepsEverything(pattern), sweeps);
    });
});
