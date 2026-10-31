import type { ExtraFile, ReleaseConfig } from '../../../src/types/test.js';
import { readFile, stat } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { describe, it, strict } from 'poku';
import { isRecord } from '../../../src/core/collections.js';
import { loadVersion } from '../../../src/core/version.js';
import {
  packageRoot,
  readManifests,
  repositoryRoot,
  YAML_FILE,
} from './__utils__.js';

const PLUGIN_NAME = 'lagune';
const SKILLS_FOLDER = './skills/';
const VERSION_FIELD = '$.version';

const version = await loadVersion(packageRoot);
const manifests = await readManifests();
const config: ReleaseConfig = JSON.parse(
  await readFile(new URL('.github/release/config.json', packageRoot), 'utf8')
);
const extraFiles = Object.values(config.packages).flatMap(
  (entry) => entry['extra-files'] ?? []
);
const versioned = manifests.filter(
  ({ contents }) => contents !== undefined && 'version' in contents
);
const skillsRoot = join(repositoryRoot, 'skills');

const listedNames = (plugins: unknown): unknown[] =>
  Array.isArray(plugins)
    ? plugins.map((entry) => (isRecord(entry) ? entry.name : undefined))
    : [];

const movesVersionOf = (file: ExtraFile, path: string): boolean =>
  file.path === path &&
  file.type === (YAML_FILE.test(path) ? 'yaml' : 'json') &&
  file.jsonpath === VERSION_FIELD;

const targetOf = (entry: unknown): string => {
  if (typeof entry === 'string') return entry;
  if (isRecord(entry) && typeof entry.path === 'string') return entry.path;

  return '';
};

const skillTargets = (skills: unknown): string[] =>
  Array.isArray(skills) ? skills.map(targetOf) : [];

const isPublishedSkill = async (target: string): Promise<boolean> => {
  const location = relative(skillsRoot, resolve(repositoryRoot, target));

  if (location === '' || location.startsWith('..') || isAbsolute(location))
    return false;

  return stat(join(skillsRoot, location)).then(
    () => true,
    () => false
  );
};

await describe('every plugin manifest', async () => {
  for (const { path, contents } of manifests) {
    it(`${path} parses into an object`, () => {
      strict(contents !== undefined);
    });

    if (contents === undefined) continue;

    it(`${path} names the plugin lagune`, () => {
      strict.strictEqual(contents.name, PLUGIN_NAME);
    });

    if ('plugins' in contents)
      it(`${path} lists the lagune plugin alone`, () => {
        strict.deepStrictEqual(listedNames(contents.plugins), [PLUGIN_NAME]);
      });

    if ('version' in contents)
      it(`${path} carries the package version, which the release moves`, () => {
        const moved = extraFiles.some((file) => movesVersionOf(file, path));

        strict.strictEqual(contents.version, version);
        strict(moved, 'the release config moves its version');
      });

    if (typeof contents.skills === 'string')
      it(`${path} points at the published skills`, () => {
        strict.strictEqual(contents.skills, SKILLS_FOLDER);
      });

    if ('skills' in contents && typeof contents.skills !== 'string')
      await it(`${path} lists only published skills`, async () => {
        const targets = skillTargets(contents.skills);
        const published = await Promise.all(targets.map(isPublishedSkill));

        strict(targets.length > 0, 'it lists at least one skill');
        strict.deepStrictEqual(
          targets.filter((_target, index) => !published[index]),
          []
        );
      });
  }
});

describe('the release config', () => {
  it('moves only the versions the plugin manifests carry', () => {
    strict.deepStrictEqual(
      extraFiles
        .map((file) => file.path)
        .filter(
          (path) => !versioned.some((manifest) => manifest.path === path)
        ),
      []
    );
  });
});
