import { stdout } from 'node:process';
import {
  banner,
  migrateBlueSpecFirst,
  migrateNothing,
  migrateReport,
} from '../cli/messages.js';
import { hasBlueSpec, performMigrate } from '../core/migrate.js';
import { FROZEN_VERSION } from './fallback.js';

const nothingMigrated = async (cwd: string): Promise<string> =>
  (await hasBlueSpec(cwd))
    ? migrateBlueSpecFirst(FROZEN_VERSION)
    : migrateNothing();

export const runMigrate = async (cwd: string): Promise<void> => {
  const result = await performMigrate(cwd);
  const body = result.migrated
    ? migrateReport(result)
    : await nothingMigrated(cwd);

  stdout.write(`${[banner(), '', body].join('\n')}\n`);
};
