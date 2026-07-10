import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { describe, it, strict } from 'poku';
import { loadVersion } from '../../../src/core/assets.js';
import {
  migrateInto,
  newWorkspace,
  packageRoot,
  updateInto,
} from './__utils__.js';

const read = (workspace: string, relativePath: string): Promise<string> =>
  readFile(join(workspace, relativePath), 'utf8');

const readJson = async (
  workspace: string,
  relativePath: string
): Promise<Record<string, unknown>> =>
  JSON.parse(await read(workspace, relativePath));

const exists = async (
  workspace: string,
  relativePath: string
): Promise<boolean> => {
  try {
    await stat(join(workspace, relativePath));
    return true;
  } catch {
    return false;
  }
};

const write = async (
  workspace: string,
  relativePath: string,
  contents: string
): Promise<void> => {
  const absolute = join(workspace, relativePath);

  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, contents, 'utf8');
};

const LEGACY_MANIFEST = {
  name: 'blue-spec',
  version: '0.8.0',
  agent: 'claude',
  createdAt: '2026-07-01T04:02:32.212Z',
  files: [
    '.bluespec/templates/charter-template.md',
    '.bluespec/skills/network.md',
    '.claude/skills/bluespec/SKILL.md',
    '.claude/skills/bluespec.charter/SKILL.md',
  ],
  categories: ['owasp'],
};

const LEGACY_GITIGNORE = [
  'node_modules',
  '',
  '# Blue Spec',
  '/.bluespec/templates/',
  '/.bluespec/hooks/',
  '/.bluespec/skills/*',
  '!/.bluespec/skills/my-custom.md',
  '/**/bluespec.*',
  '/**/bluespec/',
  '',
].join('\n');

const seedLegacyInstall = async (
  workspace: string,
  manifest: Record<string, unknown> = LEGACY_MANIFEST
): Promise<void> => {
  await write(
    workspace,
    '.bluespec/manifest.json',
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  await write(
    workspace,
    '.bluespec/tracking.json',
    `${JSON.stringify(
      {
        name: 'blue-spec',
        entries: [
          { name: 'Upload trusts the filename', paths: ['src/upload.js'] },
        ],
      },
      null,
      2
    )}\n`
  );
  await write(
    workspace,
    '.bluespec/skills.json',
    '{ "name": "blue-spec", "entries": [] }\n'
  );
  await write(
    workspace,
    '.bluespec/memory/charter.md',
    [
      '# Charter',
      '',
      'Think of it as the AGENTS.md of Blue Spec: every phase reads it.',
      'Run /bluespec.verify to prove the fixes, tracked in .bluespec/tracking.json.',
      '',
    ].join('\n')
  );
  await write(
    workspace,
    '.bluespec/skills/my-custom.md',
    'Import with @.bluespec/skills/my-custom.md when needed.\n'
  );
  await write(
    workspace,
    '.claude/skills/bluespec/SKILL.md',
    'legacy root command\n'
  );
  await write(
    workspace,
    '.claude/skills/bluespec.charter/SKILL.md',
    'legacy charter command\n'
  );
  await write(workspace, '.gitignore', LEGACY_GITIGNORE);
};

await describe('migrate renames a legacy .bluespec/ install to Lagune', async () => {
  await it('renames the state directory, leaving no legacy directory behind', async () => {
    const workspace = await newWorkspace();
    await seedLegacyInstall(workspace);

    await migrateInto(workspace);

    strict(
      await exists(workspace, '.lagune/manifest.json'),
      'the state now lives in .lagune/'
    );
    strict(
      !(await exists(workspace, '.bluespec')),
      'the legacy directory is gone'
    );
  });

  await it('rewrites the manifest identity and restamps the version', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    const manifest = await readJson(workspace, '.lagune/manifest.json');
    const files = manifest.files as string[];

    strict.strictEqual(manifest.name, 'lagune', 'the manifest is renamed');
    strict.strictEqual(
      manifest.version,
      await loadVersion(packageRoot),
      'the version is restamped to the installed package'
    );
    strict.strictEqual(
      manifest.createdAt,
      LEGACY_MANIFEST.createdAt,
      'the original createdAt is preserved'
    );
    strict.strictEqual(manifest.agent, 'claude', 'the agent is preserved');
    strict.deepStrictEqual(
      manifest.categories,
      ['owasp'],
      'the categories are preserved'
    );
    strict(
      files.includes('.lagune/templates/charter-template.md'),
      'a state path is remapped'
    );
    strict(
      files.includes('.claude/skills/lagune.charter/SKILL.md'),
      'an agent command path is remapped'
    );
    strict(
      files.every((file) => !file.includes('bluespec')),
      'no legacy path survives in the manifest'
    );
  });

  await it('keeps the tracking entries, changing only the map name', async () => {
    const workspace = await newWorkspace();
    await seedLegacyInstall(workspace);

    await migrateInto(workspace);

    const tracking = await readJson(workspace, '.lagune/tracking.json');

    strict.strictEqual(tracking.name, 'lagune', 'the map is renamed');
    strict.deepStrictEqual(
      tracking.entries,
      [{ name: 'Upload trusts the filename', paths: ['src/upload.js'] }],
      'the tracked findings and their user paths are untouched'
    );
  });

  await it('rewrites the old name inside the memory artifacts', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    const charter = await read(workspace, '.lagune/memory/charter.md');

    strict(charter.includes('AGENTS.md of Lagune'), 'prose is renamed');
    strict(charter.includes('/lagune.verify'), 'a command mention is renamed');
    strict(
      charter.includes('.lagune/tracking.json'),
      'a state path mention is renamed'
    );
    strict(!charter.toLowerCase().includes('blue'), 'no old name survives');
  });

  await it('preserves a user sub-skill, rewriting its old-name mention', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    strict.strictEqual(
      await read(workspace, '.lagune/skills/my-custom.md'),
      'Import with @.lagune/skills/my-custom.md when needed.\n',
      'the user sub-skill survives with its import mention renamed'
    );
  });

  await it('replaces the legacy agent commands with the new ones', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    strict(
      !(await exists(workspace, '.claude/skills/bluespec')),
      'the legacy root command is removed'
    );
    strict(
      !(await exists(workspace, '.claude/skills/bluespec.charter')),
      'a legacy phase command is removed'
    );
    strict(
      await exists(workspace, '.claude/skills/lagune/SKILL.md'),
      'the new root command is written'
    );
    strict(
      await exists(workspace, '.claude/skills/lagune.charter/SKILL.md'),
      'a new phase command is written'
    );
  });

  await it('removes a legacy flat-file command for a TOML agent', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace, {
      ...LEGACY_MANIFEST,
      agent: 'gemini',
      files: ['.gemini/commands/bluespec.charter.toml'],
    });
    await write(
      workspace,
      '.gemini/commands/bluespec.charter.toml',
      'description = "legacy"\n'
    );
    await migrateInto(workspace);

    strict(
      !(await exists(workspace, '.gemini/commands/bluespec.charter.toml')),
      'the legacy TOML command is removed'
    );
    strict(
      await exists(workspace, '.gemini/commands/lagune.charter.toml'),
      'the new TOML command is written'
    );
  });

  await it('migrates the .gitignore block and backfills missing entries', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    const gitignore = await read(workspace, '.gitignore');

    strict(gitignore.startsWith('node_modules\n'), 'user content survives');
    strict(gitignore.includes('# Lagune'), 'the section header is renamed');
    strict(
      gitignore.includes('!/.lagune/skills/my-custom.md'),
      'a user sub-skill re-include survives the rename'
    );
    strict(gitignore.includes('/**/lagune.*'), 'a wildcard entry is renamed');
    strict(
      gitignore.includes('/.lagune/proofs/'),
      'an entry the legacy block lacked is backfilled'
    );
    strict(
      !gitignore.includes('bluespec') && !gitignore.includes('Blue Spec'),
      'no legacy line survives'
    );
  });

  await it('never removes a user file recorded in the legacy manifest', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace, {
      ...LEGACY_MANIFEST,
      files: [...LEGACY_MANIFEST.files, 'docs/security.md'],
    });
    await write(workspace, 'docs/security.md', 'user notes\n');
    await migrateInto(workspace);

    strict.strictEqual(
      await read(workspace, 'docs/security.md'),
      'user notes\n',
      'a path that does not carry the legacy name is never touched'
    );
  });

  await it('skips an agent the registry no longer knows', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace, {
      ...LEGACY_MANIFEST,
      agent: ['claude', 'ghost-agent'],
    });
    await migrateInto(workspace);

    strict(
      await exists(workspace, '.claude/skills/lagune.charter/SKILL.md'),
      'the known agent is still migrated'
    );
    strict.deepStrictEqual(
      (await readJson(workspace, '.lagune/manifest.json')).agent,
      ['claude', 'ghost-agent'],
      'the manifest agent record is preserved as the user had it'
    );
  });

  await it('migrates an install that lost its manifest', async () => {
    const workspace = await newWorkspace();

    await write(workspace, '.bluespec/memory/detect.md', '# Detect\n');
    await migrateInto(workspace);

    strict(
      !(await exists(workspace, '.bluespec')),
      'the legacy directory is renamed'
    );
    strict(
      await exists(workspace, '.lagune/templates/charter-template.md'),
      'the shared material is rebuilt'
    );
  });
});

