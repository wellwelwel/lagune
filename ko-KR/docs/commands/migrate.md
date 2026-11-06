# Migrate: 매니페스트 기반 Lagune 프로젝트를 스킬과 플러그인으로 옮기기

> 매니페스트 기반 Lagune 프로젝트를 보안 원칙, 산출물, 추적, 직접 만든 전문 지식을 그대로 유지한 채 스킬 기반 Lagune으로 옮깁니다.

표준 URL: https://lagune.ai/ko-KR/docs/commands/migrate
언어: ko-KR
원문: https://lagune.ai/docs/commands/migrate
마지막 업데이트: 2026-11-03

🔀 매니페스트 기반 **Lagune** 프로젝트를 작성한 내용을 모두 유지한 채 스킬 기반 **Lagune**으로 옮깁니다.

**지원 중단 안내**

매니페스트가 있는 프로젝트는 `v1.x` 버전까지 지금처럼 작동합니다. `npx lagune` 명령어가 `init`, `pull`, `update`, `add`, `remove`, `list` 명령어와 대시보드를 매니페스트 기반의 마지막 버전인 `lagune@0.15.0` 버전에 넘기기 때문입니다.

## 옮기기

1. 현재 작업이 커밋되어 있는지 확인한 뒤, 프로젝트 루트에서 migrate 명령어를 실행하세요.

   ```bash
   npx lagune migrate
   ```

2. migrate 명령어가 바꾼 내용만 커밋해, 이번 이동을 검토하기 쉬운 하나의 변경으로 남기세요.
3. [설치 페이지](https://lagune.ai/ko-KR/docs)의 안내에 따라 사용하는 에이전트에 맞는 명령어를 설치하세요.
4. 프로젝트에 이미 detect, plan, harden 산출물이 있다면, [`/lagune-repair`](https://lagune.ai/ko-KR/docs/commands/repair) 명령어에 산출물과 직접 만든 전문 지식에 남아 있는 예전 참조를 현재 상태와 대조해 갱신해 달라고 요청하세요.

   ```prompt
   /lagune-repair `.lagune/memory/` 폴더 아래 산출물(`detect.md`, `plan.md`, `harden.md`)에 있는 적용된 전문 지식(예전 이름은 sub-skills)을 새 카탈로그에 나오는 이름과 대조해서 갱신해 줘. 그리고 `.lagune/catalog/` 폴더에 있는 내 전문 지식이 `.lagune/hooks/` 폴더의 예전 훅을 호출하는 부분을 모두 `lagune_read` 또는 `lagune_write` 도구 호출로 바꿔 줘.
   ```

## 바뀌는 내용

| 이전                                                                 | 이후                                                                        |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `.lagune/templates/`, `.lagune/hooks/`, `.lagune/specializations.md` | 삭제: 템플릿은 각 스킬에 들어 있고 훅은 엔진이 실행함                       |
| `.lagune/skills/` 폴더에 있는 내장 전문 지식 사본                    | 삭제: 내장 전문 지식은 엔진이 제공함                                        |
| `.lagune/skills/` 폴더에 있는 직접 만든 전문 지식                    | `.lagune/catalog/` 폴더로 이동                                              |
| `.lagune/skills.json` 파일(직접 만든 전문 지식의 색인)               | `.lagune/configs.json` 파일에 병합                                          |
| 매니페스트의 카테고리                                                | `.lagune/configs.json` 파일에 기록                                          |
| `/lagune.detect` 같은 예전 에이전트 명령어                           | 삭제: [**Lagune**을 설치하면](https://lagune.ai/ko-KR/docs) `/lagune-detect` 같은 새 명령어가 생김 |
| `.gitignore` 파일의 **Lagune** 블록                                  | 삭제, 다른 내용이 없었다면 파일도 함께 삭제                                 |
| 그 블록이 무시하던 `.lagune/proofs/` 폴더                            | 자체 `.gitignore` 파일로 커밋에서 제외                                      |
| `.lagune/manifest.json`                                              | 마지막으로 삭제                                                             |

보안 작업은 그대로 유지됩니다. 보안 원칙, 각 단계가 만든 산출물, 각 발견 사항이 가리키는 경로를 담은 추적 맵이 모두 남습니다.

## 자주 묻는 질문

### 꼭 마이그레이션해야 하나요?

네. 매니페스트 기반 프로젝트는 지원 중단되었고 v1.x 버전까지만 작동하므로, npx lagune migrate 명령어를 실행해 옮기세요.

### migrate 명령어는 무엇을 유지하나요?

보안 원칙, 모든 단계의 산출물, 추적 맵, 카테고리, 직접 만든 전문 지식을 유지합니다. 전문 지식은 .lagune/catalog/ 폴더로 옮겨지고, 그 색인은 카테고리와 함께 .lagune/configs.json 파일에 들어갑니다.

### 새 명령어는 언제 설치하나요?

migrate 명령어를 실행한 뒤, 설치 페이지에서 사용하는 에이전트에 맞는 방법으로 설치하세요. migrate 명령어는 새 /lagune 명령어를 남겨 두므로 먼저 설치해도 됩니다.

### 팀원이 이미 마이그레이션했다면 무엇을 실행해야 하나요?

마이그레이션된 변경 사항을 pull한 뒤 npx lagune migrate 명령어를 한 번 실행하세요. 매니페스트 기반 Lagune이 로컬 클론에 남긴 것(버전 관리에는 한 번도 포함되지 않았던 것)을 지우고, 증명 파일이 커밋되지 않게 합니다.
