import type { LanguageId } from '../../types/hooks/regex.js';
import type { LineRule } from '../../types/scan.js';

const SDK_IMPORT: Partial<Record<LanguageId, RegExp>> = {
  javascript:
    /(?:\bfrom\s{1,16}|\brequire\s{0,16}\(\s{0,16})["']@anthropic-ai\/claude-(?:agent|code)-sdk["']/,
  python:
    /(?:from|import)\s{1,16}(?:langchain|langgraph|llama_index|crewai|autogen|agents|claude_agent_sdk|claude_code_sdk)\b/,
};

const ALWAYS_LOOP_CALL: Partial<Record<LanguageId, RegExp>> = {
  javascript: /\bquery\s{0,16}\(\s{0,16}\{|\bclaude\.\s{0,16}query\s{0,16}\(/,
  python:
    /\bAgentExecutor\s{0,16}\(|\binitialize_agent\s{0,16}\(|\bcreate_(?:react|tool_calling|openai_tools|structured_chat)_agent\s{0,16}\(|\bCrew\s{0,16}\(|\bRunner\.run\w{0,8}\s{0,16}\(/,
};

/** An effective step / turn / time / budget cap (a zero or None value does not count) */
const CAP: Partial<Record<LanguageId, RegExp>> = {
  javascript:
    /\bmaxTurns\s{0,16}:\s{0,16}(?!0\b)[A-Za-z0-9_]|\bmaxBudgetUsd\s{0,16}:\s{0,16}(?!0\b)[A-Za-z0-9_]|\bstopWhen\s{0,16}:|\babortController\s{0,16}[:,}]|\babortSignal\s{0,16}[:,}]|\bsignal\s{0,16}:|\btimeout\s{0,16}:\s{0,16}(?!0\b)[A-Za-z0-9_]/,
  python:
    /\bmax_iterations\s{0,16}=\s{0,16}(?!None)|\bmax_execution_time\s{0,16}=\s{0,16}(?!None)|\brecursion_limit\s{0,16}[=:]|\bmax_iter\s{0,16}=\s{0,16}(?!None)|\bmax_turns\s{0,16}=\s{0,16}(?!None)/,
};

/** Explicit removal of a default cap. Python frameworks cap by default, so only turning the cap off is a finding */
const UNCAPPED_RULES: Partial<Record<LanguageId, LineRule[]>> = {
  python: [
    {
      regex: /\bmax_iterations\s{0,16}=\s{0,16}None\b/,
      detail:
        'agent with max_iterations=None: removes the default step cap, so the tool loop is unbounded (DoS / cost-burn)',
    },
    {
      regex: /\bmax_execution_time\s{0,16}=\s{0,16}None\b/,
      detail:
        'agent with max_execution_time=None: removes the time bound on the loop (a step cap, if set, still applies)',
    },
    {
      regex: /\bmax_iter\s{0,16}=\s{0,16}None\b/,
      detail:
        'agent with max_iter=None: removes the default iteration cap, so the loop is unbounded',
    },
    {
      regex: /\bmax_turns\s{0,16}=\s{0,16}None\b/,
      detail:
        'agent with max_turns=None: removes the turn limit, so the agent loop is unbounded (DoS / cost-burn)',
    },
  ],
};

/** True where the framework loops unbounded by default (JavaScript SDKs), false where it caps by default (Python) */
const FLAGS_MISSING_CAP: Partial<Record<LanguageId, boolean>> = {
  javascript: true,
};

export const SUPPORTED_LANGUAGES: readonly LanguageId[] = Object.keys(
  SDK_IMPORT
) as LanguageId[];

export const isSupportedLanguage = (value: string): value is LanguageId =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const sdkImportOf = (language: LanguageId): RegExp | null =>
  SDK_IMPORT[language] ?? null;

export const alwaysLoopCallsOf = (language: LanguageId): RegExp | null =>
  ALWAYS_LOOP_CALL[language] ?? null;

export const capOf = (language: LanguageId): RegExp | null =>
  CAP[language] ?? null;

export const uncappedRulesOf = (language: LanguageId): LineRule[] =>
  UNCAPPED_RULES[language] ?? [];

export const flagsMissingCap = (language: LanguageId): boolean =>
  FLAGS_MISSING_CAP[language] ?? false;
