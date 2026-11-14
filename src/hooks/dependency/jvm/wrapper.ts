import type { DependencyRead } from '../../../types/hooks/dependency.js';
import { deepFreeze } from '../../../core/collections.js';
import { flagsRead } from '../read.js';
import { plainUrlFlags } from '../transport.js';
import { propertiesOf } from './properties.js';

/** Where a wrapper downloads Maven or Gradle itself, or where the Maven wrapper downloads its own launcher, each beside the checksum that pins the download */
const WRAPPER_DOWNLOADS: readonly (readonly [url: string, checksum: string])[] =
  deepFreeze([
    ['distributionUrl', 'distributionSha256Sum'],
    ['wrapperUrl', 'wrapperSha256Sum'],
  ]);

/** A Maven or Gradle wrapper's properties, read for the URLs it downloads the build tool from, a pinned checksum rejecting any other file */
export const readWrapperProperties = (
  file: string,
  content: string
): DependencyRead => {
  const properties = propertiesOf(file, content);

  return flagsRead(
    WRAPPER_DOWNLOADS.flatMap(([urlKey, checksumKey]) => {
      const url = properties.get(urlKey);

      if (url === undefined) return [];

      return plainUrlFlags(
        [url],
        (properties.get(checksumKey) ?? '').trim() === ''
          ? 'plain-transport'
          : 'pinned-plain-transport'
      );
    })
  );
};
