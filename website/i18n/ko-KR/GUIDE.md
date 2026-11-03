# ko-KR translation guide

This guide holds the rules, the tone, and the glossary for translating the website from English into Korean. Whoever translates next, person or agent, follows it so the whole site keeps one voice and one set of terms. The website's locale folders are the one part of the project written in a language other than English, each derived from the English source, which always leads: a change starts in English and then reaches this folder.

## Tone

- Write natural Korean that reads as though it was written in Korean from the start, as fluent as the English.
- Never translate literally. A calque keeps the English structure under Korean words, and it reads stiff:
  - ❌ "그것은 새로운 프로젝트와 기존의 프로젝트 둘 다에서 작동하며, 어떠한 API 키도 필요로 하지 않습니다."
  - ✅ "**Lagune**은 새 프로젝트에서도 기존 프로젝트에서도 작동하며, API 키가 필요 없습니다."
  - ❌ "각각의 적용된 수정이 유지된다는 것을 증명하고, 그 후에 그러한 것들을 종결합니다."
  - ✅ "적용한 수정이 실제로 효과가 있는지 증명하고, 증명된 발견 사항을 종결합니다."
  - ❌ "수정은 에이전트에 의해 적용됩니다."
  - ✅ "에이전트가 수정을 적용합니다."
- Grasp the tone, idiom, and intent of a passage before translating it, then reproduce them. Stay faithful to the meaning, not to the words: never add a claim, caveat, or example the English lacks, and never drop one it has.
- Where the English is unclear or ambiguous, do not guess. Report it, and translate the rest meanwhile.
- Write prose, FAQ answers, and interface messages in the formal polite style ("~합니다", "~입니다"), and instructions in "~하세요" ("설치하세요", "실행하세요"). Never use the plain style ("~한다", "~이다") or the "~해요" endings in prose. Titles, headings, sidebar labels, buttons, and table cells use a noun phrase or the "~하기" form ("시작하기", "작동 방식").
- Leave the reader implied, as Korean does. Never write "당신" or "귀하", and write "사용자" only where the sentence needs a subject.
- A prompt the reader sends to the agent addresses the agent in the informal style ("확인해 줘", "추가해 줘"), as people write to an assistant.
- Write complete sentences. Never cut a thought short with an em dash, a semicolon, or a full stop where the sentence calls for a comma, a colon, or parentheses.
- Cut the words that add nothing, never the meaning. Prefer the active voice to "~에 의해 ~되다", "필요하다" to "필요로 하다", and "~할 수 있습니다" to "~하는 것이 가능합니다". Avoid translationese such as "그것", "~를 가지다", a "~들" the sentence does not need, and chains of "~에 대한" or "~의".
- Prefer the Korean word where one is in everyday use ("취약점", "보안 강화", "에이전트"), and keep the English term only where Korean developers use it as is ("CLI", "MCP").
- Keep every sentence intelligible to any user, developer or not.
- Keep the English's bold product names and the emojis that open its paragraphs.
- Write titles, descriptions, and keywords from how people search in Korea, keeping the English technical terms they also search for (such as OWASP, CVSS, PoC, Claude Code), and write each FAQ question the way a Korean user would ask it ("~인가요?", "~할 수 있나요?").

## Typography

- Follow the standard spacing rules (한글 맞춤법 띄어쓰기) and write loanwords as the National Institute of Korean Language does ("디렉터리", "메시지", "워크플로"), unless a product spells its own name otherwise.
- Use ASCII punctuation, as Korean does: `.` `,` `:` `?` `!` and `()`, never full-width forms.
- Quote with straight double quotes (`"`), never curly quotes or corner brackets, as the rest of the project does.
- Attach a particle directly to a Korean word, a number, or a bold product name, choosing its form by how the name is read aloud in Korean: "**Lagune**" reads as 라군, so it takes "은", "을", "이", "과", "으로" ("**Lagune**은", "**Lagune**의"), while "**Claude Code**" takes "는", "를", "가". The particle sits outside the bold.
- Never attach a particle to inline code or a bare URL. Give the code a head noun that carries the particle ("`/lagune-detect` 명령어를 실행하세요", "`.lagune/` 폴더에", "`secrets` 훅은"), and follow a bare URL with a space, since Markdown and the check read any letter after it as part of the URL.
- Never start or end a bold or italic span with punctuation or inline code when a Korean letter touches it: Markdown then fails to close the span. Keep the punctuation outside ("**데이터베이스**:"), and italicize with `*`, since `_` does not render inside a Korean word.
- Inline code keeps the English order, and the check compares the spans one by one, so restructure the sentence around them instead of reordering them.
- A slash command followed by a colon keeps the ASCII colon and a space, as in a title such as "/lagune-charter: 보안 원칙 정하기".
- Keep scores and versions exactly as in English, such as `9.8`, since they match what the engine prints. Write counts with a thousands comma ("1,200개 파일") and the percent sign after the number ("50%"), and count with a counter where Korean needs one ("발견 사항 3개", "에이전트 {count}개").
- Titles and labels carry no trailing full stop, and Latin product names keep their own case.
- Never break lines by hand in the middle of prose.

