import type { PluginModule } from '@docusaurus/types';
import fs from 'node:fs/promises';
import path from 'node:path';

const pluginName = 'lagune-locale-output';

const TEXT_OUTPUT = /\.(?:html|js|css|json|xml|txt|md|webmanifest|svg)$/;

const filesUnder = async (folder: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(folder, {
      recursive: true,
      withFileTypes: true,
    });

    return entries
      .filter((entry) => entry.isFile())
      .map((entry) =>
        path
          .relative(folder, path.join(entry.parentPath, entry.name))
          .split(path.sep)
          .join('/')
      );
  } catch {
    return [];
  }
};

/** A translated locale is served under its own prefix, so it keeps only the static files its own pages load: the root-only files and every asset its pages take from the root are removed from its copy */
export const localeOutputPlugin: PluginModule = ({
  siteDir,
  siteConfig,
  i18n,
  baseUrl,
}) => ({
  name: pluginName,
  postBuild: async ({ outDir }) => {
    if (i18n.currentLocale === i18n.defaultLocale) return;

    const staticFiles = (
      await Promise.all(
        siteConfig.staticDirectories.map((directory) =>
          filesUnder(path.resolve(siteDir, directory))
        )
      )
    ).flat();
    const outputs = (await filesUnder(outDir)).filter((file) =>
      TEXT_OUTPUT.test(file)
    );
    const contents = await Promise.all(
      outputs.map((file) => fs.readFile(path.join(outDir, file), 'utf8'))
    );
    const unused = [...new Set(staticFiles)].filter(
      (file) => !contents.some((text) => text.includes(`${baseUrl}${file}`))
    );

    await Promise.all(
      unused.map((file) => fs.rm(path.join(outDir, file), { force: true }))
    );

    const folders = [
      ...new Set(
        unused.flatMap((file) => {
          const parts = file.split('/').slice(0, -1);

          return parts.map((_, index) => parts.slice(0, index + 1).join('/'));
        })
      ),
    ].sort((left, right) => right.length - left.length);

    await folders.reduce(
      (previous, folder) =>
        previous.then(() =>
          fs.rmdir(path.join(outDir, folder)).catch(() => undefined)
        ),
      Promise.resolve()
    );
  },
});
