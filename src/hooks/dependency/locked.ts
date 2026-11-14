import type {
  DependencyFlag,
  LockedEntry,
} from '../../types/hooks/dependency.js';

export const plainFlags = ({ name, source }: LockedEntry): DependencyFlag[] =>
  source === 'plain' ? [{ verdict: 'plain-transport', name }] : [];

export const integrityFlags = ({
  name,
  source,
  missingHash,
}: LockedEntry): DependencyFlag[] =>
  source === 'registry' && missingHash
    ? [{ verdict: 'missing-integrity', name }]
    : [];

/** The flags of the locked entries nothing verifies on the way in: fetched in the clear, or from a registry without a hash */
export const unverifiedFlags = (
  entries: readonly LockedEntry[]
): DependencyFlag[] =>
  entries.flatMap((entry) => [...plainFlags(entry), ...integrityFlags(entry)]);
