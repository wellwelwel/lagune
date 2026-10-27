import type { Probe } from '../types.ts';
import { probeDigest } from '../digest.ts';
import { formatCount, tokens } from '../format.ts';

const verdictOf = ({ file, root, bytes }: Probe): string =>
  root === null
    ? `${file}: not a GitIngest digest, read it as usual`
    : `${file}: GitIngest digest of ${root}, ${formatCount(bytes)} bytes, ${tokens(bytes)}`;

export const is = async (files: string[]): Promise<string[]> => {
  const probes = await Promise.all(files.map(probeDigest));

  if (probes.some(({ root }) => root === null)) process.exitCode = 1;

  return probes.map(verdictOf);
};
