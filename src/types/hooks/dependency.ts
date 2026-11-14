import type { CallNode } from '@ruby/prism/src/nodes.js';
import type { SeverityDetail } from '../scan.js';

export type DependencyVerdict =
  | 'plain-transport'
  | 'missing-integrity'
  | 'extra-index'
  | 'skipped-checksum'
  | 'guarded-plain-transport'
  | 'outside-registry'
  | 'install-script'
  | 'floating-specifier'
  | 'no-lockfile'
  | 'pinned-plain-transport'
  | 'unrecorded-checksum';

export type DependencyRule = SeverityDetail & { verdict: DependencyVerdict };

/** A rule one file breaks, with the package it names, or null when the rule names the file alone */
export type DependencyFlag = {
  verdict: DependencyVerdict;
  name: string | null;
};

/** What one dependency file decides on its own */
export type DependencyRead = {
  flags: DependencyFlag[];
  needsLockfile: boolean;
  /** Pins every dependency it declares to one version, the way a lockfile does */
  pins: boolean;
  declaresWorkspace: boolean;
};

export type DependencyReader = (
  file: string,
  content: string
) => DependencyRead;

/** The project's dependency files, which every judgment across files reads from */
export type CoverageScope = {
  has: (file: string) => boolean;
  filesIn: (folder: string) => readonly string[];
  textAt: (file: string) => Promise<string>;
  readAt: (file: string) => Promise<DependencyRead>;
};

/** The files one family of package managers reads, and what pins its manifests */
export type DependencyEcosystem = {
  /** The reader of a file, which may depend on what else the project holds, such as a settings.xml beside a pom.xml */
  readerOf: (
    file: string,
    has: (file: string) => boolean
  ) => DependencyReader | null;
  keeps: (file: string) => boolean;
  coveredBeside: (manifest: string, scope: CoverageScope) => Promise<boolean>;
  /** Whether a folder above the manifest roots a workspace whose lockfile covers it */
  rootsWorkspace: (
    folder: string,
    scope: CoverageScope,
    manifest: string
  ) => Promise<boolean>;
  /** The flags a file ends with once the files beside it are read, such as a module go.mod requires and go.sum holds no checksum for, or the install scripts an .npmrc switches off */
  resolveBeside?: (
    file: string,
    flags: readonly DependencyFlag[],
    scope: CoverageScope
  ) => Promise<readonly DependencyFlag[]>;
};

export type PlacedReader = {
  ecosystem: DependencyEcosystem;
  reader: DependencyReader;
};

/** A file the scan read, its read blank when the checker cannot judge the file, which its problem then names */
export type JudgedFile = {
  file: string;
  ecosystem: DependencyEcosystem;
  read: DependencyRead;
  problem: string | null;
};

/** The files that declare dependencies, split by whether a lockfile covers them */
export type ManifestCoverage = {
  covered: Set<string>;
  uncovered: Set<string>;
};

/** Where a specifier or a locked entry fetches its package from */
export type DependencySource = 'plain' | 'remote' | 'registry' | 'project';

export type Specifier = readonly [name: string, spec: string];

export type LockedEntry = {
  name: string;
  source: DependencySource;
  /** Lacks the hash its package manager writes for an entry of its kind, which Yarn never writes for a package it locks with conditions */
  missingHash: boolean;
  installScript: boolean;
};

export type NpmPackage = {
  name: string;
  display: string;
  fetched: boolean;
  resolved: string | undefined;
  missingHash: boolean;
  installScript: boolean;
  specs: Specifier[];
};

/** What a project's .npmrc settles for the lockfile beside it */
export type NpmrcSettings = {
  ignoresScripts: boolean;
  /** Whether npm fetches a lockfile URL on the public registry as written, instead of from the registry it is configured with */
  keepsLockedRegistryUrls: boolean;
};

/** The registries a Yarn configuration fetches from, and the hosts it lets it reach over plain http:// */
export type YarnRegistries = {
  servers: string[];
  allowedHttpHosts: string[];
};

