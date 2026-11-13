import type {
  DependencyFlag,
  LockedEntry,
} from '../../../types/hooks/dependency.js';
import { integrityFlags, plainFlags } from '../locked.js';

const remoteFlags = ({ name, source }: LockedEntry): DependencyFlag[] =>
  source === 'remote' ? [{ verdict: 'outside-registry', name }] : [];

const scriptFlags = ({ name, installScript }: LockedEntry): DependencyFlag[] =>
  installScript ? [{ verdict: 'install-script', name }] : [];

export const lockedFlags = (
  entries: readonly LockedEntry[]
): DependencyFlag[] =>
  entries.flatMap((entry) => [
    ...plainFlags(entry),
    ...remoteFlags(entry),
    ...integrityFlags(entry),
    ...scriptFlags(entry),
  ]);
