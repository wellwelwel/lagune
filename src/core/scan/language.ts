import type { LanguageId, LanguageMap } from '../../types/scan.js';
import { extname } from 'node:path';
import { deepFreeze } from '../collections.js';

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

const BY_EXTENSION: LanguageMap = EXTENSIONS;

export const languageOf = (file: string): LanguageId | null =>
  BY_EXTENSION[extname(file).toLowerCase()] ?? null;

export const languagesOf = (
  table: Partial<Record<LanguageId, unknown>>
): readonly LanguageId[] => deepFreeze(Object.keys(table) as LanguageId[]);

export const isLanguageIn =
  (languages: readonly LanguageId[]) =>
  (value: string): value is LanguageId =>
    languages.some((language) => language === value);
