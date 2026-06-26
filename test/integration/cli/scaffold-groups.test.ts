import type { ScaffoldGroup, ScaffoldResult } from '../../../src/types/core.js';
import { describe, it, strict } from 'poku';
import { groupScaffoldOutcomes } from '../../../src/core/scaffold-groups.js';

const result = (created: string[], skipped: string[] = []): ScaffoldResult => ({
  created,
  skipped,
  manifestPath: '.bluespec/manifest.json',
});

const group = (created: string[], skipped: string[] = []): ScaffoldGroup[] =>
  groupScaffoldOutcomes(result(created, skipped), 'Claude Code');

describe('grouping scaffold outcomes into categories', () => {
  it('buckets each .bluespec path under its own category', () => {
    const groups = group([
      '.bluespec/templates/charter-template.md',
      '.bluespec/hooks/track.mjs',
      '.bluespec/skills/regex.md',
      '.bluespec/tracking.json',
    ]);

    strict.deepStrictEqual(
      groups.map((entry) => entry.label),
      ['Templates', 'Hooks', 'Sub-skills', 'State']
    );
  });

  it('keeps the State bucket to top-level .bluespec files, not nested ones', () => {
    const groups = group([
      '.bluespec/skills.json',
      '.bluespec/skills/network.md',
    ]);
    const state = groups.find((entry) => entry.label === 'State');
    const subSkills = groups.find((entry) => entry.label === 'Sub-skills');

    strict.deepStrictEqual(
      state?.outcomes.map((outcome) => outcome.path),
      ['.bluespec/skills.json']
    );
    strict.deepStrictEqual(
      subSkills?.outcomes.map((outcome) => outcome.path),
      ['.bluespec/skills/network.md']
    );
  });

  it('labels the non-Blue-Spec bucket with the agent name', () => {
    const groups = groupScaffoldOutcomes(
      result([
        '.claude/skills/bluespec.charter/SKILL.md',
        '.claude/skills/bluespec.detect/SKILL.md',
      ]),
      'Claude Code'
    );
    const agent = groups.find((entry) => entry.label === 'Claude Code');

    strict.strictEqual(agent?.baseDir, '.claude/skills/');
    strict.strictEqual(agent?.outcomes.length, 2);
    strict(
      !groups.some((entry) => entry.label === 'Agent commands'),
      'the bucket is named after the agent, not generic'
    );
  });

  it('derives the agent baseDir as the shared directory of its files', () => {
    const groups = group(['.opencode/commands/bluespec.charter.md']);
    const agent = groups.find((entry) => entry.label === 'Claude Code');

    strict.strictEqual(agent?.baseDir, '.opencode/commands/');
  });

  it('carries the created or skipped status onto each outcome', () => {
    const groups = group(
      ['.bluespec/templates/charter-template.md'],
      ['.bluespec/templates/detect-template.md']
    );
    const templates = groups.find((entry) => entry.label === 'Templates');

    strict.deepStrictEqual(
      templates?.outcomes.map((outcome) => outcome.status),
      ['created', 'skipped']
    );
  });

  it('drops categories that have no outcomes', () => {
    const groups = group(['.bluespec/hooks/regex.mjs']);

    strict.deepStrictEqual(
      groups.map((entry) => entry.label),
      ['Hooks']
    );
  });
});
