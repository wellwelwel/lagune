import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';

type ClientDocument = {
  client_id: string;
  redirect_uris: string[];
  token_endpoint_auth_method: string;
};

const packageRoot = new URL('../../../', import.meta.url);
const clientDocument = new URL(
  'website/static/oauth/client-metadata.json',
  packageRoot
);

await describe('the OAuth client document Lagune Code signs in with', async () => {
  const document: ClientDocument = JSON.parse(
    await readFile(clientDocument, 'utf8')
  );

  it('names itself by the address it is published at', () => {
    strict.strictEqual(
      document.client_id,
      'https://lagune.ai/oauth/client-metadata.json'
    );
  });

  it('holds no shared secret', () => {
    strict(!Object.hasOwn(document, 'client_secret'));
    strict(!Object.hasOwn(document, 'client_secret_expires_at'));
    strict.strictEqual(document.token_endpoint_auth_method, 'none');
  });

  it('returns a sign-in only to the callbacks Lagune Code listens on', () => {
    strict.deepStrictEqual(document.redirect_uris, [
      'http://127.0.0.1:18723/callback',
      'http://127.0.0.1:18724/callback',
      'http://127.0.0.1:18725/callback',
      'http://127.0.0.1:18726/callback',
    ]);
  });
});
