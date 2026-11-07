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

const STYLESHEET_LINK = /<link rel="?stylesheet"? href="?([^"\s>]+)/;

const FONT_FACE_RULE = /@font-face\{[^{}]*\}/g;

const stripLayer = (css: string, layer: string): string => {
  const opener = `@layer ${layer}{`;
  const start = css.indexOf(opener);

  if (start < 0) return css;

  let depth = 0;

  for (let index = css.indexOf('{', start); index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    else if (css[index] === '}' && (depth -= 1) === 0)
      return css.slice(0, start) + css.slice(index + 1);
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

/* Beasties only inlines the faces of families named literally in a critical rule, and the theme names every family through a var(). */
const fontFacesOf = async (
  html: string,
  outDir: string,
  baseUrl: string
): Promise<string> => {
  const href = STYLESHEET_LINK.exec(html)?.[1];

  if (!href)
    throw new Error(
      `${pluginName}: the home page links no stylesheet to copy its @font-face rules from.`
    );

  const css = await fs.readFile(
    path.join(outDir, href.slice(baseUrl.length)),
    'utf8'
  );

  return css.match(FONT_FACE_RULE)?.join('') ?? '';
};

export const criticalCssPlugin: PluginModule = ({ baseUrl }) => ({
  name: pluginName,
  postBuild: async ({ outDir }) => {
    const homepage = path.join(outDir, 'index.html');
    const html = await fs.readFile(homepage, 'utf8');
    const beasties = new Beasties({
      path: outDir,
      publicPath: baseUrl,
      preload: 'swap',
      pruneSource: false,
      fonts: false,
      inlineFonts: false,
      preloadFonts: false,
      logLevel: 'silent',
    });
    const fontFaces = await fontFacesOf(html, outDir, baseUrl);
    const critical = trimInlineStyle(await beasties.process(html));

    await fs.writeFile(
      homepage,
      critical.replace('</head>', `<style>${fontFaces}</style></head>`)
    );
  },
});
