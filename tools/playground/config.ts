import {
  access,
  chmod,
  mkdir,
  readFile,
  rename,
  writeFile,
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';

type JsonObject = Record<string, unknown>;

type Table = { header: string; lines: string[] };

type ProbeServer = { command: string; args: string[] };

type Operation = (...values: string[]) => Promise<void>;

const ENGINE_TOOLS = ['lagune_read', 'lagune_write'];
const BYOK_NAME = 'Playground';
const BYOK_ID = 'playground';
const BYOK_MODEL = `custom:${BYOK_NAME}-0`;
const BYOK_CONTEXT = 200000;
const BYOK_OUTPUT = 16000;
const TABLE_HEADER = /^\s*\[[^\]]+\]\s*$/;
const DEFAULT_LINE = /^\s*default\s*=/;
const PROBE_VARIABLES = [
  '${workspaceFolder}',
  '${workspacePath}',
  '${workspaceRoot}',
  '${PROJECT_DIR}',
  '${CLAUDE_PROJECT_DIR}',
  '${PWD}',
  '${cwd}',
  '${PLUGIN_ROOT}',
  '${COPILOT_PLUGIN_ROOT}',
  '${KIMI_PLUGIN_ROOT}',
];

const isObject = (value: unknown): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const fieldOf = (value: unknown, key: string): unknown =>
  isObject(value) ? value[key] : undefined;

const asObject = (value: unknown): JsonObject =>
  isObject(value) ? value : Object.create(null);

const objectAt = (value: unknown, key: string): JsonObject =>
  asObject(fieldOf(value, key));

const listAt = (value: unknown, key: string): unknown[] => {
  const field = fieldOf(value, key);

  return Array.isArray(field) ? field : [];
};

const withoutKey = (value: unknown, key: string): JsonObject =>
  Object.fromEntries(
    Object.entries(asObject(value)).filter(([name]) => name !== key)
  );

const pathExists = (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false
  );

const readJson = async (file: string): Promise<JsonObject> => {
  if (!(await pathExists(file))) return Object.create(null);

  const parsed: unknown = JSON.parse(await readFile(file, 'utf8'));

  return asObject(parsed);
};

const writeJson = async (file: string, value: unknown): Promise<void> => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
};

const mergePrivateJson = async (
  file: string,
  update: (current: JsonObject) => JsonObject
): Promise<void> => {
  await writeJson(file, update(await readJson(file)));
  await chmod(file, 0o600);
};

const isLagune = (spec: unknown): boolean =>
  typeof spec === 'string' && (spec === 'lagune' || spec.startsWith('lagune@'));

const isByokModel = (entry: unknown): boolean =>
  isObject(entry) && entry.displayName === BYOK_NAME;

const selectAuth = (settingsFile: string, selectedType: string) =>
  mergePrivateJson(settingsFile, (settings) => ({
    ...settings,
    security: {
      ...objectAt(settings, 'security'),
      auth: {
        ...objectAt(objectAt(settings, 'security'), 'auth'),
        selectedType,
      },
    },
  }));

const configureDroid = (
  settingsFile: string,
  baseUrl: string,
  apiKey: string,
  model: string
) =>
  mergePrivateJson(settingsFile, (settings) => ({
    ...settings,
    customModels: [
      ...listAt(settings, 'customModels').filter(
        (entry) => !isByokModel(entry)
      ),
      {
        model,
        displayName: BYOK_NAME,
        baseUrl,
        apiKey,
        provider: 'generic-chat-completion-api',
        maxOutputTokens: BYOK_OUTPUT,
      },
    ],
    sessionDefaultSettings: {
      ...objectAt(settings, 'sessionDefaultSettings'),
      model: BYOK_MODEL,
    },
  }));

const splitTables = (text: string): Table[] =>
  text.split('\n').reduce<Table[]>(
    (tables, line) => {
      if (TABLE_HEADER.test(line))
        return [...tables, { header: line.trim(), lines: [line] }];

      const last = tables[tables.length - 1];

      return [
        ...tables.slice(0, -1),
        { ...last, lines: [...last.lines, line] },
      ];
    },
    [{ header: '', lines: [] }]
  );

