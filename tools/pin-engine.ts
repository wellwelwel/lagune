import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import process, { argv } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ENGINE_CALL = /npx --yes lagune(?:@[\w.+-]+)?(?= )/g;
const PINNED_FOLDERS = ['skills', 'catalog'];
const REPOSITORY_ROOT = fileURLToPath(new URL('../', import.meta.url));

export const pinEngine = (text: string, version: string): string =>
  text.replace(ENGINE_CALL, `npx --yes lagune@${version}`);

const readVersion = async (): Promise<string> => {
  const manifest: { version?: unknown } = JSON.parse(
    await readFile(join(REPOSITORY_ROOT, 'package.json'), 'utf8')
  );

  if (typeof manifest.version !== 'string')
    throw new Error('package.json carries no version to pin the engine at.');

  return manifest.version;
};

const listPinnedFiles = async (): Promise<string[]> => {
  const folders = await Promise.all(
    PINNED_FOLDERS.map(async (folder) =>
      (await readdir(join(REPOSITORY_ROOT, folder), { recursive: true }))
        .filter((file) => file.endsWith('.md'))
        .map((file) => join(REPOSITORY_ROOT, folder, file))
    )
  );

  return folders.flat();
};

const pinFile = async (file: string, version: string): Promise<boolean> => {
  const text = await readFile(file, 'utf8');
  const pinned = pinEngine(text, version);

  if (pinned === text) return false;

  await writeFile(file, pinned);

  return true;
};

const run = async () => {
  const [version, files] = await Promise.all([
    readVersion(),
    listPinnedFiles(),
  ]);
  const pinned = await Promise.all(files.map((file) => pinFile(file, version)));

  console.log(
    `Pinned the engine at ${version} in ${pinned.filter(Boolean).length} files.`
  );
};

if (import.meta.url === pathToFileURL(argv[1] ?? '').href)
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
