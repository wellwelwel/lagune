import type { createMotion } from './motion';

export type IconName =
  | 'rust'
  | 'database'
  | 'image'
  | 'signup'
  | 'graduation-cap'
  | 'bot'
  | 'check'
  | 'paperclip'
  | 'square-pen'
  | 'claude'
  | 'codex'
  | 'antigravity'
  | 'cursor'
  | 'opencode'
  | 'muse'
  | 'copilot'
  | 'devin'
  | 'grok'
  | 'vercel'
  | 'pi'
  | 'qwen'
  | 'kimi'
  | 'github'
  | 'star-outline'
  | 'star';

export type IconSymbol = {
  attributes: string;
  body: string;
  viewBox?: string;
  definitions?: string[];
};

export type Agent = {
  name: string;
  icon: IconName;
};

export type Tone = 'accent' | 'success' | 'danger';

export type StepRun = {
  tone: Tone;
  note: string;
};

export type Row =
  | { kind: 'detected'; icon: IconName; name: string }
  | { kind: 'specialization'; name: string; note: string }
  | { kind: 'step'; name: string; runs: StepRun[] };

export type StepRow = Extract<Row, { kind: 'step' }>;

export type Closing = 'principles' | 'building' | 'rest';

export type Session = {
  tab: string;
  agent: Agent;
  prompt: string[];
  heading: string;
  thinking: number;
  pace: number;
  hold: number;
  closing: Closing;
  rows: Row[];
};

export type RunTiming = {
  start: number;
  finish: number;
};

export type QueuedRun = {
  rowIndex: number;
  runIndex: number;
};

export type SessionTiming = {
  opens: number;
  type: number;
  lines: number[];
  typed: number;
  send: number;
  think: number;
  answer: number;
  rowRuns: RunTiming[][];
  closing: number;
  leaves: number;
};

export type Outro = {
  tab: string;
  agent: Agent;
  lead: string;
  trail: string;
  agents: Agent[];
};

export type OutroTiming = {
  opens: number;
  type: number;
  typed: number;
  swaps: number[];
  click: number;
  back: number;
};

export type Timeline = {
  sessions: SessionTiming[];
  outro: OutroTiming;
  cycle: number;
  fade: number;
  reset: number;
};

export type Stop = {
  at: number;
  style: string;
  easing?: string;
};

export type Animation = {
  name: string;
  stops: Stop[];
};

export type Fragment = {
  markup: string;
  animations: Animation[];
};

export type MotionStates = {
  hidden: string;
  shown: string;
};

export type VisibilityWindow = {
  from: number;
  to: number;
  fadeIn?: number;
  fadeOut?: number;
};

export type Press = {
  scale: string;
  start: number;
  peak: number;
  end: number;
};

export type Motion = ReturnType<typeof createMotion>;

export type FlowContext = {
  sessions: Session[];
  outro: Outro;
  timeline: Timeline;
  motion: Motion;
};

export type ClosingPlacement = {
  prefix: string;
  top: number;
  at: number;
  motion: Motion;
};

export type TabEntry = {
  label: string;
  icon: IconName;
  iconClass: string;
  opens: number;
};

export type TabGeometry = {
  x: number;
  width: number;
  labelWidth: number;
};

export type RowPlacement = {
  prefix: string;
  top: number;
  runs: RunTiming[];
  motion: Motion;
};

export type ChipSegment = {
  agent: Agent;
  from: number;
  to: number;
};

export type TypingSpan = {
  start: number;
  end: number;
  until: number;
};

export type Reveal = {
  at: number;
  bottom: number;
};

export type Autoscroll = {
  animation: Animation;
  rest: string;
};

export type AnswerLayout = {
  bubbleHeight: number;
  blockTop: number;
  rowTops: number[];
  closingTop: number;
};
