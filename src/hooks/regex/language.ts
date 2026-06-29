import type {
  CarrierMap,
  LanguageId,
  LanguageMap,
  RegexCarriers,
} from '../../types/hooks/regex.js';
import { extname } from 'node:path';

const EXTENSIONS = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.ts': 'javascript',
  '.tsx': 'javascript',
  '.mts': 'javascript',
  '.cts': 'javascript',
  '.astro': 'javascript',
  '.vue': 'javascript',
  '.svelte': 'javascript',
  '.marko': 'javascript',
  '.riot': 'javascript',
  '.py': 'python',
  '.pyi': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.php': 'php',
  '.rs': 'rust',
  '.java': 'java',
  '.cs': 'csharp',
  '.c': 'c',
  '.h': 'c',
  '.cc': 'cpp',
  '.cpp': 'cpp',
  '.cxx': 'cpp',
  '.hpp': 'cpp',
  '.hh': 'cpp',
  '.hxx': 'cpp',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.swift': 'swift',
  '.scala': 'scala',
  '.sc': 'scala',
  '.dart': 'dart',
  '.ps1': 'powershell',
  '.psm1': 'powershell',
  '.psd1': 'powershell',
  '.ex': 'elixir',
  '.exs': 'elixir',
  '.m': 'objc',
  '.mm': 'objc',
  '.r': 'r',
  '.jl': 'julia',
  '.clj': 'clojure',
  '.cljs': 'clojure',
  '.cljc': 'clojure',
  '.edn': 'clojure',
  '.cr': 'crystal',
  '.nim': 'nim',
  '.nims': 'nim',
  '.v': 'vlang',
  '.d': 'dlang',
  '.pl': 'perl',
  '.pm': 'perl',
} satisfies LanguageMap;

const NO_CARRIERS: RegexCarriers = {
  slashLiteral: false,
  quoteApis: [],
  stringApis: [],
};

const CARRIERS = {
  javascript: {
    slashLiteral: true,
    quoteApis: ['new RegExp', 'RegExp'],
    stringApis: ['.match', '.matchAll', '.search'],
  },
  python: {
    slashLiteral: false,
    quoteApis: [
      're.compile',
      're.match',
      're.search',
      're.sub',
      're.findall',
      're.fullmatch',
      'regex.compile',
    ],
    stringApis: [],
  },
  ruby: { slashLiteral: true, quoteApis: ['Regexp.new'], stringApis: [] },
  go: {
    slashLiteral: false,
    quoteApis: ['regexp.Compile', 'regexp.MustCompile', 'regexp.MatchString'],
    stringApis: [],
  },
  php: {
    slashLiteral: true,
    quoteApis: ['preg_match', 'preg_match_all', 'preg_replace', 'preg_split'],
    stringApis: [],
  },
  rust: {
    slashLiteral: false,
    quoteApis: ['Regex::new', 'RegexBuilder::new'],
    stringApis: [],
  },
  java: { slashLiteral: false, quoteApis: ['Pattern.compile'], stringApis: [] },
  csharp: { slashLiteral: false, quoteApis: ['new Regex'], stringApis: [] },
  c: { slashLiteral: false, quoteApis: ['regcomp'], stringApis: [] },
  cpp: {
    slashLiteral: false,
    quoteApis: ['std::regex', 'regcomp'],
    stringApis: [],
  },
  kotlin: {
    slashLiteral: false,
    quoteApis: ['Regex', 'Pattern.compile'],
    stringApis: [],
  },
  swift: {
    slashLiteral: false,
    quoteApis: ['NSRegularExpression'],
    stringApis: [],
  },
  scala: {
    slashLiteral: false,
    quoteApis: ['Pattern.compile'],
    stringApis: [],
  },
  dart: { slashLiteral: false, quoteApis: ['RegExp'], stringApis: [] },
  powershell: NO_CARRIERS,
  elixir: { slashLiteral: true, quoteApis: ['Regex.compile'], stringApis: [] },
  objc: {
    slashLiteral: false,
    quoteApis: ['regularExpressionWithPattern'],
    stringApis: [],
  },
  r: {
    slashLiteral: false,
    quoteApis: ['grepl', 'gsub', 'regmatches', 'regexpr', 'regexec'],
    stringApis: [],
  },
  julia: { slashLiteral: false, quoteApis: ['Regex'], stringApis: [] },
  clojure: NO_CARRIERS,
  crystal: { slashLiteral: true, quoteApis: ['Regex.new'], stringApis: [] },
  nim: NO_CARRIERS,
  vlang: {
    slashLiteral: false,
    quoteApis: ['regex.regex_opt'],
    stringApis: [],
  },
  dlang: { slashLiteral: false, quoteApis: ['regex'], stringApis: [] },
  perl: { slashLiteral: true, quoteApis: [], stringApis: [] },
} satisfies CarrierMap;

const BY_EXTENSION: LanguageMap = EXTENSIONS;

export const languageOf = (file: string): LanguageId | null =>
  BY_EXTENSION[extname(file).toLowerCase()] ?? null;

export const carriersOf = (language: LanguageId): RegexCarriers =>
  CARRIERS[language];
