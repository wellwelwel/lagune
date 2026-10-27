import type { LanguageId } from '../scan.js';

export type RegexSafetyOptions = {
  repetitionLimit?: number;
  flags?: string;
};

export type RegexVerdict = 'safe' | 'unsafe' | 'undetermined' | 'invalid regex';

export type MatchScope = 'search' | 'whole match';

export type JobScope = MatchScope | 'submatch';

export type RegexReason = { reason: string; scope: MatchScope | null };

export type RegexAssessment =
  | { verdict: 'safe' | 'invalid regex' }
  | ({ verdict: 'unsafe' | 'undetermined' } & RegexReason);

export type RankedReason = RegexReason & { rank: number };

export type WorkMeter = { cap: number; spent: number };

export type CodeSet = readonly number[];

export type Segment = { start: number; width: number; text: string };

export type CaseTable = {
  points: readonly number[];
  classes: ReadonlyMap<number, readonly number[]>;
};

export type MatchMode = {
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
};

export type PatternFlags = MatchMode & {
  unicode: boolean;
  sets: boolean;
  sticky: boolean;
};

export type AssertionTest = 'begin' | 'end' | 'word' | 'notWord';

export type Assertion = {
  test: AssertionTest;
  multiline: boolean;
  unicodeWord: boolean;
};

export type Quantifier = { min: number; max: number; lazy: boolean };

export type RepeatNode = { kind: 'repeat'; body: RegexNode } & Quantifier;

export type AssertionNode = { kind: 'assertion' } & Assertion;

export type LookNode = {
  kind: 'look';
  behind: boolean;
  negative: boolean;
  body: RegexNode;
};

export type RegexNode =
  | { kind: 'empty' }
  | { kind: 'char'; set: CodeSet }
  | { kind: 'sequence'; items: readonly RegexNode[] }
  | { kind: 'alternation'; branches: readonly RegexNode[] }
  | RepeatNode
  | AssertionNode
  | LookNode
  | { kind: 'backreference'; captures: readonly number[] }
  | { kind: 'uncertain'; body: RegexNode };

export type ClassValue = {
  chars: CodeSet;
  strings: readonly (readonly number[])[];
  approximate: boolean;
};

export type ParsedAtom = { value: ClassValue; point: number | null };

export type ParsedAtomNode = { node: RegexNode; quantifiable: boolean };

export type ParseCursor = {
  source: string;
  position: number;
  unicode: boolean;
  sets: boolean;
  namedGroups: boolean;
  captureTotal: number;
  nextCapture: number;
  names: ReadonlyMap<string, readonly number[]>;
  open: number[];
  captures: Map<number, RegexNode>;
  quantifiers: number;
};

export type ParsedPattern = {
  root: RegexNode;
  captures: ReadonlyMap<number, RegexNode>;
  flags: PatternFlags;
  quantifiers: number;
};

export type Direction = 'forward' | 'backward';

export type AutomatonJob = {
  root: RegexNode;
  captures: ReadonlyMap<number, RegexNode>;
  direction: Direction;
  flags: PatternFlags;
  scope: JobScope;
  meter: WorkMeter;
};

export type AutomatonShape = {
  searches: boolean;
  trails: boolean;
  keepsLines: boolean;
};

export type EpsilonTransition =
  | { type: 'split'; targets: readonly number[] }
  | ({ type: 'assert'; target: number } & Assertion)
  | {
      type: 'consume';
      set: number;
      target: number;
      context: number;
      certain: boolean;
      prefix: boolean;
    }
  | { type: 'enter'; loop: number; target: number }
  | { type: 'exit'; loop: number; target: number }
  | { type: 'doubt'; target: number }
  | { type: 'invoke'; look: number; target: number }
  | {
      type: 'recall';
      look: number;
      tracked: number;
      negative: boolean;
      target: number;
    }
  | { type: 'recalled'; tracked: number }
  | { type: 'gate'; look: number; negative: boolean; target: number }
  | { type: 'accept' }
  | { type: 'success'; context: number }
  | { type: 'dead' };

export type BuildScope = { context: number; certain: boolean };

export type Fragment = readonly [number, number];

export type SeparateLook = { body: RegexNode; direction: Direction };

export type GateLook = { start: number; context: number; depth: number };

export type EpsilonBuilder = {
  transitions: EpsilonTransition[];
  setIds: Map<string, number>;
  sets: CodeSet[];
  loops: number;
  contexts: number;
  looks: SeparateLook[];
  gates: GateLook[];
  captures: ReadonlyMap<number, RegexNode>;
  direction: Direction;
  keepsLines: boolean;
  copying: number[];
  universe: CodeSet;
  recalling: boolean;
  recalls: number[];
  meter: WorkMeter;
};

