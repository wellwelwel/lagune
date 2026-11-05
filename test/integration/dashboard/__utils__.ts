import type { ActionResult } from '../../../src/types/dashboard/server.js';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach } from 'poku';
import { ACTIONS } from '../../../src/dashboard/server/actions.js';

const packageRoot = new URL('../../../', import.meta.url);
const projects: string[] = [];

export const newProject = async (configs?: string): Promise<string> => {
  const project = await mkdtemp(join(tmpdir(), 'lagune-action-'));

  projects.push(project);

  if (configs === undefined) return project;

  await mkdir(join(project, '.lagune'), { recursive: true });
  await writeFile(join(project, '.lagune/configs.json'), configs);

  return project;
};

/** Runs the dashboard action served at a path, as the server does once a request passes its guards */
export const runAction = (
  path: string,
  project: string,
  body: unknown
): Promise<ActionResult> => {
  const handler = ACTIONS.get(path);

  if (handler === undefined) throw new Error(`no action is served at ${path}`);

  return handler(body, { cwd: project, packageRoot });
};

export const recorded = (project: string): Promise<string | null> =>
  readFile(join(project, '.lagune/configs.json'), 'utf8').catch(() => null);

afterEach(async () => {
  await Promise.all(
    projects.map((project) => rm(project, { recursive: true, force: true }))
  );

  projects.length = 0;
});
