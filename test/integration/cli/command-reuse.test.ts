import type { PlannedCommandWrite } from '../../../src/types/core.js';
import { describe, it, strict } from 'poku';
import { loadAssets } from '../../../src/core/assets.js';
import { planCommandReuse } from '../../../src/core/command-reuse.js';
import { getProviders } from '../../../src/providers/registry.js';

const packageRoot = new URL('../../../', import.meta.url);
const assets = await loadAssets(packageRoot);

const plan = (agentKeys: string[]): PlannedCommandWrite[] =>
  planCommandReuse(getProviders(agentKeys), assets);

const jobsUnder = (
  jobs: PlannedCommandWrite[],
  dir: string
): PlannedCommandWrite[] =>
  jobs.filter((job) => job.relativePath.startsWith(dir));

describe('planning command reuse across agents', () => {
  it('keeps the first installed agent as the owner of the real files', () => {
    const jobs = plan(['claude', 'codex']);

    strict(
      jobsUnder(jobs, '.claude/').every((job) => job.linkTo === undefined),
      'the first agent owns every file it writes'
    );
    strict(
      jobsUnder(jobs, '.codex/').every(
        (job) => job.linkTo?.startsWith('.claude/') === true
      ),
      'the second agent links every command to the first'
    );
  });

  it('ties ownership to install order, not to a default agent', () => {
    const jobs = plan(['codex', 'claude']);

    strict(
      jobsUnder(jobs, '.codex/').every((job) => job.linkTo === undefined),
      'codex owns the files when it comes first'
    );
    strict(
      jobsUnder(jobs, '.claude/').every(
        (job) => job.linkTo?.startsWith('.codex/') === true
      ),
      'claude links to codex when it comes second'
    );
  });

  it('keeps a real file when the rendered contents differ', () => {
    const jobs = plan(['claude', 'gemini']);

    strict(
      jobsUnder(jobs, '.gemini/').every((job) => job.linkTo === undefined),
      'a format that renders differently never links'
    );
  });

  it('links agents of another shared format among themselves', () => {
    const jobs = plan(['claude', 'opencode', 'windsurf']);

    strict(
      jobsUnder(jobs, '.opencode/').every((job) => job.linkTo === undefined),
      'the first markdown agent owns its files'
    );
    strict(
      jobsUnder(jobs, '.windsurf/').every(
        (job) => job.linkTo?.startsWith('.opencode/') === true
      ),
      'the second markdown agent links to the first'
    );
  });

  it('always links to the owner, never to another link', () => {
    const jobs = plan(['claude', 'codex', 'cursor-agent']);

    strict(
      jobsUnder(jobs, '.cursor/').every(
        (job) => job.linkTo?.startsWith('.claude/') === true
      ),
      'a third agent links straight to the first owner'
    );
  });

  it('plans one job per path when agents share a directory', () => {
    const jobs = plan(['warp', 'zed']);
    const paths = jobs.map((job) => job.relativePath);

    strict.strictEqual(
      new Set(paths).size,
      paths.length,
      'a shared directory never produces duplicate jobs'
    );
    strict(
      jobs.every((job) => job.linkTo === undefined),
      'a shared directory leaves nothing to link'
    );
  });
});