const withByokDefault = (table: Table): Table => ({
  ...table,
  lines: [
    table.lines[0],
    `default = ${JSON.stringify(BYOK_ID)}`,
    ...table.lines.slice(1).filter((line) => !DEFAULT_LINE.test(line)),
  ],
});

const configureGrok = async (
  configFile: string,
  baseUrl: string,
  apiKey: string,
  model: string
): Promise<void> => {
  const text = (await pathExists(configFile))
    ? await readFile(configFile, 'utf8')
    : '';
  const tables = splitTables(text).filter(
    ({ header }) => header !== `[model.${BYOK_ID}]`
  );
  const withDefault = tables.some(({ header }) => header === '[models]')
    ? tables.map((table) =>
        table.header === '[models]' ? withByokDefault(table) : table
      )
    : [
        ...tables,
        {
          header: '[models]',
          lines: ['', '[models]', `default = ${JSON.stringify(BYOK_ID)}`],
        },
      ];
  const byokTable = [
    '',
    `[model.${BYOK_ID}]`,
    `model = ${JSON.stringify(model)}`,
    `base_url = ${JSON.stringify(baseUrl)}`,
    `name = ${JSON.stringify(BYOK_NAME)}`,
    `api_key = ${JSON.stringify(apiKey)}`,
    'api_backend = "chat_completions"',
    `context_window = ${BYOK_CONTEXT}`,
    '',
  ];

  await mkdir(dirname(configFile), { recursive: true });
  await writeFile(
    configFile,
    [...withDefault.flatMap(({ lines }) => lines), ...byokTable].join('\n')
  );
  await chmod(configFile, 0o600);
};

const openCodeOneProvider = (
  config: JsonObject,
  baseUrl: string,
  apiKey: string,
  model: string
): JsonObject => ({
  ...config,
  model: `${BYOK_ID}/${model}`,
  provider: {
    ...objectAt(config, 'provider'),
    [BYOK_ID]: {
      npm: '@ai-sdk/openai-compatible',
      name: BYOK_NAME,
      options: { baseURL: baseUrl, apiKey },
      models: {
        [model]: {
          name: model,
          tool_call: true,
          limit: { context: BYOK_CONTEXT, output: BYOK_OUTPUT },
        },
      },
    },
  },
});

const openCodeTwoProvider = (
  config: JsonObject,
  baseUrl: string,
  apiKey: string,
  model: string
): JsonObject => ({
  ...config,
  model: { providerID: BYOK_ID, model },
  providers: {
    ...objectAt(config, 'providers'),
    [BYOK_ID]: {
      name: BYOK_NAME,
      package: '@opencode/ai/providers/openai-compatible',
      settings: { baseURL: baseUrl, apiKey },
      models: {
        [model]: {
          name: model,
          capabilities: { tools: true, input: ['text'], output: ['text'] },
          limit: { context: BYOK_CONTEXT, output: BYOK_OUTPUT },
        },
      },
    },
  },
});

const configureOpenCode = (
  configFile: string,
  major: string,
  baseUrl: string,
  apiKey: string,
  model: string
) =>
  mergePrivateJson(configFile, (config) =>
    major === '1'
      ? openCodeOneProvider(config, baseUrl, apiKey, model)
      : openCodeTwoProvider(config, baseUrl, apiKey, model)
  );

const configurePi = (
  modelsFile: string,
  baseUrl: string,
  apiKey: string,
  model: string
) =>
  mergePrivateJson(modelsFile, (models) => ({
    ...models,
    providers: {
      ...objectAt(models, 'providers'),
      [BYOK_ID]: {
        name: BYOK_NAME,
        baseUrl,
        api: 'openai-completions',
        apiKey,
        models: [
          {
            id: model,
            name: model,
            contextWindow: BYOK_CONTEXT,
            maxTokens: BYOK_OUTPUT,
          },
        ],
      },
    },
  }));

