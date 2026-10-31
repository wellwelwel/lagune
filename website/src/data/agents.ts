export type Agent = {
  name: string;
  icon: string;
};

export type FeaturedAgent = Agent & {
  description: string;
  install: string;
};

export const UNIVERSAL_INSTALL = '/docs/install/universal';

export const SKILLS_SH: Agent = {
  name: 'skills.sh',
  icon: '/img/icons/skills.svg',
};

export const FEATURED_AGENTS: FeaturedAgent[] = [
  {
    name: 'Claude Code',
    description: "Anthropic's agentic coding tool",
    icon: '/img/icons/claude.svg',
    install: '/docs/install/claude-code',
  },
  {
    name: 'Codex',
    description: "OpenAI's coding agent",
    icon: '/img/icons/codex.svg',
    install: UNIVERSAL_INSTALL,
  },
  {
    name: 'Cursor',
    description: 'The AI code editor',
    icon: '/img/icons/cursor.svg',
    install: '/docs/install/cursor',
  },
  {
    name: 'GitHub Copilot',
    description: "GitHub's AI pair programmer",
    icon: '/img/icons/copilot.svg',
    install: '/docs/install/github-copilot-cli',
  },
  {
    name: 'Gemini CLI',
    description: "Google's open-source terminal agent",
    icon: '/img/icons/gemini.svg',
    install: '/docs/install/gemini-cli',
  },
  {
    name: 'Antigravity',
    description: "Google's agentic development platform",
    icon: '/img/icons/antigravity.svg',
    install: '/docs/install/antigravity-cli',
  },
  {
    name: 'OpenCode',
    description: 'The open-source coding agent',
    icon: '/img/icons/opencode.svg',
    install: UNIVERSAL_INSTALL,
  },
  {
    name: 'Devin for Terminal',
    description: "Cognition's terminal agent",
    icon: '/img/icons/devin.svg',
    install: UNIVERSAL_INSTALL,
  },
  {
    name: 'Factory Droid',
    description: "Factory's software development agent",
    icon: '/img/icons/droid.svg',
    install: UNIVERSAL_INSTALL,
  },
  {
    name: 'Grok Build',
    description: "xAI's coding agent",
    icon: '/img/icons/grok.svg',
    install: UNIVERSAL_INSTALL,
  },
  {
    name: 'Qwen Code',
    description: "Qwen's terminal coding agent",
    icon: '/img/icons/qwen.svg',
    install: '/docs/install/qwen-code',
  },
  {
    name: 'Kimi Code',
    description: "Moonshot AI's coding agent",
    icon: '/img/icons/kimi.svg',
    install: UNIVERSAL_INSTALL,
  },
  {
    name: 'Muse Code',
    description: "Meta's coding agent",
    icon: '/img/icons/muse.svg',
    install: '/docs/install/muse-code',
  },
  {
    name: 'Pi',
    description: 'A minimal terminal coding agent',
    icon: '/img/icons/pi.svg',
    install: '/docs/install/pi',
  },
  {
    name: 'Hermes Agent',
    description: "Nous Research's open-source agent",
    icon: '/img/icons/hermes.svg',
    install: UNIVERSAL_INSTALL,
  },
];

