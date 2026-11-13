import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { argv } from 'node:process';

type BundledInput = { bytesInOutput: number };

type Metafile = {
  outputs: Record<string, { inputs: Record<string, BundledInput> }>;
};

type PackageManifest = {
  name: string;
  version: string;
  license: string;
};

type BundledPackage = PackageManifest & { text: string };

const NODE_MODULES = `${sep}node_modules${sep}`;
const LICENSE_FILE = /^(licen[cs]e|copying)(\.|$)/i;

/** The licenses a package's source repository publishes but its npm release leaves out, each in a folder named after the package */
const VENDORED_LICENSES = join(import.meta.dirname, 'licenses');

const toPackageDirectory = (modulePath: string): string | undefined => {
  const nodeModulesIndex = modulePath.lastIndexOf(NODE_MODULES);

  if (nodeModulesIndex === -1) return;

  const modulesRoot = modulePath.slice(
    0,
    nodeModulesIndex + NODE_MODULES.length
  );
  const segments = modulePath.slice(modulesRoot.length).split(sep);
  const nameLength = segments[0].startsWith('@') ? 2 : 1;

  return join(modulesRoot, ...segments.slice(0, nameLength));
};

const isPackageManifest = (value: unknown): value is PackageManifest =>
  typeof value === 'object' &&
  value !== null &&
  'name' in value &&
  typeof value.name === 'string' &&
  'version' in value &&
  typeof value.version === 'string' &&
  'license' in value &&
  typeof value.license === 'string';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isBundledInput = (value: unknown): value is BundledInput =>
  isRecord(value) &&
  typeof value.bytesInOutput === 'number' &&
  Number.isInteger(value.bytesInOutput) &&
  value.bytesInOutput >= 0;

const isMetafile = (value: unknown): value is Metafile =>
  isRecord(value) &&
  isRecord(value.outputs) &&
  Object.values(value.outputs).every(
    (output) =>
      isRecord(output) &&
      isRecord(output.inputs) &&
      Object.values(output.inputs).every(isBundledInput)
  );

const readMetafile = async (path: string): Promise<Metafile> => {
  const metafile: unknown = JSON.parse(await readFile(path, 'utf8'));

  if (!isMetafile(metafile))
    throw new Error(
      `${path} is not a metafile whose outputs list every input with the bytesInOutput it contributes.`
    );

  return metafile;
};

const emittedInputs = (metafile: Metafile): string[] =>
  Object.values(metafile.outputs).flatMap((output) =>
    Object.entries(output.inputs)
      .filter(([, input]) => input.bytesInOutput > 0)
      .map(([input]) => input)
  );

const readPackageDirectories = async (
  metafilePaths: string[]
): Promise<Set<string>> => {
  const metafiles = await Promise.all(metafilePaths.map(readMetafile));
  const directories = metafiles
    .flatMap(emittedInputs)
    .map((input) => toPackageDirectory(resolve(input)))
    .filter((directory) => directory !== undefined);

  return new Set(directories);
};

const licenseFileIn = (
  directory: string,
  files: readonly string[]
): string | undefined => {
  const licenseFile = files.find((file) => LICENSE_FILE.test(file));

  return licenseFile === undefined ? undefined : join(directory, licenseFile);
};

const readBundledPackage = async (
  directory: string
): Promise<BundledPackage> => {
  const manifest: unknown = JSON.parse(
    await readFile(join(directory, 'package.json'), 'utf8')
  );

  if (!isPackageManifest(manifest))
    throw new Error(
      `${directory} has a package.json without the name, version, and license to attribute.`
    );

  const vendored = join(VENDORED_LICENSES, manifest.name);
  const licenseFile =
    licenseFileIn(directory, await readdir(directory)) ??
    licenseFileIn(vendored, await readdir(vendored).catch(() => []));

  if (licenseFile === undefined)
    throw new Error(`${directory} ships no license to attribute.`);

  return {
    name: manifest.name,
    version: manifest.version,
    license: manifest.license,
    text: (await readFile(licenseFile, 'utf8')).trim(),
  };
};

const formatNotice = (packages: BundledPackage[]): string => {
  const separator = '-'.repeat(80);
  const entries = packages.map((bundledPackage) =>
    [
      separator,
      `${bundledPackage.name}@${bundledPackage.version} (${bundledPackage.license})`,
      separator,
      '',
      bundledPackage.text,
    ].join('\n')
  );

  return `Lagune bundles the following third-party packages.\n\n${entries.join('\n\n')}\n`;
};

const [outputPath, ...metafilePaths] = argv.slice(2);

if (!outputPath || metafilePaths.length === 0)
  throw new Error('Usage: third-party-licenses <output> <metafile...>');

const directories = await readPackageDirectories(metafilePaths);
const packages = await Promise.all([...directories].map(readBundledPackage));

packages.sort((left, right) => left.name.localeCompare(right.name));
await writeFile(outputPath, formatNotice(packages));
