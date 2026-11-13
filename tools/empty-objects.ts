import type { Node, SourceFile } from 'typescript/unstable/ast';
import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { isObjectLiteralExpression } from 'typescript/unstable/ast';
import { API } from 'typescript/unstable/sync';

const REPOSITORY_ROOT = fileURLToPath(new URL('../', import.meta.url));
const DEEP_FOLDERS = [
  'src',
  'tools',
  'test',
  'scripts',
  'website/src',
  'website/plugins',
];
const SHALLOW_FOLDERS = ['website'];
const CODE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/;
const PROJECT_FILE = join(REPOSITORY_ROOT, 'tsconfig.empty-objects.json');

const isScanned = (file: string): boolean =>
  CODE_FILE.test(file) && !file.split(sep).includes('node_modules');

const listDeep = async (folder: string): Promise<string[]> =>
  (await readdir(join(REPOSITORY_ROOT, folder), { recursive: true }))
    .filter(isScanned)
    .map((file) => join(REPOSITORY_ROOT, folder, file));

const listShallow = async (folder: string): Promise<string[]> =>
  (await readdir(join(REPOSITORY_ROOT, folder), { withFileTypes: true }))
    .filter((entry) => entry.isFile() && isScanned(entry.name))
    .map((entry) => join(REPOSITORY_ROOT, folder, entry.name));

const listScannedFiles = async (): Promise<string[]> =>
  (
    await Promise.all([
      ...DEEP_FOLDERS.map(listDeep),
      ...SHALLOW_FOLDERS.map(listShallow),
    ])
  ).flat();

const isEmptyObjectLiteral = (node: Node): boolean =>
  isObjectLiteralExpression(node) && node.properties.length === 0;

const emptyObjectLocations = (sourceFile: SourceFile): string[] => {
  const locations: string[] = [];
  const visit = (node: Node): void => {
    if (isEmptyObjectLiteral(node)) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(
        node.getStart(sourceFile)
      );

      locations.push(
        `${relative(REPOSITORY_ROOT, sourceFile.fileName)}:${line + 1}:${character + 1}`
      );
    }

    node.forEachChild(visit);
  };

  sourceFile.forEachChild(visit);

  return locations;
};

const emptyObjectLocationsIn = (files: string[]): string[] => {
  const projectText = JSON.stringify({
    files,
    compilerOptions: {
      allowJs: true,
      noLib: true,
      noResolve: true,
      types: [],
    },
  });
  const api = new API({
    cwd: REPOSITORY_ROOT,
    fs: {
      fileExists: (fileName) => (fileName === PROJECT_FILE ? true : undefined),
      readFile: (fileName) =>
        fileName === PROJECT_FILE ? projectText : undefined,
    },
  });

  try {
    const project = api
      .updateSnapshot({ openProjects: [PROJECT_FILE] })
      .getProject(PROJECT_FILE);

    if (project === undefined)
      throw new Error('TypeScript could not open the scanned files.');

    const { program } = project;
    const [syntaxError] = program.getSyntacticDiagnostics();

    if (syntaxError !== undefined)
      throw new Error(
        `TypeScript could not parse ${syntaxError.fileName ?? 'a scanned file'}: ${syntaxError.text}`
      );

    return files.flatMap((file) => {
      const sourceFile = program.getSourceFile(file);

      if (sourceFile === undefined)
        throw new Error(`TypeScript could not read ${file}.`);

      return emptyObjectLocations(sourceFile);
    });
  } finally {
    api.close();
  }
};

const locations = emptyObjectLocationsIn(await listScannedFiles());

if (locations.length > 0) {
  console.error(
    'Forbidden empty object literal found (create it with Object.create(null) instead):'
  );
  console.error(locations.join('\n'));
  process.exitCode = 1;
}
