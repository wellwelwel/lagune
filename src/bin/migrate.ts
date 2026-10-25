import { stdout } from 'node:process';
import { banner, migrateNothing, migrateReport } from '../cli/messages.js';
import { performMigrate } from '../core/migrate.js';

export const runMigrate = async (cwd: string): Promise<void> => {
  const result = await performMigrate(cwd);
  const body = result.migrated ? migrateReport(result) : migrateNothing();

  stdout.write(`${[banner(), '', body].join('\n')}\n`);
};
