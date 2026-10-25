import type { CategoryKey } from '../categories.js';
import type { Finding, PhaseName, Severity } from './dashboard.js';

export type RouteScope =
  | 'overview'
  | 'findings'
  | 'sidequests'
  | 'charter'
  | 'catalog'
  | 'history'
  | 'settings';

export type SeverityFilter = Severity | 'All';

export type FindingTreeRow = {
  finding: Finding;
  depth: number;
};

export type PhaseMeta = {
  label: string;
  blurb: string;
  icon: IconName;
  tile: string;
  dot: string;
  badge: string;
};

export type LoadStatus = 'loading' | 'ready' | 'error';

export type SpecializationIconName =
  | 'activity'
  | 'brain'
  | 'code'
  | 'cpu'
  | 'file'
  | 'globe'
  | 'key'
  | 'layers'
  | 'terminal'
  | 'upload';

export type IconName =
  | SpecializationIconName
  | 'grid'
  | 'shield'
  | 'shieldCheck'
  | 'charter'
  | 'search'
  | 'sun'
  | 'moon'
  | 'chevronRight'
  | 'chevronLeft'
  | 'arrowUpRight'
  | 'arrowRight'
  | 'arrowUp'
  | 'flame'
  | 'alertTriangle'
  | 'check'
  | 'checkCircle'
  | 'plus'
  | 'more'
  | 'link'
  | 'compass'
  | 'live'
  | 'wifiOn'
  | 'wifiOff'
  | 'github'
  | 'heart'
  | 'book'
  | 'star'
  | 'play'
  | 'package'
  | 'x'
  | 'arrowLeft'
  | 'settings'
  | 'pull'
  | 'refresh'
  | 'download'
  | 'graduationCap'
  | 'copy'
  | 'checkSquare'
  | 'square'
  | 'upgrade'
  | 'pullDown'
  | 'chat'
  | 'messageAi'
  | 'robot'
  | 'thumbsUp'
  | 'thumbsDown'
  | 'info'
  | 'bulb'
  | 'pencil'
  | 'save';

export type AdmonitionKind = 'note' | 'info' | 'tip' | 'warning' | 'danger';

export type AdmonitionTone = {
  icon: IconName;
  accent: string;
};

export type Theme = 'light' | 'dark';

export type TypeSegment = { text: string; bold?: boolean };

export type PromptModalContent = {
  eyebrow: string;
  eyebrowIcon: IconName;
  title: string;
  prompt: TypeSegment[];
};

export type PromptTone = 'neutral' | 'tip';

export type PromptSpec = {
  task: string;
  mention: string;
  readPath: string;
  reply: TypeSegment[];
  tone?: PromptTone;
};

export type AgentTheme = {
  key: string;
  name: string;
  icon: string;
  coloredIcon?: boolean;
  panel: string;
  ring: string;
  shadow: string;
  avatar: string;
  accent: string;
  cursor: string;
  readDot: string;
  userBubble: string;
  userText: string;
  userLabel: string;
  mention: string;
  agentName: string;
  readLabel: string;
  readPath: string;
  body: string;
  bodyStrong: string;
  actions: string;
  actionsHover: string;
};

export type VerdictKind = 'pending' | 'passed' | 'reproved' | 'inconclusive';

export type ChainView = {
  kind: AdmonitionKind;
  title: string;
  body: string;
  reason: string;
};

export type PhaseCommand = {
  key: string;
  label: string;
  icon: IconName;
  tone: string;
  command: string;
  purpose: string;
};

export type NextStep = 'Plan' | 'Harden' | 'Verify' | 'Stand down';

export type ChainStep = {
  phase: PhaseName;
  next: NextStep;
  kind: VerdictKind;
};

export type StepHint = {
  command: string;
  verb: string;
  eyebrow: string;
  eyebrowIcon: IconName;
  title: string;
};

export type HardenState = 'done' | 'active' | 'pending';

export type StepState = 'done' | 'active' | 'pending' | 'reproved';

export type Counts = {
  total: number;
  applied: number;
  verified: number;
};

export type PipelineStep = {
  label: string;
  detail: string;
  state: StepState;
};

export type Hotspot = {
  path: string;
  severities: Severity[];
};

export type Tone = {
  icon: string;
  value: string;
};

export type NavItem = {
  scope: RouteScope;
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
};

export type NavDirection = 'previous' | 'next';

export type Token =
  | { kind: 'text'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'em'; value: string }
  | { kind: 'strong'; value: string }
  | { kind: 'link'; value: string; href: string };

export type TokenMatch = {
  token: Exclude<Token, { kind: 'text' }>;
  length: number;
};

export type CategoryBadge = {
  key: CategoryKey;
  label: string;
  icon: string;
};

export type CategoryOption = {
  key: string;
  name: string;
  description: string;
  icon: string;
};

export type TabItem = {
  key: string;
  label: string;
  icon: IconName;
};

export type ActionRunState = 'idle' | 'pending' | 'success' | 'error';

export type RunButton = { icon: IconName; label: string };

export type ModalState = {
  kind: 'categories';
  run: ActionRunState;
  added: number;
  removed: number;
};

export type ActionModalHeader = {
  eyebrow: string;
  icon: IconName;
  title: string;
  subtitle: string;
};
