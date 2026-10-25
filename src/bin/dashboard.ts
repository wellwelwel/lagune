import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startDashboard } from '../dashboard/server/start.js';

export const runDashboard = async (
  cwd: string,
  packageRoot: URL,
  port: number | undefined
): Promise<void> => {
  const distDir = join(fileURLToPath(packageRoot), 'lib', 'dashboard');

  await startDashboard({ cwd, distDir, packageRoot, port });
};
