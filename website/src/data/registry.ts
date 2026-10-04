/*
 * Static mirrors of the package's own registries, kept plain-data so the
 * whole site can consume them without pulling in React. When one of the
 * sources below changes, reconcile the matching list here:
 *
 * - AGENT_SPECS in ../../../src/providers/registry.ts -> ALL_AGENTS
 * - SKILL_GROUPS in ../../../src/hooks/skills/groups.ts -> ALL_CATEGORIES
 */

export type Agent = {
  key: string;
  name: string;
  icon: string;
};

export type AgentEntry = Pick<Agent, 'key' | 'name'> &
  Partial<Pick<Agent, 'icon'>>;

export type Category = {
  key: string;
  name: string;
  desc: string;
  icon: string;
};

// The agents surfaced directly in the install grid; the rest fold into "more".
export const AGENTS: Agent[] = [
  { key: 'claude', name: 'Claude Code', icon: '/img/icons/claude.svg' },
  { key: 'codex', name: 'Codex CLI', icon: '/img/icons/codex.svg' },
  { key: 'cursor-agent', name: 'Cursor', icon: '/img/icons/cursor.svg' },
  { key: 'agy', name: 'Antigravity', icon: '/img/icons/antigravity.svg' },
  { key: 'copilot', name: 'GitHub Copilot', icon: '/img/icons/copilot.svg' },
];

