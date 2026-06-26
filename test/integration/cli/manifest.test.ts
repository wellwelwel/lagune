import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, strict } from 'poku';
import {
  applyManifestChange,
  readManifestCategories,
} from '../../../src/core/manifest.js';

const withWorkspace = async (
  fn: (workspace: string) => Promise<void>
): Promise<void> => {
  const workspace = await mkdtemp(join(tmpdir(), 'blue-spec-manifest-'));

  try {
    await fn(workspace);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
};

const readManifest = async (
  workspace: string
): Promise<Record<string, unknown>> =>
  JSON.parse(
    await readFile(join(workspace, '.bluespec/manifest.json'), 'utf8')
  );

const writeManifest = async (
  workspace: string,
  contents: string
): Promise<void> => {
  await mkdir(join(workspace, '.bluespec'), { recursive: true });
  await writeFile(join(workspace, '.bluespec/manifest.json'), contents, 'utf8');
};

await describe('readManifestCategories', async () => {
  await it('returns [] when the manifest is absent', async () => {
    await withWorkspace(async (workspace) => {
      strict.deepStrictEqual(await readManifestCategories(workspace), []);
    });
  });

  await it('returns [] when the manifest is malformed JSON', async () => {
    await withWorkspace(async (workspace) => {
      await writeManifest(workspace, 'not json{');

      strict.deepStrictEqual(await readManifestCategories(workspace), []);
    });
  });

  await it('returns [] when categories is missing', async () => {
    await withWorkspace(async (workspace) => {
      await writeManifest(
        workspace,
        JSON.stringify({ name: 'blue-spec', files: [] })
      );

      strict.deepStrictEqual(await readManifestCategories(workspace), []);
    });
  });

  await it('returns [] when categories is not a string array', async () => {
    await withWorkspace(async (workspace) => {
      await writeManifest(
        workspace,
        JSON.stringify({ name: 'blue-spec', categories: [1, 2, 3] })
      );

      strict.deepStrictEqual(await readManifestCategories(workspace), []);
    });
  });

  await it('returns the categories array when present', async () => {
    await withWorkspace(async (workspace) => {
      await writeManifest(
        workspace,
        JSON.stringify({ name: 'blue-spec', categories: ['owasp'] })
      );

      strict.deepStrictEqual(await readManifestCategories(workspace), [
        'owasp',
      ]);
    });
  });
});

await describe('applyManifestChange', async () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  await it('creates a minimal manifest when none exists', async () => {
    await withWorkspace(async (workspace) => {
      await applyManifestChange(
        workspace,
        {
          categories: ['owasp'],
          addFiles: [
            '.bluespec/skills/regex.md',
            '.bluespec/skills/network.md',
          ],
          removeFiles: [],
        },
        { version: '9.9.9', now }
      );

      const manifest = await readManifest(workspace);

      strict.strictEqual(manifest.name, 'blue-spec');
      strict.strictEqual(manifest.version, '9.9.9');
      strict.strictEqual(manifest.agent, '');
      strict.strictEqual(manifest.createdAt, '2026-01-01T00:00:00.000Z');
      strict.deepStrictEqual(manifest.categories, ['owasp']);
      strict.deepStrictEqual(manifest.files, [
        '.bluespec/skills/regex.md',
        '.bluespec/skills/network.md',
      ]);
    });
  });

  await it('preserves other fields when the manifest exists', async () => {
    await withWorkspace(async (workspace) => {
      await writeManifest(
        workspace,
        JSON.stringify({
          name: 'blue-spec',
          version: '1.0.0',
          agent: 'claude',
          createdAt: '2020-01-01T00:00:00.000Z',
          files: ['.bluespec/templates/x.md', '.bluespec/skills/regex.md'],
          categories: ['owasp'],
        })
      );

      await applyManifestChange(
        workspace,
        {
          categories: [],
          addFiles: [],
          removeFiles: ['.bluespec/skills/regex.md'],
        },
        { version: '9.9.9', now }
      );

      const manifest = await readManifest(workspace);

      strict.strictEqual(manifest.agent, 'claude');
      strict.strictEqual(manifest.version, '1.0.0');
      strict.strictEqual(manifest.createdAt, '2020-01-01T00:00:00.000Z');
      strict.deepStrictEqual(manifest.categories, []);
      strict.deepStrictEqual(manifest.files, ['.bluespec/templates/x.md']);
    });
  });

  await it('merges addFiles without duplicating', async () => {
    await withWorkspace(async (workspace) => {
      await writeManifest(
        workspace,
        JSON.stringify({
          name: 'blue-spec',
          version: '1.0.0',
          agent: 'claude',
          createdAt: '2020-01-01T00:00:00.000Z',
          files: ['.bluespec/skills/regex.md'],
          categories: ['owasp'],
        })
      );

      await applyManifestChange(
        workspace,
        {
          categories: ['owasp'],
          addFiles: [
            '.bluespec/skills/regex.md',
            '.bluespec/skills/network.md',
          ],
          removeFiles: [],
        },
        { version: '9.9.9', now }
      );

      const manifest = await readManifest(workspace);

      strict.deepStrictEqual(manifest.files, [
        '.bluespec/skills/regex.md',
        '.bluespec/skills/network.md',
      ]);
    });
  });
});
