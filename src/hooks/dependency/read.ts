import type {
  DependencyFlag,
  DependencyRead,
} from '../../types/hooks/dependency.js';

/** The read of a file that only flags, such as a lockfile or a configuration */
export const flagsRead = (flags: DependencyFlag[]): DependencyRead => ({
  flags,
  needsLockfile: false,
  pins: false,
  declaresWorkspace: false,
});