export const ALL_AGENTS: AgentEntry[] = [
  { key: 'adal', name: 'AdaL', icon: '/img/icons/adal.svg' },
  { key: 'aiderdesk', name: 'AiderDesk', icon: '/img/icons/aiderdesk.svg' },
  {
    key: 'amazonq',
    name: 'Amazon Q Developer',
    icon: '/img/icons/amazonq.svg',
  },
  { key: 'amp', name: 'Amp', icon: '/img/icons/amp.svg' },
  { key: 'agy', name: 'Antigravity', icon: '/img/icons/antigravity.svg' },
  { key: 'astrbot', name: 'AstrBot', icon: '/img/icons/astrbot.svg' },
  { key: 'auggie', name: 'Auggie CLI', icon: '/img/icons/auggie.svg' },
  {
    key: 'autohand',
    name: 'Autohand Code CLI',
    icon: '/img/icons/autohand.svg',
  },
  { key: 'claude', name: 'Claude Code', icon: '/img/icons/claude.svg' },
  { key: 'cline', name: 'Cline', icon: '/img/icons/cline.svg' },
  { key: 'codestudio', name: 'Code Studio', icon: '/img/icons/codestudio.svg' },
  { key: 'coco', name: 'Snowflake CoCo', icon: '/img/icons/snowflake.svg' },
  {
    key: 'codearts',
    name: 'CodeArts Agent (Huawei)',
    icon: '/img/icons/huawei.svg',
  },
  { key: 'codebuddy', name: 'CodeBuddy CLI', icon: '/img/icons/codebuddy.svg' },
  { key: 'codemaker', name: 'Codemaker', icon: '/img/icons/codemaker.svg' },
  { key: 'codex', name: 'Codex CLI', icon: '/img/icons/codex.svg' },
  {
    key: 'commandcode',
    name: 'Command Code',
    icon: '/img/icons/commandcode.svg',
  },
  { key: 'continue', name: 'Continue', icon: '/img/icons/continue.svg' },
  {
    key: 'cortex',
    name: 'Cortex Code (Snowflake)',
    icon: '/img/icons/snowflake.svg',
  },
  { key: 'costrict', name: 'CoStrict', icon: '/img/icons/costrict.svg' },
  { key: 'crush', name: 'Crush', icon: '/img/icons/crush.svg' },
  { key: 'cursor-agent', name: 'Cursor', icon: '/img/icons/cursor.svg' },
  {
    key: 'deepagents',
    name: 'Deep Agents (LangChain)',
    icon: '/img/icons/deepagents.svg',
  },
  { key: 'devin', name: 'Devin for Terminal', icon: '/img/icons/devin.svg' },
  { key: 'devin-desktop', name: 'Devin Desktop', icon: '/img/icons/devin.svg' },
  { key: 'dexto', name: 'Dexto', icon: '/img/icons/dexto.svg' },
  { key: 'eve', name: 'Eve', icon: '/img/icons/eve.svg' },
  { key: 'factory', name: 'Factory Droid', icon: '/img/icons/droid.svg' },
  { key: 'firebender', name: 'Firebender', icon: '/img/icons/firebender.svg' },
  { key: 'forge', name: 'Forge', icon: '/img/icons/forge.svg' },
  { key: 'forgecode', name: 'ForgeCode', icon: '/img/icons/forge.svg' },
  { key: 'gemini', name: 'Gemini CLI', icon: '/img/icons/gemini.svg' },
  { key: 'copilot', name: 'GitHub Copilot', icon: '/img/icons/copilot.svg' },
  { key: 'goose', name: 'Goose', icon: '/img/icons/goose.svg' },
  { key: 'hermes', name: 'Hermes', icon: '/img/icons/hermes.svg' },
  { key: 'bob', name: 'IBM Bob', icon: '/img/icons/bob.svg' },
  { key: 'iflow', name: 'iFlow CLI', icon: '/img/icons/iflow.svg' },
  {
    key: 'inferencesh',
    name: 'inference.sh',
    icon: '/img/icons/inferencesh.svg',
  },
  { key: 'jazz', name: 'Jazz', icon: '/img/icons/jazz.svg' },
  { key: 'junie', name: 'Junie', icon: '/img/icons/junie.svg' },
  { key: 'kilocode', name: 'Kilo Code', icon: '/img/icons/kilo.svg' },
  { key: 'kimi', name: 'Kimi Code', icon: '/img/icons/kimi.svg' },
  { key: 'kiro-cli', name: 'Kiro CLI', icon: '/img/icons/kiro-cli.svg' },
  { key: 'kode', name: 'Kode', icon: '/img/icons/kode.svg' },
  { key: 'lingma', name: 'Lingma', icon: '/img/icons/lingma.svg' },
  { key: 'loaf', name: 'Loaf', icon: '/img/icons/loaf.svg' },
  { key: 'mcpjam', name: 'MCPJam', icon: '/img/icons/mcpjam.svg' },
  { key: 'vibe', name: 'Mistral Vibe', icon: '/img/icons/vibe.svg' },
  { key: 'moxby', name: 'Moxby', icon: '/img/icons/moxby.svg' },
  { key: 'muse', name: 'Muse Code', icon: '/img/icons/muse.svg' },
  { key: 'mux', name: 'Mux', icon: '/img/icons/mux.svg' },
  { key: 'neovate', name: 'Neovate', icon: '/img/icons/neovate.svg' },
  { key: 'ona', name: 'Ona', icon: '/img/icons/ona.svg' },
  { key: 'openclaw', name: 'OpenClaw', icon: '/img/icons/openclaw.svg' },
  { key: 'opencode', name: 'opencode', icon: '/img/icons/opencode.svg' },
  { key: 'openhands', name: 'OpenHands', icon: '/img/icons/openhands.svg' },
  { key: 'pi', name: 'Pi Coding Agent', icon: '/img/icons/pi.svg' },
  { key: 'pochi', name: 'Pochi', icon: '/img/icons/pochi.svg' },
  {
    key: 'promptscript',
    name: 'PromptScript',
    icon: '/img/icons/promptscript.svg',
  },
  { key: 'qoder-cn', name: 'Qoder CN', icon: '/img/icons/qodercli.svg' },
  { key: 'qodercli', name: 'Qoder CLI', icon: '/img/icons/qodercli.svg' },
  { key: 'qwen', name: 'Qwen Code', icon: '/img/icons/qwen.svg' },
  { key: 'reasonix', name: 'Reasonix', icon: '/img/icons/reasonix.svg' },
  { key: 'replit', name: 'Replit', icon: '/img/icons/replit.svg' },
  { key: 'roo', name: 'Roo Code', icon: '/img/icons/roo.svg' },
  { key: 'rovodev', name: 'RovoDev ACLI', icon: '/img/icons/rovodev.svg' },
  { key: 'shai', name: 'SHAI (OVHcloud)', icon: '/img/icons/ovhcloud.svg' },
  { key: 'tabnine', name: 'Tabnine CLI', icon: '/img/icons/tabnine.svg' },
  { key: 'terramind', name: 'Terramind', icon: '/img/icons/terramind.svg' },
  { key: 'tinycloud', name: 'Tinycloud', icon: '/img/icons/tinycloud.svg' },
  { key: 'trae', name: 'Trae', icon: '/img/icons/trae.svg' },
  { key: 'warp', name: 'Warp', icon: '/img/icons/warp.svg' },
  { key: 'windsurf', name: 'Windsurf', icon: '/img/icons/windsurf.svg' },
  { key: 'xum', name: 'Xum', icon: '/img/icons/mux.svg' },
  { key: 'zcode', name: 'ZCode', icon: '/img/icons/zcode.svg' },
  { key: 'zed', name: 'Zed', icon: '/img/icons/zed.svg' },
  { key: 'zencoder', name: 'Zencoder', icon: '/img/icons/zencoder.svg' },
  { key: 'zenflow', name: 'Zenflow', icon: '/img/icons/zencoder.svg' },
];

