import type { PluginManifest, TrackedFile } from '../../../src/types/test.js';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse } from 'yaml.min';
import { isRecord } from '../../../src/core/collections.js';

export const packageRoot = new URL('../../../', import.meta.url);
export const repositoryRoot = fileURLToPath(packageRoot);
export const YAML_FILE = /\.ya?ml$/;

const MANIFEST_FILE =
  /^(?:\.[a-z]+-plugin\/[^/]+\.(?:json|ya?ml)|[a-z]+-extension\.json|\.agents\/plugins\/marketplace\.json)$/;

const run = promisify(execFile);

/** Every file git tracks, the tree a harness installs, with its mode */
export const listTracked = async (): Promise<TrackedFile[]> => {
  const { stdout } = await run('git', ['ls-files', '-z', '--stage'], {
    cwd: repositoryRoot,
  });

  return stdout
    .split('\0')
    .filter((record) => record.length > 0)
    .map((record) => ({
      mode: record.slice(0, record.indexOf(' ')),
      path: record.slice(record.indexOf('\t') + 1),
    }));
};

const parseManifest = (path: string, text: string): unknown => {
  try {
    return YAML_FILE.test(path) ? parse<unknown>(text) : JSON.parse(text);
  } catch {
    return undefined;
  }
};

export const readManifest = async (path: string): Promise<PluginManifest> => {
  const contents = parseManifest(
    path,
    await readFile(new URL(path, packageRoot), 'utf8')
  );

  return { path, contents: isRecord(contents) ? contents : undefined };
};

export const readManifests = async (): Promise<PluginManifest[]> =>
  Promise.all(
    (await listTracked())
      .map(({ path }) => path)
      .filter((path) => MANIFEST_FILE.test(path))
      .map(readManifest)
  );
