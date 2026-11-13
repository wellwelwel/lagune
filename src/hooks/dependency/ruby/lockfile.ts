import type {
  BundlerSource,
  DependencyFlag,
  DependencyRead,
} from '../../../types/hooks/dependency.js';
import { quotedExcerpt } from '../../../core/errors.js';
import { flagsRead } from '../read.js';
import { cannotJudge } from '../text.js';
import { isPlainTransport } from '../transport.js';

/** The sections Bundler reads a source from */
const SOURCE_SECTIONS: ReadonlySet<string> = new Set([
  'GEM',
  'GIT',
  'PATH',
  'PLUGIN SOURCE',
]);

/** Every section a Bundler release writes, a file that opens none of them being no lockfile at all */
const KNOWN_SECTIONS: ReadonlySet<string> = new Set([
  ...SOURCE_SECTIONS,
  'DEPENDENCIES',
  'PLATFORMS',
  'CHECKSUMS',
  'RUBY VERSION',
  'BUNDLED WITH',
]);

/** The markers of a merge conflict, which make Bundler refuse the whole lockfile */
const MERGE_CONFLICT = /<<<<<<<|=======|>>>>>>>|\|{7}/;

const LINE_BREAKS = /(?:\r?\n)+/;

const INDENTED = /^\s/;

const SPECS = '  specs:';

const OPTION = /^ {2}([a-z]+): (.*)$/i;

const REMOTE = 'remote';

/** A gem the section locks, spelled as its name and version */
const SPEC = /^ {4}(?! )(.*)$/;

/** A dependency of the gem above it */
const SPEC_DEPENDENCY = /^ {6}(?! )/;

/** The source sections of a Gemfile.lock, read line by line the way Bundler reads them, refusing a line Bundler never writes in one */
const bundlerSourcesOf = (file: string, content: string): BundlerSource[] => {
  if (MERGE_CONFLICT.test(content))
    throw cannotJudge(file, 'holds the markers of a merge conflict');

  const lines = content.split(LINE_BREAKS).filter((line) => line.trim() !== '');

  if (lines.length > 0 && !lines.some((line) => KNOWN_SECTIONS.has(line)))
    throw cannotJudge(file, 'opens none of the sections Bundler writes');

  const sources: BundlerSource[] = [];
  let source: BundlerSource | null = null;

  for (const line of lines) {
    if (!INDENTED.test(line)) {
      source = SOURCE_SECTIONS.has(line) ? { remotes: [], specs: [] } : null;

      if (source !== null) sources.push(source);

      continue;
    }

    if (source === null || line === SPECS || SPEC_DEPENDENCY.test(line))
      continue;

    const option = OPTION.exec(line);

    if (option !== null) {
      if (option[1] === REMOTE) source.remotes.push(option[2]);

      continue;
    }

    const spec = SPEC.exec(line);

    if (spec === null)
      throw cannotJudge(
        file,
        `holds a line Bundler never writes in a source section: ${quotedExcerpt(line)}`
      );

    source.specs.push(spec[1]);
  }

  return sources;
};

/** A Gemfile.lock or gems.locked, flagging each gem a source section locks from a remote over plain http:// or git:// */
export const readGemfileLock = (
  file: string,
  content: string
): DependencyRead =>
  flagsRead(
    bundlerSourcesOf(file, content)
      .filter(({ remotes }) => remotes.some(isPlainTransport))
      .flatMap(({ specs }) =>
        specs.map((name): DependencyFlag => ({
          verdict: 'plain-transport',
          name,
        }))
      )
  );
