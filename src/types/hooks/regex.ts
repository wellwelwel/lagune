export type RegexSafetyOptions = {
  repetitionLimit: number;
};

export type RegexInput = string | RegExp;

export type RegexVerdict = 'safe' | 'unsafe' | 'invalid regex';

export type QuantifierScan = {
  repetitionCount: number;
  backtrack: boolean;
};

export type RegexScanCursor = {
  source: string;
  position: number;
  repetitionCount: number;
  anchored: boolean;
  backtrack: boolean;
};

export type MemberSet = { members: Set<string>; negated: boolean };

export type CharSet = 'any' | 'none' | MemberSet;

export type ClassFootprint = {
  charSet: CharSet;
  negated: boolean;
};

export type AtomBody = {
  charSet: CharSet;
  endsGreedy: boolean;
  singleChar: boolean;
  permissive: boolean;
  gatedDanger: boolean;
  consumes: boolean;
  loopAmbiguous: boolean;
};

export type AtomScan = {
  charSet: CharSet;
  loops: boolean;
  tailGreedy: boolean;
  permissiveTail: boolean;
  gatedDanger: boolean;
  required: boolean;
};

export type SequenceScan = {
  footprint: CharSet;
  endsGreedy: boolean;
  permissiveTail: boolean;
  unresolvedDanger: boolean;
  required: boolean;
  loopAmbiguous: boolean;
};

export type Alternative = {
  atoms: AtomScan[];
  footprint: CharSet;
  loops: boolean;
  endsGreedy: boolean;
  permissiveTail: boolean;
  required: boolean;
};

export type GateResult = {
  confirmed: boolean;
  unresolved: boolean;
};

export type QuantifierMark = {
  quantified: boolean;
  greedy: boolean;
  unbounded: boolean;
  required: boolean;
};

export type UnsafeFinding = {
  file: string;
  source: string;
};

export type RegexScanResult = {
  unsafe: UnsafeFinding[];
  dynamic: string[];
  staticWrap: string[];
};

export type FileScan = {
  unsafe: UnsafeFinding[];
  dynamic: string | null;
  staticWrap: string | null;
};

export type ArgumentShape = 'dynamic' | 'static-literal' | 'none';

export type RegexUsage = {
  dynamic: boolean;
  staticWrap: boolean;
};

export type CallOpener = 'paren' | 'colon' | 'space';

export type CheckRequest = {
  mode: 'check';
  patterns: string[];
  repetitionLimit: number | undefined;
};

export type ScanRequest = {
  mode: 'scan';
  targets: string[];
  repetitionLimit: number | undefined;
};

export type RegexRequest = CheckRequest | ScanRequest;

export type LanguageId =
  | 'javascript'
  | 'python'
  | 'ruby'
  | 'go'
  | 'php'
  | 'rust'
  | 'java'
  | 'csharp'
  | 'c'
  | 'cpp'
  | 'kotlin'
  | 'swift'
  | 'scala'
  | 'dart'
  | 'powershell'
  | 'elixir'
  | 'objc'
  | 'r'
  | 'julia'
  | 'clojure'
  | 'crystal'
  | 'nim'
  | 'vlang'
  | 'dlang'
  | 'perl';

export type CallConstructor = {
  name: string;
  argIndex: number;
  hasLiteralForm: boolean;
  languages: readonly LanguageId[];
  opener?: CallOpener;
};

export type LiteralForm = {
  languages: readonly LanguageId[];
  static: RegExp | null;
  dynamic: RegExp | null;
};

export type RegexCarriers = {
  slashLiteral: boolean;
  quoteApis: readonly string[];
  stringApis: readonly string[];
};

export type LanguageMap = Readonly<Record<string, LanguageId>>;

export type CarrierMap = Readonly<Record<LanguageId, RegexCarriers>>;
