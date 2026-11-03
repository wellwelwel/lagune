import type { PluginModule } from '@docusaurus/types';
import fs from 'node:fs/promises';
import path from 'node:path';

const pluginName = 'lagune-schemas';

export const schemasPlugin: PluginModule = ({ siteDir, i18n }) => ({
  name: pluginName,
  postBuild: async ({ outDir }) => {
    if (i18n.currentLocale !== i18n.defaultLocale) return;

    await fs.cp(
      path.resolve(siteDir, '../schemas'),
      path.join(outDir, 'schemas'),
      { recursive: true }
    );
  },
});
