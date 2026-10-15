import { readFile } from 'node:fs/promises';
import { describe, it, strict } from 'poku';

type RegistryPackage = {
  registryType: string;
  identifier: string;
  version?: string;
};

type RegistryServer = {
  name: string;
  version: string;
  packages?: RegistryPackage[];
  remotes?: { url: string }[];
};

type ReviewedList = {
  servers: { server: RegistryServer }[];
  metadata?: { nextCursor?: string };
};

const packageRoot = new URL('../../../', import.meta.url);
const reviewedList = new URL(
  'website/static/registry/v0.1/servers',
  packageRoot
);
const serverName = /^[a-zA-Z0-9.-]{1,100}\/[a-zA-Z0-9._-]{1,100}$/;
const imageDigest = /@sha256:[a-f0-9]{64}$/;
const exactVersions = new Map([
  ['npm', /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/],
  ['pypi', /^\d+(?:\.\d+)*(?:(?:a|b|rc)\d+)?(?:\.post\d+)?(?:\.dev\d+)?$/],
]);

const isPinned = ({
  registryType,
  identifier,
  version,
}: RegistryPackage): boolean => {
  if (registryType === 'oci') return imageDigest.test(identifier);

  const exactVersion = exactVersions.get(registryType);

  return exactVersion !== undefined && exactVersion.test(version ?? '');
};

await describe('the catalog list Lagune Code reviews', async () => {
  const list: ReviewedList = JSON.parse(await readFile(reviewedList, 'utf8'));

  it('answers with the list shape a registry client reads', () => {
    strict(Array.isArray(list.servers));
  });

  it('fits on one page, with no cursor to follow', () => {
    strict.strictEqual(list.metadata?.nextCursor, undefined);
  });

  for (const { server } of list.servers)
    it('names every reviewed server within a namespace, at a version', () => {
      strict(serverName.test(server.name), `${server.name} has no namespace`);
      strict(server.version, `${server.name} has no version`);
    });

  for (const { server } of list.servers)
    for (const registryPackage of server.packages ?? [])
      it('pins every package to an exact version or image digest', () => {
        strict(
          isPinned(registryPackage),
          `${server.name} does not pin ${registryPackage.identifier}`
        );
      });

  for (const { server } of list.servers)
    for (const remote of server.remotes ?? [])
      it('reaches every remote over HTTPS', () => {
        strict.strictEqual(
          URL.parse(remote.url)?.protocol,
          'https:',
          `${server.name} reaches ${remote.url} without HTTPS`
        );
      });
});
