# AI 에이전트를 위한 보안 스킬

> Lagune으로 AI 에이전트가 얻는 스킬: 기존 프로젝트를 점검하거나, 개발하는 동안 새 작업을 안전하게 만들 수 있으며, 모두 보안 원칙을 따릅니다.

표준 URL: https://lagune.ai/ko-KR/docs/get-started/commands
언어: ko-KR
원문: https://lagune.ai/docs/get-started/commands
마지막 업데이트: 2026-11-05

**Lagune**을 [설치](https://lagune.ai/ko-KR/docs)하면 **AI** 에이전트가 여러 스킬을 쓸 수 있게 됩니다. 사용 방법은 두 가지이며, 둘 다 **보안 원칙**을 따릅니다: 개발하면서 새 작업을 안전하게 만들거나, 프로젝트를 대상으로 전체 감사를 실행하는 것입니다.

**⌨️ 구현 / 개발**

작업을 다 끝낸 뒤에 보안을 챙길 필요는 없습니다. **지금** 작성하고 있는 작업에는 [**`/lagune`**](https://lagune.ai/ko-KR/docs/commands/lagune) 명령어를 사용하세요:

| 스킬                                          | 해 주는 일                                                     |
| --------------------------------------------- | -------------------------------------------------------------- |
| [**/lagune-charter**](https://lagune.ai/ko-KR/docs/commands/charter) | `/lagune` 명령어가 토대로 삼는 프로젝트 보안 규칙 설정         |
| [**/lagune**](https://lagune.ai/ko-KR/docs/commands/lagune)          | 요청한 작업을 만들고, 보안 원칙에 따라 작성하는 동안 보안 강화 |

**언제든 사용하기**

[**`/lagune`**](https://lagune.ai/ko-KR/docs/commands/lagune) 명령어는 실행될 때마다 보안 원칙의 규칙을 지킵니다. 어떤 프롬프트든 받아 요청한 것을 만들고, 나중이 아니라 작업하는 동안 안전한 기본값으로 보안을 강화합니다.

---

#### 특수 스킬

| 스킬                                                | 하는 일                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/ko-KR/docs/commands/specialize) | 아티클, 익스플로잇 또는 주제를 바탕으로 **Lagune**에 새 보안 전문 지식 추가 |

**🔬 감사: Blue Team 흐름**

전체 **Blue Team 흐름**입니다: 프로젝트가 하는 일을 읽고, 위험을 파악하고, 그 위험을 해소합니다. 각 단계는 앞 단계를 토대로 하므로, 목록을 위에서 아래로 따라가기만 하면 됩니다:

| #   | 스킬                                          | 해 주는 일                                                             |
| --- | --------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | [**/lagune-charter**](https://lagune.ai/ko-KR/docs/commands/charter) | 제안을 받거나 원하는 대로 다듬은 프로젝트 보안 규칙 설정               |
| 2   | [**/lagune-detect**](https://lagune.ai/ko-KR/docs/commands/detect)   | 코드를 읽고 시스템이 하는 일과 위험이 있는 곳 파악                     |
| 3   | [**/lagune-plan**](https://lagune.ai/ko-KR/docs/commands/plan)       | detect 단계에서 찾은 내용을 발견 사항별 수정이 담긴 방어 계획으로 정리 |
| 4   | [**/lagune-harden**](https://lagune.ai/ko-KR/docs/commands/harden)   | 계획의 수정을 하나씩 안전하게 코드에 적용                              |
| 5   | [**/lagune-verify**](https://lagune.ai/ko-KR/docs/commands/verify)   | 적용한 수정이 실제로 효과가 있는지 증명하고, 효과가 있는 수정은 마무리 |

---

#### 특수 스킬

| 스킬                                                | 하는 일                                                                                      |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [**/lagune-specialize**](https://lagune.ai/ko-KR/docs/commands/specialize) | 아티클, 익스플로잇 또는 주제를 바탕으로 **Lagune**에 새 보안 전문 지식 추가                  |
| [**/lagune-prove**](https://lagune.ai/ko-KR/docs/commands/prove)           | 탐지된 발견 사항을 하나하나 책임 있는 공개에 쓸 수 있는, 실행 가능한 방어 전용 증명으로 변환 |

---

#### 내부 스킬

| 스킬                                        | 하는 일                     |
| ------------------------------------------- | --------------------------- |
| [**/lagune-repair**](https://lagune.ai/ko-KR/docs/commands/repair) | **Lagune**의 내부 추적 복구 |

**팁**

보안은 비용이 아니라 투자입니다: 처음에 들인 만큼, 겪지 않은 사고에서 몇 배로 아끼게 됩니다 🙋🏻‍♂️

## 자주 묻는 질문

### Lagune은 어떤 스킬을 추가하나요?

개발하는 동안 작업의 보안을 강화하는 /lagune 명령어와, 5단계 Blue Team 감사 흐름을 이루는 /lagune-charter, /lagune-detect, /lagune-plan, /lagune-harden, /lagune-verify 명령어입니다. 그 밖에 /lagune-specialize 명령어와 /lagune-prove 명령어도 있습니다.

### Lagune의 Blue Team 흐름은 무엇인가요?

5단계로 이루어진 감사입니다: charter(규칙 정하기), detect(위험 파악하기), plan(점수를 매기고 수정 계획하기), harden(수정 적용하기), verify(수정이 실제로 효과가 있는지 증명하고 종결하기).

### /lagune 명령어와 감사 흐름은 무엇이 다른가요?

/lagune 명령어는 따라야 할 흐름 없이, 작성하는 동안 새 작업을 안전하게 만듭니다. 감사 흐름은 기존 프로젝트를 대상으로 다섯 단계를 차례로 실행합니다.