export type EpsilonAutomaton = {
  transitions: readonly EpsilonTransition[];
  start: number;
  startKinds: readonly number[];
  sets: readonly CodeSet[];
  looks: readonly SeparateLook[];
  gates: readonly GateLook[];
  recalls: readonly number[];
  kinds: number;
  universe: CodeSet;
};

export type Alphabet = {
  pieceSets: readonly CodeSet[];
  pieceKinds: readonly number[];
  setPieces: readonly (readonly number[])[];
  setKinds: readonly number[];
};

export type RecallItem = { state: number; allowed: number };

export type Past = {
  recalling: boolean;
  kinds: readonly number[];
  next: Int32Array;
  pieces: number;
  holds: readonly (readonly number[])[];
  starts: readonly number[];
  forgotten: number;
};

export type CompiledJob = {
  epsilon: EpsilonAutomaton;
  alphabet: Alphabet;
  past: Past;
};

export type ClosureGate = { look: number; negative: boolean; past: number };

export type ClosureItem =
  | {
      type: 'consume';
      state: number;
      kinds: number;
      certain: boolean;
      marks: readonly number[];
      gates: readonly ClosureGate[];
    }
  | { type: 'accept'; certain: boolean; gates: readonly ClosureGate[] }
  | {
      type: 'success';
      context: number;
      kinds: number;
      certain: boolean;
      gates: readonly ClosureGate[];
    };

export type ClosurePath = {
  state: number;
  allowed: number;
  loops: readonly number[];
  certain: boolean;
  marks: readonly number[];
  gates: readonly ClosureGate[];
};

export type StepGate = { state: number; negative: boolean; depth: number };

export type StepMove = {
  type: 'move';
  target: number;
  certain: boolean;
  context: number;
  prefix: boolean;
  gates: readonly StepGate[];
};

export type StepStop = {
  type: 'stop';
  context: number;
  gates: readonly StepGate[];
};

export type StepEvent = StepMove | StepStop;

export type StateExit = { kinds: number; gates: readonly StepGate[] };

export type GatedEdge = {
  source: number;
  target: number;
  gates: readonly StepGate[];
  depth: number;
};

export type OrderedState = {
  past: number;
  context: number;
  items: readonly ClosureItem[];
  marks: readonly number[];
  exits: StateExit[];
  events: Map<number, StepEvent[]>;
};

export type OrderedAutomaton = {
  states: readonly OrderedState[];
  starts: readonly number[];
};

export type Lookahead = {
  blind: boolean;
  classCount: number;
  pieces: number;
  predecessors: readonly (readonly number[])[];
  members: readonly ReadonlySet<number>[];
  back: Int32Array;
};

export type BackScratch = {
  marks: Int32Array;
  seen: Int32Array;
  generation: number;
};

export type ReverseReader = {
  plain: Map<number, number[]>[];
  gated: GatedEdge[][];
  start: number[];
};

export type Digraph = {
  size: number;
  offsets: Int32Array;
  targets: Int32Array;
  labels: Int32Array;
};

export type Components = {
  component: Int32Array;
  members: readonly (readonly number[])[];
};

export type ComponentLinks = { forward: number[][]; backward: number[][] };

export type Product = {
  graph: Digraph;
  wildcard: number;
};

export type NodeSteps = Map<number, Map<number, number[]>>;

export type GroupSteps = Map<number, NodeSteps>;

export type PieceClasses = ReadonlyMap<number, ReadonlySet<number>>;

export type KeyIndex = {
  count: number;
  keys: Float64Array;
  slots: Float64Array;
};

export type Exploration = {
  index: KeyIndex;
  sources: Int32Array;
  targets: Int32Array;
  edges: number;
  parts: Int32Array;
  meter: WorkMeter;
};

export type GrowthReport = { exponential: boolean; degree: number };

export type CaseSplit = {
  capture: number;
  position: number;
  strings: readonly (readonly CodeSet[])[];
};

export type JobReport = GrowthReport & { cyclicChars: CodeSet };

export type ScoreMoveTable = {
  entryOffsets: Int32Array;
  entryPieces: Int32Array;
  targetOffsets: Int32Array;
  targets: Int32Array;
  loopOffsets: Int32Array;
  loopPieces: Int32Array;
  loopTargets: Int32Array;
};

export type PairTable = {
  count: number;
  olders: Int32Array;
  youngers: Int32Array;
  lives: Int32Array;
  settled: Uint8Array;
  slots: Int32Array;
};

export type ScoreLayout = {
  ordered: OrderedAutomaton;
  alphabet: Alphabet;
  order: Int32Array;
  loopIndex: Int32Array;
  loopStates: readonly number[];
  stateCount: number;
  startLoops: readonly number[];
  startStates: readonly number[];
  startOrder: Int32Array;
  moves: WeakMap<Lookahead, Map<number, ScoreMoveTable>>;
  walks: WeakMap<Lookahead, Map<number, ScoreWalk>>;
  consulted: ReadonlySet<number> | undefined;
  reader: ReverseReader | undefined;
};

