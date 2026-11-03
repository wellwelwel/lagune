import type { Site } from '../../../tools/i18n/site.js';
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it, strict } from 'poku';
import { runTool } from '../../../tools/i18n/tool.js';

const ENGLISH_PAGE = `---
id: intro
title: Intro
---

Run \`npx lagune read catalog\`.
`;

const OUTSIDE_TEXT = 'outside the locale folder\n';

const folders: string[] = [];

const temporaryFolder = async (prefix: string): Promise<string> => {
  const folder = await mkdtemp(join(tmpdir(), prefix));

  folders.push(folder);

  return folder;
};

const createSite = async (): Promise<Site> => {
  const root = await temporaryFolder('lagune-i18n-site-');

  await mkdir(join(root, 'docs'), { recursive: true });
  await mkdir(join(root, 'src'), { recursive: true });
  await mkdir(join(root, 'i18n'), { recursive: true });
  await writeFile(join(root, 'docs', 'intro.mdx'), ENGLISH_PAGE, 'utf8');

  return { root };
};

const filesUnder = async (folder: string): Promise<string[]> =>
  (await readdir(folder, { recursive: true })).sort();

afterEach(async () => {
  await Promise.all(
    folders
      .splice(0)
      .map((folder) => rm(folder, { recursive: true, force: true }))
  );
});

const hostileLocales = [
  '../../etc',
  '/etc',
  'pt-BR/../../outside',
  'pt-BR\0',
  'en',
  'fr',
];

const hostileDocIds = [
  '../../../package',
  '/etc/passwd',
  'intro/../../../../outside',
  '..%2f..%2foutside',
  'intro\0',
  'missing',
];

await describe('the i18n tool keeps every write inside the locale folder', async () => {
  for (const locale of hostileLocales)
    await it(`refuses the locale ${JSON.stringify(locale)}`, async () => {
      const site = await createSite();
      const result = await runTool(['add', locale], site);
      const written = await filesUnder(join(site.root, 'i18n'));

      strict.strictEqual(result.code, 1);
      strict.deepStrictEqual(written, []);
    });

  for (const docId of hostileDocIds)
    await it(`refuses the doc id ${JSON.stringify(docId)}`, async () => {
      const site = await createSite();
      const result = await runTool(['copy', 'pt-BR', docId], site);
      const written = await filesUnder(join(site.root, 'i18n'));

      strict.strictEqual(result.code, 1);
      strict.deepStrictEqual(written, []);
    });

  await it('refuses a locale folder linked outside the site', async () => {
    const site = await createSite();
    const outside = await temporaryFolder('lagune-i18n-outside-');

    await mkdir(join(site.root, 'i18n', 'pt-BR'));
    await symlink(
      outside,
      join(site.root, 'i18n', 'pt-BR', 'lagune-docs-content')
    );

    const result = await runTool(['copy', 'pt-BR', 'intro'], site);
    const written = await filesUnder(outside);

    strict.strictEqual(result.code, 1);
    strict.deepStrictEqual(written, []);
  });

  await it('refuses a translation linked to a file outside the site', async () => {
    const site = await createSite();
    const outside = await temporaryFolder('lagune-i18n-outside-');
    const target = join(outside, 'target.mdx');
    const contentFolder = join(
      site.root,
      'i18n',
      'pt-BR',
      'lagune-docs-content'
    );

    await writeFile(target, OUTSIDE_TEXT, 'utf8');
    await mkdir(contentFolder, { recursive: true });
    await symlink(target, join(contentFolder, 'intro.mdx'));

    const result = await runTool(['stamp', 'pt-BR', 'intro'], site);
    const text = await readFile(target, 'utf8');

    strict.strictEqual(result.code, 1);
    strict.strictEqual(text, OUTSIDE_TEXT);
  });

  await it('writes a copied page inside the locale folder', async () => {
    const site = await createSite();
    const result = await runTool(['copy', 'pt-BR', 'intro'], site);
    const written = await filesUnder(join(site.root, 'i18n'));

    strict.strictEqual(result.code, 0);
    strict.deepStrictEqual(written, [
      'pt-BR',
      join('pt-BR', 'lagune-docs-content'),
      join('pt-BR', 'lagune-docs-content', 'intro.mdx'),
    ]);
  });
});

await describe('the i18n check', async () => {
  await it('fails on a translation that changes code from its English source', async () => {
    const site = await createSite();
    const contentFolder = join(
      site.root,
      'i18n',
      'pt-BR',
      'lagune-docs-content'
    );

    await runTool(['copy', 'pt-BR', 'intro'], site);

    const copied = await readFile(join(contentFolder, 'intro.mdx'), 'utf8');

    await writeFile(
      join(contentFolder, 'intro.mdx'),
      copied.replace('npx lagune read catalog', 'npx lagunee read catalog'),
      'utf8'
    );

    const result = await runTool(['check', 'pt-BR'], site);
    const errors = result.stdout
      .split('\n')
      .filter((line) => line.startsWith('error intro:'));

    strict.strictEqual(result.code, 1);
    strict.deepStrictEqual(errors, [
      'error intro: inline code 1 changes `npx lagune read catalog`, which stays exactly as in English',
    ]);
  });
});