export type IndentedLine = {
  indent: number;
  text: string;
  line: number;
};

export type BlockNode = {
  text: string;
  line: number;
  children: BlockNode[];
};

export type OpenBlock = {
  indent: number;
  node: BlockNode;
};

export type KeyValue = {
  key: string;
  value: string;
};

export type BlockField = KeyValue & {
  line: number;
  children: BlockNode[];
};

/** A Python requirement: resolved from an index, fetched from a URL, or taken from a local path */
export type PythonRequirement =
  | { kind: 'index'; text: string; pinned: boolean }
  | { kind: 'reference'; text: string; url: string }
  | { kind: 'local' };

/** A requirements-file option pip understands, by its long name */
export type PipOption = {
  name: string;
  short: string | null;
  takesValue: boolean;
};

export type PipOptionValue = {
  name: string;
  value: string;
};

export type RequirementLine = {
  requirement: PythonRequirement;
  hashed: boolean;
};

export type RequirementsContent = {
  options: PipOptionValue[];
  requirements: RequirementLine[];
};

/** The sections of an INI file, each key holding the lines of its value */
export type IniSections = Map<string, Map<string, string[]>>;

export type NumberedLine = readonly [line: number, text: string];

/** A table and the dotted path a message names it by */
export type PlacedTable = readonly [
  where: string,
  table: Record<string, unknown>,
];

/** One directive of a go.mod, or one entry of a directive's block */
export type GoDirective = {
  verb: string;
  operands: string[];
  line: number;
};

export type GoModuleVersion = {
  path: string;
  version: string;
};

/** A replace directive, for one version of a module or every version when it names none, and a target that is null when a folder replaces it */
export type GoReplacement = {
  path: string;
  version: string | null;
  target: GoModuleVersion | null;
};

export type GoModule = {
  requirements: GoModuleVersion[];
  replacements: GoReplacement[];
};

/** Ruby code as the checker reads it: the text of every string and symbol it writes, at any depth, and every call it makes */
export type RubyCode = {
  texts: string[];
  calls: CallNode[];
};

/** A source section of a Gemfile.lock: the remotes it fetches from and the gems it locks, each spelled as the lockfile spells it */
export type BundlerSource = {
  remotes: string[];
  specs: string[];
};

/** An XML element as the checker reads it: its name, its attributes, the text written directly in it, and its child elements */
export type XmlElement = {
  name: string;
  attributes: ReadonlyMap<string, string>;
  text: string;
  children: XmlElement[];
};

/** An element that lists entries and the name of each entry, such as repositories and repository */
export type XmlList = readonly [list: string, entry: string];

/** How the checker reads a Gradle script's language: its code, the tokens that read each kind of string by the quote that opens it, and whether a block comment nests */
export type GradleDialect = {
  language: string;
  code: RegExp;
  strings: ReadonlyMap<string, RegExp>;
  nestedComments: boolean;
};

export type GradleBlock = {
  namesSources: boolean;
  publishes: boolean;
  configuresElsewhere: boolean;
  listsDependencies: boolean;
};

/** A string open in a Gradle script, from the offset where its text starts */
export type GradleOpenString = {
  kind: 'string';
  tokens: RegExp;
  start: number;
  namesSources: boolean;
};

/** An interpolation open inside a Gradle string, counting the braces opened within it */
export type GradleOpenInterpolation = {
  kind: 'interpolation';
  braces: number;
};

/** A Gradle script as the checker reads it: every string written in a block that names sources, and whether it declares dependencies of its own */
export type GradleScan = {
  sources: string[];
  declaresDependencies: boolean;
};

/** A scan of a Gradle script under way: the strings and interpolations open where it stands, the blocks around it, the name written right before it, and what it has read so far */
export type GradleScanState = GradleScan & {
  frames: (GradleOpenString | GradleOpenInterpolation)[];
  blocks: GradleBlock[];
  name: string | null;
};
