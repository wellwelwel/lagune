import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';
import { packageRoot } from './__utils__.js';

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const LOGO_SIZE = 512;

await describe('the plugin logo', async () => {
  await it('is a square PNG of 512 pixels, a size every listing accepts', async () => {
    const logo = await readFile(new URL('assets/logo.png', packageRoot));

    strict(logo.subarray(0, 8).equals(PNG_SIGNATURE), 'it is a PNG');
    strict.strictEqual(logo.readUInt32BE(16), LOGO_SIZE);
    strict.strictEqual(logo.readUInt32BE(20), LOGO_SIZE);
  });
});
