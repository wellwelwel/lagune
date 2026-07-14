import type { Plugin } from 'postcss';

/**
 * @fontsource ships every @font-face with a woff2 source and a legacy woff
 * fallback. Every browser this site targets supports woff2, so the woff source
 * only bloats the render-blocking stylesheet. This strips the woff url from each
 * @font-face src while leaving the woff2 (and any other format) in place.
 */
const woffSource = /\s*,\s*url\([^)]+\.woff\)\s*format\((['"])woff\1\)/g;

export const dropWoff = (): Plugin => ({
  postcssPlugin: 'lagune-drop-woff',
  Declaration: (declaration) => {
    if (declaration.prop !== 'src') return;
    if (!declaration.value.includes('.woff2')) return;

    declaration.value = declaration.value.replace(woffSource, '');
  },
});

dropWoff.postcss = true;
