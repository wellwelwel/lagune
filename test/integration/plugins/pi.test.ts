import { join, resolve } from 'node:path';
import { describe, it, strict } from 'poku';
import { isRecord, isStringArray } from '../../../src/core/collections.js';
import { readManifest, repositoryRoot } from './__utils__.js';

const GALLERY_KEYWORD = 'pi-package';
const RESOURCE_TYPES = ['extensions', 'skills', 'prompts', 'themes'];

const { contents = {} } = await readManifest('package.json');
const manifest = isRecord(contents.pi) ? contents.pi : {};
const skillPaths = isStringArray(manifest.skills) ? manifest.skills : [];
const skillsRoot = join(repositoryRoot, 'skills');

describe('the Pi package', () => {
  it('is listed in the Pi gallery, which indexes npm packages by keyword', () => {
    strict(
      isStringArray(contents.keywords) &&
        contents.keywords.includes(GALLERY_KEYWORD),
      `its keywords hold ${GALLERY_KEYWORD}`
    );
  });

  it('loads only the published skills, with no extension, prompt template, or theme', () => {
    strict.deepStrictEqual(
      RESOURCE_TYPES.filter((type) => type in manifest),
      ['skills']
    );
  });

  it('points at the published skills in the array form Pi reads, the only form that loads them', () => {
    strict(skillPaths.length > 0, 'the skills are a list of paths');
    strict.deepStrictEqual(
      skillPaths.filter((path) => resolve(repositoryRoot, path) !== skillsRoot),
      []
    );
  });
});
