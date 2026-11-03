import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { LOCALES } from '../../../website/i18n/locales.js';

const staticRoot = new URL('../../../website/static/', import.meta.url);

await describe('the flag shown beside each language', async () => {
  for (const { code, flag } of LOCALES)
    await it(`ships as an SVG served from the root for ${code}`, async () => {
      const image = await readFile(new URL(`.${flag}`, staticRoot), 'utf8');

      strict.match(image, /^<svg[\s>]/);
    });
});
