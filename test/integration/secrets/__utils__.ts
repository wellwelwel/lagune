import type { ScanDetail, ScanReport } from '../../../src/types/scan.js';
import process, { platform } from 'node:process';
import { it } from 'poku';
import { scanSecrets } from '../../../src/hooks/secrets/scan.js';

export const itWithPermissionBits =
  platform === 'win32' || process.getuid?.() === 0 ? it.skip : it;

export const sortedDetails = (details: readonly ScanDetail[]): ScanDetail[] =>
  details.toSorted(
    (left, right) =>
      left.file.localeCompare(right.file) ||
      left.detail.localeCompare(right.detail)
  );

export const reported = ({
  findings,
  review,
  advisory,
}: ScanReport): Pick<ScanReport, 'findings' | 'review' | 'advisory'> => ({
  findings: sortedDetails(findings),
  review: sortedDetails(review),
  advisory: sortedDetails(advisory),
});

export const scanWhole = (workspace: string): Promise<ScanReport> =>
  scanSecrets(workspace, [workspace]);
