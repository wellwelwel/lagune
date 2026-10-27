import type { Plugin } from 'vite';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { env } from 'node:process';
import { fileURLToPath } from 'node:url';
import { preact } from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const devServerUrl = 'http://127.0.0.1:3001';

const metafile = (path: string | undefined): Plugin => ({
  name: 'metafile',
  async generateBundle(_, bundle) {
    if (!path) return;

    const inputs = Object.values(bundle).flatMap((output) =>
      output.type === 'chunk' ? output.moduleIds : []
    );

    await writeFile(
      path,
      JSON.stringify({
        inputs: Object.fromEntries(inputs.map((id) => [id, {}])),
      })
    );
  },
});

export default defineConfig({
  root: join(here, 'client'),
  resolve: {
    alias: [{ find: /^@\//, replacement: `${join(here, '..')}/` }],
  },
  plugins: [preact(), tailwindcss(), metafile(env.DASHBOARD_METAFILE)],
  build: {
    outDir: join(here, '..', '..', 'lib', 'dashboard'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '^/api/': devServerUrl,
      '/events': devServerUrl,
    },
  },
});