await describe('migrate refuses ambiguous or unnecessary runs', async () => {
  await it('is a no-op when the project already runs on Lagune', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    const afterFirst = await read(workspace, '.lagune/manifest.json');

    await migrateInto(workspace);

    strict.strictEqual(
      await read(workspace, '.lagune/manifest.json'),
      afterFirst,
      'a second run changes nothing'
    );
  });

  await it('does nothing in a project that was never initialized', async () => {
    const workspace = await newWorkspace();

    await migrateInto(workspace);

    strict(
      !(await exists(workspace, '.lagune')),
      'no state is created out of nowhere'
    );
  });

  await it('changes nothing when both directories exist', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await write(workspace, '.lagune/manifest.json', '{ "name": "lagune" }\n');
    await migrateInto(workspace);

    const legacyManifest = await readJson(workspace, '.bluespec/manifest.json');

    strict.strictEqual(
      legacyManifest.name,
      'blue-spec',
      'the legacy state is untouched'
    );
    strict(
      await exists(workspace, '.claude/skills/bluespec.charter/SKILL.md'),
      'the legacy commands are untouched'
    );
    strict.strictEqual(
      await read(workspace, '.gitignore'),
      LEGACY_GITIGNORE,
      'the .gitignore is untouched'
    );
  });
});

await describe('a migrated install stays compatible with the flow', async () => {
  await it('update refreshes a migrated install in place', async () => {
    const workspace = await newWorkspace();

    await seedLegacyInstall(workspace);
    await migrateInto(workspace);

    const shipped = await read(
      workspace,
      '.claude/skills/lagune.charter/SKILL.md'
    );

    await write(
      workspace,
      '.claude/skills/lagune.charter/SKILL.md',
      'user edited this'
    );
    await updateInto(workspace);

    strict.strictEqual(
      await read(workspace, '.claude/skills/lagune.charter/SKILL.md'),
      shipped,
      'update restores the managed command after a migration'
    );
  });
});