const clearDroid = (settings: JsonObject): JsonObject => ({
  ...settings,
  customModels: listAt(settings, 'customModels').filter(
    (entry) => !isByokModel(entry)
  ),
  sessionDefaultSettings:
    objectAt(settings, 'sessionDefaultSettings').model === BYOK_MODEL
      ? withoutKey(settings.sessionDefaultSettings, 'model')
      : settings.sessionDefaultSettings,
});

const clearOpenCode = (config: JsonObject): JsonObject => {
  const ownModel =
    objectAt(config, 'model').providerID === BYOK_ID ||
    String(config.model).startsWith(`${BYOK_ID}/`);
  const cleared = Object.fromEntries(
    Object.entries(config).map(([key, value]) =>
      key === 'provider' || key === 'providers'
        ? [key, withoutKey(value, BYOK_ID)]
        : [key, value]
    )
  );

  return ownModel ? withoutKey(cleared, 'model') : cleared;
};

const clearPi = (models: JsonObject): JsonObject => ({
  ...models,
  providers: withoutKey(models.providers, BYOK_ID),
});

const clearQwen = (settings: JsonObject): JsonObject => {
  const security = objectAt(settings, 'security');

  if (objectAt(security, 'auth').selectedType !== 'openai') return settings;

  return {
    ...settings,
    security: { ...security, auth: withoutKey(security.auth, 'selectedType') },
  };
};

const isByokDefault = (line: string): boolean =>
  line.replace(/\s/g, '') === `default=${JSON.stringify(BYOK_ID)}`;

const clearGrok = async (configFile: string): Promise<void> => {
  const tables = splitTables(await readFile(configFile, 'utf8'))
    .filter(({ header }) => header !== `[model.${BYOK_ID}]`)
    .map((table) =>
      table.header === '[models]'
        ? {
            ...table,
            lines: table.lines.filter((line) => !isByokDefault(line)),
          }
        : table
    )
    .filter(
      ({ header, lines }) =>
        header !== '[models]' || lines.slice(1).some((line) => line.trim())
    );

  await writeFile(configFile, tables.flatMap(({ lines }) => lines).join('\n'));
};

const JSON_CLEARERS: Record<string, (current: JsonObject) => JsonObject> = {
  droid: clearDroid,
  opencode: clearOpenCode,
  pi: clearPi,
  qwen: clearQwen,
};

const clearByok = async (agent: string, file: string): Promise<void> => {
  if (!(await pathExists(file))) return;
  if (agent === 'grok') return clearGrok(file);
  if (!Object.hasOwn(JSON_CLEARERS, agent)) return;

  return mergePrivateJson(file, JSON_CLEARERS[agent]);
};

const pointMarketplaceAt = async (
  source: string,
  target: string,
  url: string
): Promise<void> => {
  const marketplace = await readJson(source);

  await writeJson(target, {
    ...marketplace,
    plugins: listAt(marketplace, 'plugins').map((plugin) => ({
      ...asObject(plugin),
      source: { ...objectAt(plugin, 'source'), url },
    })),
  });
};

const stampManifest = async (path: string, version: string): Promise<void> => {
  if (!(await pathExists(path))) return;

  await writeJson(path, { ...(await readJson(path)), version });
};

const stampPackage = async (folder: string, version: string): Promise<void> => {
  await Promise.all(
    ['package.json', 'qwen-extension.json'].map((file) =>
      stampManifest(join(folder, file), version)
    )
  );
};

const switchExtensionServer = async (
  manifestFile: string,
  state: string
): Promise<void> => {
  const saved = `${manifestFile}.server-on`;

  if (state === 'on') {
    if (await pathExists(saved)) await rename(saved, manifestFile);
    return;
  }

  if (await pathExists(saved)) return;

  const manifest = await readJson(manifestFile);

  await writeFile(saved, await readFile(manifestFile));
  await writeJson(manifestFile, withoutKey(manifest, 'mcpServers'));
};

const pluginListKey = (major: string): string =>
  major === '1' ? 'plugin' : 'plugins';