## What never changes

Commands, code, tokens, URLs, paths, component ids, and product names stay exactly as in English, and a translation never adds a link or URL its English source lacks. The check enforces it, since a mistranslated command in a security product is a real risk.

Three kinds of code carry plain language, and only their plain language translates:

- **`prompt` and `md` blocks:** the request becomes what a Korean user would type, addressing the agent in the informal style ("확인해 줘", "추가해 줘"), while every command, inline code, path, placeholder (such as `<path>`), and URL stays as in English, and a block nested inside follows its own rule. Never write a slash between words the English lacks ("및/또는", a date such as "11/03"), since the check reads it as a path.
- **Inline code holding a phrase, such as a quoted example question:** it translates like prose and stays inline code, in straight double quotes, in the same count and order.
- **`mermaid` blocks:** only the labels translate (node text, edge text, state descriptions). The diagram type, direction, ids, arrows, and `<br/>` line breaks stay, and a label never gains a straight double quote of its own.

Every other inline code stays exactly as in English.

## Glossary

| English                                                                                           | ko-KR                                                                                                |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Lagune**, SDH, Security-Driven Hardening, Spec-Driven                                           | unchanged, read as 라군 for its particles ("**Lagune**은")                                           |
| `/lagune-charter` and every other command                                                         | unchanged, with "명령어" carrying the particle ("`/lagune-plan` 명령어를 실행하세요")                |
| Blue Team, Red Team, CVSS, OWASP, JWT, CORS, PoC, PRD, LLM, MCP                                   | unchanged                                                                                            |
| hardening (noun), security hardening                                                              | 보안 강화, keeping "하드닝" and "hardening" in keywords                                              |
| harden (verb)                                                                                     | 보안을 강화하다, 강화하다                                                                            |
| charter (the principles it holds)                                                                 | 보안 원칙                                                                                            |
| charter, detect, plan, harden, verify (as phase names)                                            | unchanged, with "단계" where the sentence needs it ("detect 단계", "verify 단계에서")                |
| governing layer, convention (SDH as one)                                                          | 모든 단계를 규율하는 계층, 컨벤션                                                                    |
| engine                                                                                            | 엔진                                                                                                 |
| spec                                                                                              | 명세, keeping "스펙 주도 개발" in keywords                                                           |
| deterministic                                                                                     | 결정론적                                                                                             |
| Development flow, Blue Team flow, workflow                                                        | 개발 흐름, Blue Team 흐름, 워크플로                                                                  |
| universal (the `/lagune` command, the install route)                                              | 범용                                                                                                 |
| context, context-aware                                                                            | 컨텍스트, 컨텍스트를 인식하는                                                                        |
| audit (noun), audit (verb)                                                                        | 감사, 점검하다, never "감사하다", which reads as "to thank"                                          |
| map (what the system does, its risks)                                                             | 파악하다                                                                                             |
| record (a finding, a category)                                                                    | 기록하다                                                                                             |
| finding                                                                                           | 발견 사항                                                                                            |
| concern (one the user describes to detect)                                                        | 우려 사항                                                                                            |
| evidence (behind a finding), evidence (what prove writes)                                         | 근거, 증거                                                                                           |
| fix                                                                                               | 수정                                                                                                 |
| control                                                                                           | 보안 통제, 통제                                                                                      |
| hold (a control, a fix)                                                                           | 실제로 효과가 있다, 유효하다                                                                         |
| prove, proof, proof of concept                                                                    | 증명하다, 증명, 개념 증명(PoC)                                                                       |
| verdict                                                                                           | 판정                                                                                                 |
| confront (the code with the record)                                                               | 대조하다                                                                                             |
| reconcile                                                                                         | 현재 상태와 대조해 갱신하다                                                                          |
| detect map, defense plan, hardening record                                                        | 탐지 맵, 방어 계획, 강화 기록                                                                        |
| Applied, Partial, Blocked, Risk closed, Risk not closed, Cannot tell from the code (as labels)    | unchanged, since the artifacts write them in English                                                 |
| specialization, catalog, category                                                                 | 전문 지식, 카탈로그, 카테고리                                                                        |
| built-in (specialization)                                                                         | 내장                                                                                                 |
| distill, shadow (a built-in, with a specialization of your own)                                   | 핵심을 정리하다, 가리다                                                                              |
| stand down, close out                                                                             | 종결하다 ("체인 전체에서 종결합니다"), 마무리하다                                                    |
| closable, closability (security)                                                                  | 종결할 수 있는, 종결 가능성                                                                          |
| at rest, settled (the cycle)                                                                      | 안정 상태 ("사이클이 안정 상태가 됩니다")                                                            |
| artifact, memory (the phase artifacts)                                                            | 산출물, 기록                                                                                         |
| chain (the phase artifacts together)                                                              | 체인 ("체인 전체")                                                                                   |
| tracking, tracking map, tracked item                                                              | 추적, 추적 맵, 추적 항목                                                                             |
| vulnerability, risk, exploit                                                                      | 취약점, 위험, 익스플로잇                                                                             |
| prompt injection, path traversal, prototype pollution, data races, type juggling, class pollution | 프롬프트 인젝션, 경로 탐색(path traversal), 프로토타입 오염, 데이터 레이스, 타입 저글링, 클래스 오염 |
| broken access control                                                                             | 취약한 접근 통제, as **OWASP** writes it in Korean                                                   |
| crafted, untrusted, hardcoded                                                                     | 조작된, 신뢰할 수 없는, 하드코딩된                                                                   |
| score, rate (a finding)                                                                           | 점수를 매기다                                                                                        |
| false positive, sink                                                                              | 오탐, 싱크                                                                                           |
| attack vector, attack surface                                                                     | 공격 벡터, 공격 표면                                                                                 |
| severity                                                                                          | 심각도 ("치명적", "높음", "중간", "낮음" in prose, unchanged in command output)                      |
| authentication, authorization, access control                                                     | 인증, 인가, 접근 통제                                                                                |
| secret, credential                                                                                | 시크릿, 자격 증명                                                                                    |
| login, file uploads, payments                                                                     | 로그인, 파일 업로드, 결제                                                                            |
| file, folder, directory, path, link                                                               | 파일, 폴더, 디렉터리, 경로, 링크                                                                     |
| scan, check (hook modes)                                                                          | unchanged as mode names ("scan 모드")                                                                |
| sweep, scan (verb and noun)                                                                       | 스캔하다, 스캔                                                                                       |
| flag (verb)                                                                                       | 잡아내다                                                                                             |
| snippet                                                                                           | 코드 조각                                                                                            |
| codebase                                                                                          | 코드베이스, or 프로젝트 where it reads better                                                        |
| AI agent, coding agent, agent                                                                     | AI 에이전트, 코딩 에이전트, 에이전트                                                                 |
| prompt, plugin, hook, payload, handler, dashboard                                                 | 프롬프트, 플러그인, 훅, 페이로드, 핸들러, 대시보드                                                   |
| skill                                                                                             | 스킬                                                                                                 |
| skills CLI, CLI, terminal                                                                         | **skills** CLI, CLI, 터미널                                                                          |
| session, tool (the engine's MCP tools)                                                            | 세션, 도구                                                                                           |
| command, slash command                                                                            | 명령어, 슬래시 명령어                                                                                |
| test (what a test runner runs)                                                                    | 테스트, kept apart from "증명", which means proof                                                    |
| branch, commit, pull request, diff                                                                | 브랜치, 커밋, 풀 리퀘스트, diff                                                                      |
| report, template, library, header                                                                 | 보고서, 템플릿, 라이브러리, 헤더                                                                     |
| deploy                                                                                            | 배포하다                                                                                             |
| deprecated                                                                                        | 지원 중단된                                                                                          |
| live (view, dashboard)                                                                            | 실시간 ("실시간 뷰")                                                                                 |
| badge                                                                                             | 배지                                                                                                 |
| extension, package                                                                                | 확장 프로그램, 패키지                                                                                |
| defense-only, defensive security                                                                  | 방어 전용, 방어 보안                                                                                 |
| security posture                                                                                  | 보안 태세                                                                                            |
| advisory, responsible disclosure                                                                  | 보안 권고, 책임 있는 공개                                                                            |
| on demand                                                                                         | 필요할 때만                                                                                          |
| scope (of a run), in scope, out of scope                                                          | 범위, 범위 안, 범위 밖                                                                               |
| safe by default, safe defaults                                                                    | 기본적으로 안전한, 안전한 기본값                                                                     |
| open-source                                                                                       | 오픈 소스                                                                                            |
| Get Started, Install                                                                              | 시작하기, 설치                                                                                       |
| Run it, Next (headings)                                                                           | 사용법 on a command page, 실행하기 on a hook page, 다음 단계                                         |
| How it works, Update, Permissions (headings)                                                      | 작동 방식, 업데이트, 권한                                                                            |
| Get the most out of it (tip title)                                                                | 더 잘 활용하기                                                                                       |
| Frequently Asked Questions                                                                        | 자주 묻는 질문                                                                                       |

## Workflow

The website's `i18n` tool keeps every translation tied to its English source:

- `copy` brings an English page into this folder and records the source it came from. Translate the copy in place.
- `check` reports coverage, stale pages, and anything a translation changed that must stay as in English. A page is done when it reports no errors for it.
- `diff` shows what changed in English since a translation was made, and `stamp` accepts the new English source once the translation is re-synced.
- In the message files, a message still marked as untranslated in its description counts as untranslated. Removing the mark accepts the translation, including a message meant to stay identical to English, such as `OWASP`.

Translate the pages in the sidebar's order, each page's child pages right after it, and read each English page in full, along with the pages already translated around it, before translating it.
