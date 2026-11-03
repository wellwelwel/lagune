# ja-JP translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Japanese. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Japanese that reads as though it was written in Japanese from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Japanese words, and it reads stiff:
  - ❌ "それは新しいプロジェクトと既存のプロジェクトの両方で動作し、そしていかなる API キーも必要としません。"
  - ✅ "新規プロジェクトでも既存のプロジェクトでも使え、API キーも不要です。"
  - ❌ "適用されたそれぞれの修正が持ちこたえることを証明し、そして持ちこたえるものをクローズします。"
  - ✅ "適用した修正が実際に有効かを証明し、有効だった検出事項をクローズします。"
  - ❌ "修正はエージェントによって適用されます。"
  - ✅ "エージェントが修正を適用します。"
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Write prose, FAQ answers, and interface messages in the polite form (です・ます), never mixing it with the plain form (である) in the same text. Titles, headings, sidebar labels, buttons, and table cells use a noun phrase or the plain form.
- Write complete sentences. Never cut a thought short with a dash (`――`), a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Drop padding such as "インストールを行います" where "インストールします" does the job, or "することができます" where "できます" does, and avoid chains of "の" and a passive "される" where the active voice reads naturally.
- Leave the reader implied, as Japanese does. Write "あなた" only where the sentence would be unclear without it, and never "貴方" or "お客様".
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Japanese, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code), and write each FAQ question the way a Japanese user would ask it.

## Typography

