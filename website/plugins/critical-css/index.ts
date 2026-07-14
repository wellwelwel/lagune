import type { PluginModule } from '@docusaurus/types';
import fs from 'node:fs/promises';
import path from 'node:path';
import Beasties from 'beasties';

const pluginName = 'lagune-critical-css';

const UNUSED_LAYERS = [
  'docusaurus.infima',
  'docusaurus.theme-common',
  'docusaurus.theme-classic',
  'docusaurus.core',
];

const stripLayer = (css: string, layer: string): string => {
  const opener = `@layer ${layer}{`;
  const start = css.indexOf(opener);

  if (start < 0) return css;

  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && (depth -= 1) === 0)
      return css.slice(0, start) + css.slice(i + 1);
  }

  return css;
};

const trimInlineStyle = (html: string): string =>
  html.replace(
    /(<style[^>]*>)([\s\S]*?)(<\/style>)/g,
    (_match, open, css, close) => {
      const trimmed = UNUSED_LAYERS.reduce(stripLayer, css);
      return `${open}${trimmed}${close}`;
    }
  );

export const criticalCssPlugin: PluginModule = () => ({
  name: pluginName,
  postBuild: async ({ outDir }) => {
    const homepage = path.join(outDir, 'index.html');
    const html = await fs.readFile(homepage, 'utf8');
    const beasties = new Beasties({
      path: outDir,
      preload: 'swap',
      pruneSource: false,
      fonts: false,
      inlineFonts: false,
      preloadFonts: false,
      logLevel: 'silent',
    });

    await fs.writeFile(homepage, trimInlineStyle(await beasties.process(html)));
  },
});
