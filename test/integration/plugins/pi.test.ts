import type { PiTool } from '../../../src/types/pi.js';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, it, strict } from 'poku';
import { isRecord, isStringArray } from '../../../src/core/collections.js';
import {
  newProject,
  readCategories,
  readManifest,
  repositoryRoot,
} from './__utils__.js';

const GALLERY_KEYWORD = 'pi-package';
const RESOURCE_TYPES = ['extensions', 'skills', 'prompts', 'themes'];
const ENGINE_TOOLS = ['lagune_read', 'lagune_write'];
const ADD_PYTHON = { command: 'add', arguments: ['--categories', 'python'] };

const { contents = {} } = await readManifest('package.json');
const manifest = isRecord(contents.pi) ? contents.pi : {};
const skillPaths = isStringArray(manifest.skills) ? manifest.skills : [];
const extensionPaths = isStringArray(manifest.extensions)
  ? manifest.extensions
  : [];
const skillsRoot = join(repositoryRoot, 'skills');

/** The tools Pi registers when it loads each extension the manifest names */
const loadTools = async (): Promise<PiTool[]> => {
  const tools: PiTool[] = [];
  const extensions: unknown[] = await Promise.all(
    extensionPaths.map(
      (path) => import(pathToFileURL(resolve(repositoryRoot, path)).href)
    )
  );

  for (const extension of extensions) {
    const load = isRecord(extension) ? extension.default : undefined;

    if (typeof load === 'function')
      load({ registerTool: (tool: PiTool) => tools.push(tool) });
  }

  return tools;
};

const tools = await loadTools();

const toolNamed = (name: string): PiTool | undefined =>
  tools.find((tool) => tool.name === name);

describe('the Pi package', () => {
  it('is listed in the Pi gallery, which indexes npm packages by keyword', () => {
    strict(
      isStringArray(contents.keywords) &&
        contents.keywords.includes(GALLERY_KEYWORD),
      `its keywords hold ${GALLERY_KEYWORD}`
    );
  });

  it('loads the published skills and the engine tools, with no prompt template or theme', () => {
    strict.deepStrictEqual(
      RESOURCE_TYPES.filter((type) => type in manifest),
      ['extensions', 'skills']
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

await describe('the engine tools on Pi', async () => {
  it('registers the two engine tools under the names the skills call', () => {
    strict.deepStrictEqual(
      tools.map(({ name }) => name).toSorted(),
      ENGINE_TOOLS
    );
  });

  await it('runs a call behind its tool prefix, from the folder of the session that made it', async () => {
    const project = await newProject(['javascript']);
    const result = await toolNamed('lagune_write')?.execute(
      'call',
      ADD_PYTHON,
      undefined,
      undefined,
      { cwd: project }
    );
    const categories = await readCategories(project);

    strict.strictEqual(result?.isError, false);
    strict.deepStrictEqual(categories, ['javascript', 'python']);
  });

  await it('reports a command the other tool runs as an error, without running it', async () => {
    const project = await newProject(['javascript']);
    const result = await toolNamed('lagune_read')?.execute(
      'call',
      ADD_PYTHON,
      undefined,
      undefined,
      { cwd: project }
    );
    const categories = await readCategories(project);

    strict.strictEqual(result?.isError, true);
    strict.deepStrictEqual(categories, ['javascript']);
  });
});
