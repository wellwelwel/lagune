import type { DependencyRead } from '../../../types/hooks/dependency.js';
import { flagsRead } from '../read.js';
import { plainUrlFlags } from '../transport.js';
import { propertiesOf } from './properties.js';

/** Where a wrapper downloads Maven or Gradle itself, and where the Maven wrapper downloads its own launcher */
const WRAPPER_URL_KEYS = ['distributionUrl', 'wrapperUrl'];

/** A Maven or Gradle wrapper's properties, read for the URLs it downloads the build tool from */
export const readWrapperProperties = (
  file: string,
  content: string
): DependencyRead => {
  const properties = propertiesOf(file, content);

  return flagsRead(
    plainUrlFlags(WRAPPER_URL_KEYS.flatMap((key) => properties.get(key) ?? []))
  );
};