export const UNIVERSAL_AGENTS: Agent[] = [
  { name: 'AdaL', icon: '/img/icons/adal.svg' },
  { name: 'AiderDesk', icon: '/img/icons/aiderdesk.svg' },
  { name: 'Amazon Q Developer', icon: '/img/icons/amazonq.svg' },
  { name: 'Amp', icon: '/img/icons/amp.svg' },
  { name: 'AstrBot', icon: '/img/icons/astrbot.svg' },
  { name: 'Auggie CLI', icon: '/img/icons/auggie.svg' },
  { name: 'Autohand Code CLI', icon: '/img/icons/autohand.svg' },
  { name: 'Cline', icon: '/img/icons/cline.svg' },
  { name: 'Code Studio', icon: '/img/icons/codestudio.svg' },
  { name: 'CodeArts Agent (Huawei)', icon: '/img/icons/huawei.svg' },
  { name: 'CodeBuddy CLI', icon: '/img/icons/codebuddy.svg' },
  { name: 'Codemaker', icon: '/img/icons/codemaker.svg' },
  { name: 'Command Code', icon: '/img/icons/commandcode.svg' },
  { name: 'Continue', icon: '/img/icons/continue.svg' },
  { name: 'Cortex Code (Snowflake)', icon: '/img/icons/snowflake.svg' },
  { name: 'CoStrict', icon: '/img/icons/costrict.svg' },
  { name: 'Crush', icon: '/img/icons/crush.svg' },
  { name: 'Deep Agents (LangChain)', icon: '/img/icons/deepagents.svg' },
  { name: 'Devin Desktop', icon: '/img/icons/devin.svg' },
  { name: 'Dexto', icon: '/img/icons/dexto.svg' },
  { name: 'Eve', icon: '/img/icons/eve.svg' },
  { name: 'Firebender', icon: '/img/icons/firebender.svg' },
  { name: 'Forge', icon: '/img/icons/forge.svg' },
  { name: 'ForgeCode', icon: '/img/icons/forge.svg' },
  { name: 'fx', icon: '/img/icons/fx.svg' },
  { name: 'Goose', icon: '/img/icons/goose.svg' },
  { name: 'IBM Bob', icon: '/img/icons/bob.svg' },
  { name: 'iFlow CLI', icon: '/img/icons/iflow.svg' },
  { name: 'inference.sh', icon: '/img/icons/inferencesh.svg' },
  { name: 'Jazz', icon: '/img/icons/jazz.svg' },
  { name: 'Junie', icon: '/img/icons/junie.svg' },
  { name: 'Kilo Code', icon: '/img/icons/kilo.svg' },
  { name: 'Kimchi', icon: '/img/icons/kimchi.svg' },
  { name: 'Kiro CLI', icon: '/img/icons/kiro-cli.svg' },
  { name: 'Kode', icon: '/img/icons/kode.svg' },
  { name: 'Lingma', icon: '/img/icons/lingma.svg' },
  { name: 'Loaf', icon: '/img/icons/loaf.svg' },
  { name: 'MCPJam', icon: '/img/icons/mcpjam.svg' },
  { name: 'MiniMax Code', icon: '/img/icons/minimax.svg' },
  { name: 'Mistral Vibe', icon: '/img/icons/vibe.svg' },
  { name: 'Moxby', icon: '/img/icons/moxby.svg' },
  { name: 'Mux', icon: '/img/icons/mux.svg' },
  { name: 'Neovate', icon: '/img/icons/neovate.svg' },
  { name: 'Ona', icon: '/img/icons/ona.svg' },
  { name: 'OpenClaw', icon: '/img/icons/openclaw.svg' },
  { name: 'OpenHands', icon: '/img/icons/openhands.svg' },
  { name: 'Pochi', icon: '/img/icons/pochi.svg' },
  { name: 'Posit Assistant', icon: '/img/icons/posit.svg' },
  { name: 'PromptScript', icon: '/img/icons/promptscript.svg' },
  { name: 'Qoder CLI', icon: '/img/icons/qodercli.svg' },
  { name: 'Qoder CN', icon: '/img/icons/qodercli.svg' },
  { name: 'Reasonix', icon: '/img/icons/reasonix.svg' },
  { name: 'Replit', icon: '/img/icons/replit.svg' },
  { name: 'Roo Code', icon: '/img/icons/roo.svg' },
  { name: 'RovoDev ACLI', icon: '/img/icons/rovodev.svg' },
  { name: 'Sarvam Code', icon: '/img/icons/sarvam.svg' },
  { name: 'SHAI (OVHcloud)', icon: '/img/icons/ovhcloud.svg' },
  { name: 'Snowflake CoCo', icon: '/img/icons/snowflake.svg' },
  { name: 'Tabnine CLI', icon: '/img/icons/tabnine.svg' },
  { name: 'Terramind', icon: '/img/icons/terramind.svg' },
  { name: 'Tinycloud', icon: '/img/icons/tinycloud.svg' },
  { name: 'Trae', icon: '/img/icons/trae.svg' },
  { name: 'Trae CN', icon: '/img/icons/trae.svg' },
  { name: 'Warp', icon: '/img/icons/warp.svg' },
  { name: 'Windsurf', icon: '/img/icons/windsurf.svg' },
  { name: 'Xum', icon: '/img/icons/mux.svg' },
  { name: 'ZCode', icon: '/img/icons/zcode.svg' },
  { name: 'Zed', icon: '/img/icons/zed.svg' },
  { name: 'Zencoder', icon: '/img/icons/zencoder.svg' },
  { name: 'Zenflow', icon: '/img/icons/zencoder.svg' },
];

const HIGHLIGHTED_NAMES = ['Cline', 'Windsurf', 'Kiro CLI', 'Zed'];

export const UNIVERSAL_HIGHLIGHTS = UNIVERSAL_AGENTS.filter((agent) =>
  HIGHLIGHTED_NAMES.includes(agent.name)
);

export const UNIVERSAL_SUMMARY = `${UNIVERSAL_HIGHLIGHTS.map((agent) => agent.name).join(', ')} & ${UNIVERSAL_AGENTS.length - UNIVERSAL_HIGHLIGHTS.length} more`;