- Use full-width Japanese punctuation in Japanese prose: `、` `。` `：` `？` `！` and `（）`. Keep ASCII punctuation inside code, commands, and English names.
- Quote with straight double quotes (`"`), never curly quotes or corner brackets (`「」`), as the rest of the project does.
- Put one half-width space between Japanese characters and Latin letters, numbers, inline code, links, and bold product names ("`/lagune-detect` を実行したあと", "**Lagune** がコードを読み取ります"), and none next to full-width punctuation.
- Write Latin letters and digits in half-width and katakana in full-width, never the other way around.
- Write long vowels the way Microsoft's Japanese style does: "ユーザー", "サーバー", "フォルダー", "ハンドラー", but "セキュリティ", "リポジトリ", "ディレクトリ", "カテゴリ", "ライブラリ".
- Never start or end a bold or italic span with punctuation: Markdown then fails to close it beside a Japanese character. Keep the punctuation outside ("**データベース**："), and italicize a word inside a Japanese sentence with `*`, since `_` does not render there.
- Follow a bare URL with a space, never with full-width punctuation, which Markdown and the check read as part of the URL.
- Inline code keeps the English order, so restructure the sentence around the spans instead of reordering them.
- A slash command followed by a colon keeps the ASCII colon and a space, as in a title such as "/lagune-charter: セキュリティ原則を定める", since the check reads the colon as part of the command.
- Titles and labels carry no trailing full stop, and Latin product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a Japanese user would type, in the polite form ("〜してください"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("および/または", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                        | ja-JP                                                                                 |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                        | unchanged                                                                             |
| `/lagune-charter` and every other command                                                      | unchanged                                                                             |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                | unchanged                                                                             |
| hardening, harden (verb)                                                                       | 堅牢化, 堅牢化する, or セキュリティ強化 where the context needs it                    |
| charter                                                                                        | "charter" as the phase name, "セキュリティ原則" in prose                              |
| governing layer, convention (SDH as one)                                                       | 全体を統括するレイヤー, 規約                                                          |
| detect, plan, harden, verify (as phase names)                                                  | unchanged, with フェーズ where the sentence needs it ("detect フェーズ", "verify は") |
| engine                                                                                         | エンジン                                                                              |
| deterministic                                                                                  | 決定論的                                                                              |
| Development flow, Blue Team flow, workflow                                                     | 開発フロー, Blue Team フロー, ワークフロー                                            |
| universal (the `/lagune` command, the install route)                                           | 汎用                                                                                  |
| context, context-aware                                                                         | コンテキスト, コンテキストを踏まえた                                                  |
| audit                                                                                          | 監査                                                                                  |
| map (what the system does, its risks)                                                          | 洗い出す                                                                              |
| finding                                                                                        | 検出事項                                                                              |
| evidence (behind a finding), evidence (what prove writes)                                      | 根拠, 証拠                                                                            |
| fix                                                                                            | 修正                                                                                  |
| control                                                                                        | 対策                                                                                  |
| prove, proof, proof of concept                                                                 | 証明する, 証明, 概念実証（PoC）                                                       |
| verdict                                                                                        | 判定                                                                                  |
| confront (the code with the record)                                                            | 突き合わせる                                                                          |
| reconcile                                                                                      | 照合して更新する                                                                      |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels) | unchanged, since the artifacts write them in English                                  |
| specialization, catalog, category                                                              | 専門知識, カタログ, カテゴリ                                                          |
| built-in (specialization)                                                                      | 組み込み                                                                              |
| stand down, closability                                                                        | クローズする, クローズ可能性                                                          |
| at rest, settled (the cycle)                                                                   | 静止状態 ("サイクルが静止状態になる")                                                 |
| artifact, memory (the phase artifacts)                                                         | 成果物, 記録                                                                          |
| chain (the phase artifacts together)                                                           | チェーン ("チェーン全体")                                                             |
| tracking, tracking map, tracked item                                                           | 追跡情報, 追跡マップ, 追跡項目                                                        |
| vulnerability, risk, exploit                                                                   | 脆弱性, リスク, エクスプロイト                                                        |
| false positive, sink                                                                           | 誤検知, シンク                                                                        |
| attack vector, attack surface                                                                  | 攻撃ベクトル, 攻撃対象領域                                                            |
| severity                                                                                       | 深刻度 ("緊急", "重要", "警告", "注意" in prose, unchanged in command output)         |
| authentication, authorization, access control                                                  | 認証, 認可, アクセス制御                                                              |
| secret, credential                                                                             | シークレット, 認証情報                                                                |
| scan, check (hook modes)                                                                       | unchanged as mode names ("scan モード")                                               |
| sweep, scan (verb and noun)                                                                    | スキャン, スキャンする                                                                |
| flag (verb)                                                                                    | 指摘する                                                                              |
| snippet                                                                                        | コードスニペット                                                                      |
| codebase                                                                                       | コードベース, or プロジェクト where it reads better                                   |
| AI agent, agent                                                                                | AI エージェント, エージェント                                                         |
| prompt                                                                                         | プロンプト                                                                            |
| plugin, extension, package                                                                     | プラグイン, 拡張機能, パッケージ                                                      |
| skill, hook, payload, handler                                                                  | スキル, フック, ペイロード, ハンドラー                                                |
| dashboard                                                                                      | ダッシュボード                                                                        |
| defense-only, defensive security                                                               | 防御専用, 防御的セキュリティ                                                          |
| security posture                                                                               | セキュリティ態勢                                                                      |
| advisory, responsible disclosure                                                               | セキュリティアドバイザリ, 責任ある開示                                                |
| on demand                                                                                      | オンデマンド, or 必要なときだけ where it reads better                                 |
| safe by default, safe defaults                                                                 | デフォルトで安全, 安全なデフォルト設定                                                |
| open-source                                                                                    | オープンソース                                                                        |
| Get Started                                                                                    | はじめに                                                                              |
| Run it, Next (headings)                                                                        | 実行方法 (使い方 on a skill page), 次のステップ                                       |
| How it works, Update, Permissions (headings)                                                   | 仕組み, 更新, 権限                                                                    |
| Get the most out of it (tip title)                                                             | 活用のヒント                                                                          |
| Frequently Asked Questions                                                                     | よくある質問                                                                          |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
