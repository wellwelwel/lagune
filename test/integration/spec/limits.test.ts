import type { SpecLimits, SpecMeasurement } from '../../../src/types/test.js';
import { describe, it, strict } from 'poku';
import {
  findViolations,
  measureClaudeMd,
  measureSkills,
  measureSpecs,
} from './__utils__.js';

const SKILL_LIMITS: SpecLimits = {
  nameChars: 24,
  descriptionChars: 256,
  tokens: 8_000,
  lines: 250,
};

const assertWithinLimits = (measurement: SpecMeasurement) => {
  const violations = findViolations(measurement, SKILL_LIMITS);
  const report = violations
    .map(
      (violation) =>
        `${violation.limit} ${violation.actual} exceeds ${violation.max}`
    )
    .join(', ');

  strict.strictEqual(
    violations.length,
    0,
    `${measurement.relativePath} should stay within Skill limits (${report})`
  );
};

await describe('specs stay within Skill limits', async () => {
  const measurements = await measureSpecs();

  it('finds the specs under ./spec', () => {
    strict(measurements.length > 0, 'specs should exist under ./spec');
  });

  for (const measurement of measurements) {
    it(`${measurement.relativePath} stays within Skill limits`, () => {
      assertWithinLimits(measurement);
    });
  }
});

await describe('CLAUDE.md stays within Skill limits', async () => {
  const measurements = await measureClaudeMd();

  it('finds CLAUDE.md at the repository root', () => {
    strict(measurements.length > 0, 'CLAUDE.md should exist at the root');
  });

  for (const measurement of measurements) {
    it(`${measurement.relativePath} stays within Skill limits`, () => {
      assertWithinLimits(measurement);
    });
  }
});

await describe('internal skills stay within Skill limits', async () => {
  const measurements = await measureSkills();

  it('finds the SKILL.md files under .claude/skills', () => {
    strict(
      measurements.length > 0,
      'SKILL.md files should exist under .claude/skills'
    );
  });

  for (const measurement of measurements) {
    it(`${measurement.relativePath} stays within Skill limits`, () => {
      assertWithinLimits(measurement);
    });
  }
});
