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

type QuestionParameter = {
  name: string;
  label: string;
};

type ToolQuestion = {
  tool: string;
  question: string;
  parameters: QuestionParameter[];
};

type ReviewedList = {
  servers: {
    server: RegistryServer;
    _meta?: { 'ai.lagune/questions'?: ToolQuestion[] };
  }[];
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

const placeholder = /\{([A-Za-z0-9_.-]{1,64})\}/g;
const parameterName = /^[A-Za-z0-9_.-]{1,64}$/;
const hiddenCharacter = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u;
const questionLimits = { question: 200, label: 40, parameters: 16 };

const accountNamespace = 'io.github.';

const publisherDomain = (name: string): string | undefined => {
  const namespace = name.slice(0, name.indexOf('/'));

  if (namespace.startsWith(accountNamespace)) return undefined;

  return namespace.split('.').reverse().join('.');
};

const isServedFrom = (address: string, domain: string): boolean => {
  const host = URL.parse(address)?.hostname ?? '';

  return host === domain || host.endsWith(`.${domain}`);
};

const isShownText = (text: string, limit: number): boolean =>
  text.trim() !== '' && text.length <= limit && !hiddenCharacter.test(text);

const questionProblem = ({
  question,
  parameters,
}: ToolQuestion): string | undefined => {
  const names = new Set(parameters.map(({ name }) => name));
  const labels = new Set(parameters.map(({ label }) => label.toLowerCase()));
  const placed = [...question.matchAll(placeholder)].map(([, name]) => name);

  if (!isShownText(question, questionLimits.question))
    return 'its question is empty, too long, or holds a hidden character';
  if (/[{}]/.test(question.replaceAll(placeholder, '')))
    return 'its question holds a brace outside a placeholder';
  if (!placed.every((name) => names.has(name)))
    return 'its question names a parameter it never declares';
  if (parameters.length > questionLimits.parameters)
    return 'it declares too many parameters';
  if (names.size !== parameters.length || labels.size !== parameters.length)
    return 'it repeats a parameter or a label';
  if (!parameters.every(({ name }) => parameterName.test(name)))
    return 'it declares a parameter name Lagune Code does not read';
  if (
    !parameters.every(({ label }) => isShownText(label, questionLimits.label))
  )
    return 'it gives a label that is empty, too long, or hidden';

  return undefined;
};

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
  const domainRemotes = list.servers.flatMap(({ server }) => {
    const domain = publisherDomain(server.name);

    if (domain === undefined) return [];

    return (server.remotes ?? []).map(({ url }) => ({
      name: server.name,
      domain,
      url,
    }));
  });
  const entryQuestions = list.servers.map(({ server, _meta: meta }) => ({
    server: server.name,
    questions: meta?.['ai.lagune/questions'] ?? [],
  }));

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

  for (const { name, domain, url } of domainRemotes)
    it('serves every remote of a domain-named publisher from that domain', () => {
      strict(
        isServedFrom(url, domain),
        `${name} reaches ${url} outside ${domain}`
      );
    });

  for (const { server, questions } of entryQuestions)
    it('asks at most one question per tool of a server', () => {
      const tools = questions.map(({ tool }) => tool);

      strict.strictEqual(
        new Set(tools).size,
        tools.length,
        `${server} asks twice about one tool`
      );
    });

  for (const { server, questions } of entryQuestions)
    for (const toolQuestion of questions)
      it('words every question so Lagune Code can show it', () => {
        const problem = questionProblem(toolQuestion);

        strict.strictEqual(
          problem,
          undefined,
          `${server} ${toolQuestion.tool}: ${problem}`
        );
      });
});