export type ScoreBundles = {
  gains: number[];
  sources: number[];
  targets: number[];
  multiplicities: number[];
  pieces: number[][];
};

export type ScoreGroups = {
  count: number;
  kinds: Uint8Array;
  sources: Int32Array;
  targets: Int32Array;
  multiplicities: Int32Array;
  pieces: Int32Array;
  lengths: Int32Array;
};

export type ScoreSegments = {
  count: number;
  starts: Int32Array;
  ends: Int32Array;
  offsets: Int32Array;
  members: Int32Array;
  openOffsets: Int32Array;
  openMembers: Int32Array;
};

export type ScoreWalk = {
  pieceCount: number;
  loopCount: number;
  groups: ScoreGroups;
  segments: ScoreSegments;
  sources: ScoreSegments;
  pieceSets: Uint8Array;
  pieceOffsets: Int32Array;
  pieceItems: Int32Array;
  loopClasses: Int32Array;
  loopClassCount: number;
  loopNext: Int32Array;
};

export type ScoreChoice = { pieces: Int32Array; masks: Int32Array };

export type ScoreScratch = {
  incidences: number;
  pathCount: number;
  pathPieces: Int32Array;
  pathStarts: Int32Array;
  pathEnds: Int32Array;
  pathValues: Float64Array;
  gainCount: number;
  gainPieces: Int32Array;
  gainLoops: Int32Array;
  gainValues: Float64Array;
  eventKeys: Float64Array;
  eventPieces: Int32Array;
  eventPositions: Int32Array;
  eventDeltas: Float64Array;
  positionSlots: Int32Array;
  runs: number[][];
  runLengths: Int32Array;
  levels: Float64Array;
  previous: Int32Array;
  readers: Int32Array;
  spare: number[];
  labels: Int32Array;
  splitStamps: Int32Array;
  splitTargets: Int32Array;
  touchedStamps: Int32Array;
  touched: number[];
  touchedCount: number;
  choiceTable: RunTable;
  choices: ScoreChoice[];
  classStamps: Int32Array;
  classLabels: Int32Array;
  generation: number;
  representatives: Int32Array;
};

export type RunTable = {
  count: number;
  klasses: Int32Array;
  hashes: Int32Array;
  runs: (readonly number[])[];
  slots: Int32Array;
};

export type ScoreNodes = {
  table: RunTable;
  parents: Int32Array;
  pieces: Int32Array;
  stepStarts: Int32Array;
  stepEnds: Int32Array;
  expanded: Uint8Array;
  values: Int32Array;
  via: Int32Array;
};

export type ScoreSteps = {
  count: number;
  targets: Int32Array;
  pieces: Int32Array;
  gains: Int32Array;
};

export type ScoreState = {
  layout: ScoreLayout;
  lookahead: Lookahead;
  cap: number;
  meter: WorkMeter;
  quiet: readonly number[];
  level: readonly number[];
  levelOrder: readonly number[];
  loops: number;
  walks: (ScoreWalk | undefined)[];
  nodes: ScoreNodes;
  steps: ScoreSteps;
  scratch: ScoreScratch;
  dirty: number[];
  best: number;
  bestNode: number;
};

export type WalkOptions = {
  limit: number;
  quiet: readonly number[];
  level: readonly number[];
};

export type WalkOutcome = {
  score: number;
  complete: boolean;
  witness: readonly number[];
};

export type RegexCandidate = { source: string; flags: string };

export type ReadingJob = RegexCandidate & {
  repetitionLimit: number | undefined;
};

export type RegexFinding = RegexCandidate & RegexReason & { file: string };

export type RegexScanResult = {
  unsafe: RegexFinding[];
  undetermined: RegexFinding[];
  dynamic: string[];
  staticWrap: string[];
};

export type ArgumentShape = 'dynamic' | 'static-literal';

export type RegexUsage = {
  dynamic: boolean;
  staticWrap: boolean;
};

export type ExtractedFile = RegexUsage & {
  file: string;
  candidates: RegexCandidate[];
};

export type CallOpener = 'paren' | 'colon' | 'space';

export type CheckRequest = {
  mode: 'check';
  patterns: string[];
  flags: string;
  repetitionLimit: number | undefined;
};

export type ScanRequest = {
  mode: 'scan';
  targets: string[];
  repetitionLimit: number | undefined;
};

export type RegexRequest = CheckRequest | ScanRequest;

export type CallSite = {
  name: string;
  argumentIndex: number;
  opener?: CallOpener;
};

export type RegexCall = CallSite & {
  hasLiteralForm: boolean;
  languages: readonly LanguageId[];
};

export type StaticLiteral = { open: number; end: number; next: number };

export type LiteralForm = {
  languages: readonly LanguageId[];
  static: RegExp | null;
  dynamic: RegExp | null;
};
