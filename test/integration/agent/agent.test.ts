import type { LanguageId } from '../../../src/types/hooks/regex.js';
import { describe, it, strict } from 'poku';
import {
  analyze,
  analyzeFor,
  classify,
} from '../../../src/hooks/agent/agent.js';

const expectAll = (
  verdict: 'uncapped' | 'safe' | 'invalid',
  cases: [snippet: string, language: LanguageId][]
): void => {
  for (const [snippet, language] of cases)
    it(`classifies ${JSON.stringify(snippet)} (${language}) as ${verdict}`, () => {
      strict.strictEqual(classify(snippet, language), verdict);
    });
};

describe('classify reports an uncapped agent-runtime loop as uncapped', () => {
  expectAll('uncapped', [
    ['query({ prompt: "hi" })', 'javascript'],
    ['claude.query({ prompt: "hi" })', 'javascript'],
    ['AgentExecutor(agent=a, tools=t, max_iterations=None)', 'python'],
    [
      'executor = AgentExecutor(agent=a, tools=t, max_execution_time=None)',
      'python',
    ],
    ['analyst = Agent(role="analyst", goal="g", max_iter=None)', 'python'],
    ['Runner.run(agent, input, max_turns=None)', 'python'],
  ]);
});

describe('classify reports a capped or single-shot call as safe', () => {
  expectAll('safe', [
    ['query({ prompt, options: { maxTurns: 5 } })', 'javascript'],
    ['query({ prompt, options: { maxBudgetUsd: 5 } })', 'javascript'],
    ['query({ prompt, options: { abortController } })', 'javascript'],
    ['AgentExecutor(agent=a, tools=t)', 'python'],
    ['AgentExecutor(agent=a, tools=t, max_iterations=5)', 'python'],
    ['Runner.run(agent, input, max_turns=10)', 'python'],
  ]);
});

describe('classify reports a non-runtime or single-step call as invalid', () => {
  expectAll('invalid', [
    ['generateText({ model, tools, prompt })', 'javascript'],
    ['streamText({ model: openai("gpt-4"), tools })', 'javascript'],
    ['db.query("SELECT 1")', 'javascript'],
    ['const x = 1', 'javascript'],
    ['', 'javascript'],
    ['result = session.query(User).all()', 'python'],
  ]);
});

describe('analyze only flags agent-SDK files', () => {
  it('flags an uncapped query loop in a Claude agent-SDK file', () => {
    const result = analyze(
      'app.ts',
      'import { query } from "@anthropic-ai/claude-agent-sdk";\nfor await (const m of query({ prompt: "hi" })) {}'
    );

    strict.strictEqual(result.findings.length, 1);
  });

  it('passes a capped query call in a Claude agent-SDK file', () => {
    const result = analyze(
      'app.ts',
      'import { query } from "@anthropic-ai/claude-agent-sdk";\nfor await (const m of query({ prompt, options: { maxTurns: 4 } })) {}'
    );

    strict.strictEqual(result.findings.length, 0);
  });

  it('does not flag a Vercel AI SDK tools call (single step by default)', () => {
    const result = analyze(
      'app.ts',
      'import { generateText } from "ai";\nawait generateText({ model, tools, prompt: "hi" });'
    );

    strict.strictEqual(result.findings.length, 0);
  });

  it('flags an explicit cap removal in a python agent file', () => {
    const result = analyzeFor(
      'python',
      'from langchain.agents import AgentExecutor\nex = AgentExecutor(agent=a, tools=t, max_iterations=None)'
    );

    strict.strictEqual(result.findings.length, 1);
  });

  it('flags an explicit max_turns removal in a python agent file', () => {
    const result = analyzeFor(
      'python',
      'from agents import Runner\nawait Runner.run(agent, input, max_turns=None)'
    );

    strict.strictEqual(result.findings.length, 1);
  });

  it('passes a capped-by-default python agent call', () => {
    const result = analyzeFor(
      'python',
      'from langchain.agents import AgentExecutor\nex = AgentExecutor(agent=a, tools=t)'
    );

    strict.strictEqual(result.findings.length, 0);
  });

  it('ignores an explicit cap removal outside an agent file', () => {
    const result = analyzeFor('python', 'config = dict(max_iterations=None)');

    strict.strictEqual(result.findings.length, 0);
  });

  it('ignores a query call in a file with no agent SDK', () => {
    const result = analyze(
      'app.ts',
      'import { db } from "./db";\nawait query({ sql: "SELECT * FROM users" });'
    );

    strict.strictEqual(result.findings.length, 0);
  });

  it('skips a file of an unknown extension', () => {
    strict.strictEqual(
      analyze('notes.txt', 'query({ prompt })').findings.length,
      0
    );
  });
});
