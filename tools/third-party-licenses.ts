import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { argv } from 'node:process';

type Metafile = { inputs: Record<string, unknown> };

type PackageManifest = {
  name: string;
  version: string;
  license: string;
};

type BundledPackage = PackageManifest & { text: string };

const NODE_MODULES = `${sep}node_modules${sep}`;
const LICENSE_FILE = /^(licen[cs]e|copying)(\.|$)/i;

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

const readPackageDirectories = async (
  metafilePaths: string[]
): Promise<Set<string>> => {
  const metafiles = await Promise.all(
    metafilePaths.map(async (path): Promise<Metafile> =>
      JSON.parse(await readFile(path, 'utf8'))
    )
  );
  const directories = metafiles
    .flatMap((metafile) => Object.keys(metafile.inputs))
    .map((input) => toPackageDirectory(resolve(input)))
    .filter((directory) => directory !== undefined);

  return new Set(directories);
};

const readBundledPackage = async (
  directory: string
): Promise<BundledPackage> => {
  const manifest: unknown = JSON.parse(
    await readFile(join(directory, 'package.json'), 'utf8')
  );
  const licenseFile = (await readdir(directory)).find((file) =>
    LICENSE_FILE.test(file)
  );

  if (!isPackageManifest(manifest) || !licenseFile)
    throw new Error(`${directory} ships no license to attribute.`);

  return {
    name: manifest.name,
    version: manifest.version,
    license: manifest.license,
    text: (await readFile(join(directory, licenseFile), 'utf8')).trim(),
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
