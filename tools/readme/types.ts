import type { createMotion } from './motion';

export type IconName =
  | 'spark'
  | 'rust'
  | 'database'
  | 'tenants'
  | 'signup'
  | 'shield'
  | 'target'
  | 'check'
  | 'arrow'
  | 'chat';

export type IconSymbol = {
  attributes: string;
  body: string;
};

export type Prompt = {
  command: string;
  text: string;
};

export type Row =
  | { kind: 'detected'; icon: IconName; name: string }
  | { kind: 'specialization'; name: string; note: string }
  | { kind: 'finding'; name: string; note: string };

export type Closing = 'ready' | 'building' | 'next';

export type Session = {
  tab: string;
  prompt: Prompt;
  heading: string;
  thinking: number;
  hold: number;
  closing: Closing;
  rows: Row[];
};

export type SessionTiming = {
  opens: number;
  type: number;
  typed: number;
  send: number;
  think: number;
  answer: number;
  rows: number[];
  closing: number;
  leaves: number;
};

export type Timeline = {
  sessions: SessionTiming[];
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

export type Motion = ReturnType<typeof createMotion>;

export type FlowContext = {
  sessions: Session[];
  timeline: Timeline;
  motion: Motion;
};

export type ClosingPlacement = {
  prefix: string;
  top: number;
  at: number;
  motion: Motion;
};