export const ALL_CATEGORIES: Category[] = [
  {
    key: 'owasp',
    name: 'OWASP',
    desc: 'Harden against the application security risks OWASP tracks: injection, broken access control, auth, and crypto failures',
    icon: '/img/icons/owasp.svg',
  },
  {
    key: 'infra',
    name: 'Infrastructure',
    desc: 'Harden container, workload, and serverless config: Dockerfile, Compose, Pod security, FaaS IAM and triggers',
    icon: '/img/icons/kubernetes.svg',
  },
  {
    key: 'ai',
    name: 'AI / LLM',
    desc: 'Harden AI and LLM integrations against prompt injection and unsafe tool, agent, retrieval, and MCP wiring',
    icon: '/img/icons/ai.svg',
  },
  {
    key: 'lovable',
    name: 'Lovable',
    desc: 'Harden AI-generated Supabase apps (Lovable and similar): RLS gaps, leaked service_role keys, and insecure defaults',
    icon: '/img/icons/lovable.svg',
  },
  {
    key: 'javascript',
    name: 'JavaScript',
    desc: 'Harden JavaScript and its runtimes against eval and child_process RCE, path traversal, and prototype pollution',
    icon: '/img/icons/javascript.svg',
  },
  {
    key: 'python',
    name: 'Python',
    desc: 'Harden Python against pickle and YAML deserialization RCE, str.format string traversal, and class pollution',
    icon: '/img/icons/python.svg',
  },
  {
    key: 'rust',
    name: 'Rust',
    desc: 'Harden Rust against unsound unsafe APIs, transmute misuse, integer overflow, and FFI boundary undefined behavior',
    icon: '/img/icons/rust.svg',
  },
  {
    key: 'c-cpp',
    name: 'C / C++',
    desc: 'Harden C and C++ against format-string bugs, buffer overflows, and out-of-bounds writes that enable code execution',
    icon: '/img/icons/cpp.svg',
  },
  {
    key: 'php',
    name: 'PHP',
    desc: 'Harden PHP against type-juggling auth bypass, object injection gadget chains, and insecure configuration defaults',
    icon: '/img/icons/php.svg',
  },
  {
    key: 'go',
    name: 'Go',
    desc: 'Harden Go against typed-nil interface bugs, goroutine data races, and unsafe concurrency on security paths',
    icon: '/img/icons/go.svg',
  },
  {
    key: 'java',
    name: 'Java',
    desc: 'Harden Java against ObjectInputStream deserialization gadget chains that culminate in remote code execution',
    icon: '/img/icons/java.svg',
  },
  {
    key: 'ruby',
    name: 'Ruby',
    desc: 'Harden Ruby against Marshal.load and YAML deserialization gadget chains that reach remote code execution',
    icon: '/img/icons/ruby.svg',
  },
  {
    key: 'dotnet',
    name: '.NET',
    desc: 'Harden .NET and C# against BinaryFormatter deserialization RCE and the encoder bypasses that reach XSS',
    icon: '/img/icons/dot-net.svg',
  },
];