const clearOpenCodePlugin = async (
  configFile: string,
  major: string
): Promise<void> => {
  const config = await readJson(configFile);
  const key = pluginListKey(major);

  await writeJson(configFile, {
    ...config,
    [key]: listAt(config, key).filter((spec) => !isLagune(spec)),
  });
};

const isEngineTool = (name: unknown): boolean =>
  typeof name === 'string' && ENGINE_TOOLS.includes(name);

const switchOpenCodeOneTools = (config: JsonObject, state: string) => {
  const kept = Object.entries(objectAt(config, 'permission')).filter(
    ([tool]) => !isEngineTool(tool)
  );
  const denied = ENGINE_TOOLS.map((tool) => [tool, 'deny']);

  return {
    ...config,
    permission: Object.fromEntries(
      state === 'off' ? [...kept, ...denied] : kept
    ),
  };
};

const switchOpenCodeTwoTools = (config: JsonObject, state: string) => {
  const kept = listAt(config, 'permissions').filter(
    (rule) => !isObject(rule) || !isEngineTool(rule.action)
  );
  const denied = ENGINE_TOOLS.map((action) => ({
    action,
    resource: '*',
    effect: 'deny',
  }));

  return {
    ...config,
    permissions: state === 'off' ? [...kept, ...denied] : kept,
  };
};

const switchOpenCodeTools = async (
  configFile: string,
  major: string,
  state: string
): Promise<void> => {
  const config = await readJson(configFile);

  await writeJson(
    configFile,
    major === '1'
      ? switchOpenCodeOneTools(config, state)
      : switchOpenCodeTwoTools(config, state)
  );
};

const probeServer = (
  command: string,
  probe: string,
  log: string,
  name: string,
  variables: string[] = []
): ProbeServer => ({
  command,
  args: [
    probe,
    '--log',
    log,
    '--name',
    name,
    ...(variables.length > 0 ? ['--vars', ...variables] : []),
  ],
});

const writeProbePlugin = async (
  agent: string,
  folder: string,
  node: string,
  probe: string,
  log: string
): Promise<void> => {
  const description =
    'Logs the folder, variables, and MCP roots a plugin server receives.';
  const plain = probeServer(node, probe, log, 'probe-plain');
  const withVariables = probeServer(
    node,
    probe,
    log,
    'probe-vars',
    PROBE_VARIABLES
  );
  const byName = probeServer('node', probe, log, 'probe-node');

  if (agent === 'copilot') {
    await writeJson(join(folder, '.plugin/plugin.json'), {
      name: 'lagune-probe',
      version: '0.0.0',
      description,
    });
    await writeJson(join(folder, '.plugin/marketplace.json'), {
      name: 'lagune-probe',
      owner: { name: 'Lagune playground' },
      plugins: [{ name: 'lagune-probe', source: './' }],
    });
    await writeJson(join(folder, '.mcp.json'), {
      mcpServers: { 'probe-plain': plain, 'probe-vars': withVariables },
    });
    return;
  }

  await writeJson(join(folder, '.kimi-plugin/plugin.json'), {
    name: 'lagune-probe',
    version: '0.0.0',
    description,
    mcpServers: {
      'probe-plain': plain,
      'probe-vars': withVariables,
      'probe-node': byName,
    },
  });
};

const OPERATIONS: Record<string, Operation> = {
  'select-auth': selectAuth,
  'byok-droid': configureDroid,
  'byok-grok': configureGrok,
  'byok-opencode': configureOpenCode,
  'byok-pi': configurePi,
  'clear-byok': clearByok,
  'droid-marketplace': pointMarketplaceAt,
  'stamp-package': stampPackage,
  'extension-server': switchExtensionServer,
  'opencode-clear': clearOpenCodePlugin,
  'opencode-tools': switchOpenCodeTools,
  'probe-plugin': writeProbePlugin,
};

const [operation = '', ...values] = process.argv.slice(2);

if (!Object.hasOwn(OPERATIONS, operation)) {
  process.stderr.write(
    `Unknown operation: ${operation}. Use one of ${Object.keys(OPERATIONS).join(', ')}.\n`
  );
  process.exit(1);
}

await OPERATIONS[operation](...values);
