# 훅 설정하기: 스캔 대상 선택하기

> 파일을 스캔하는 훅이 무엇을 제외할지 모든 훅에 한꺼번에, 또는 훅마다 따로 정할 수 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/hooks/configure
언어: ko-KR
원문: https://lagune.ai/docs/hooks/configure
마지막 업데이트: 2026-11-04

`checkers` 블록은 `.lagune/configs.json` 파일에 있으며, 파일을 스캔하는 훅이 무엇을 제외할지 모든 훅에 한꺼번에, 또는 훅마다 따로 정합니다.

## 설정하기

명령줄에서 경로와 패턴을 추가하거나 제거하세요. 패턴은 셸이 그대로 두도록 따옴표로 감싸세요:

```bash
npx lagune write add --ignore test/fixtures
npx lagune write add --ignore 'packages/*/dist' --checker secrets
npx lagune write remove --ignore test/fixtures
```

또는 파일에서 직접 설정하세요:

```json
{
  "checkers": {
    "ignore": ["test/fixtures"],
    "secrets": { "gitignore": false, "ignore": ["test/fixtures", "temp"] }
  }
}
```

### 설정 항목

| 키          | 값                                | 기본값 | 설명                                                                          |
| ----------- | --------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `gitignore` | `true` 또는 `false`               | `true` | **Git**이 무시하는 항목을 제외. **Git**이 추적하는 파일은 어느 쪽이든 스캔    |
| `ignore`    | 프로젝트 루트 기준 경로 또는 패턴 | `[]`   | 각 항목과 일치하는 대상과 그 아래 전체를 제외. **Git**이 추적하는 파일도 제외 |

`checkers` 블록의 최상위에 둔 키는 모든 검사기에 적용됩니다. 검사기 이름 아래에 둔 키는 그 검사기에만 적용되고 공통 키를 대체합니다. 그래서 위 예시에서 `secrets` 검사기는 **Git**이 무시하는 항목도 스캔하고, `test/fixtures` 경로와 `temp` 경로를 제외합니다. `write add --ignore` 명령어로 검사기에 처음 전용 목록을 만들면, 그 목록은 공통 목록을 복사한 상태로 시작합니다.

### 패턴

패턴은 프로젝트 루트에서 시작하므로 `*.generated.ts` 패턴은 루트에 있는 파일에만 일치하고, `**/*.generated.ts` 패턴은 깊이와 관계없이 일치합니다. 이름은 대소문자까지 정확히 일치해야 합니다.

| 패턴                | 제외 대상                                        |
| ------------------- | ------------------------------------------------ |
| `dist`              | 프로젝트 루트의 `dist`                           |
| `packages/*/dist`   | `dist`(`packages` 아래의 각 폴더 안)             |
| `**/dist`           | 깊이와 관계없이 모든 `dist`                      |
| `**/*.generated.ts` | 이름이 `.generated.ts` 접미사로 끝나는 모든 파일 |
| `fixture-?`         | `fixture-a`, `fixture-1` 등                      |
| `[ab]-cache`        | `a-cache` 및 `b-cache`                           |
| `[*]x`              | `*x`(`*` 기호는 문자 그대로)                     |

## 결과 해석하기

보고서 끝에는 스캔에서 제외한 경로 수가 무엇이 무시했는지에 따라 나뉘어 표시됩니다:

```text
Skipped 25 paths that Git ignores and 3 paths that .lagune/configs.json ignores. Name one with --dir or --file to scan it.
```

`--dir` 또는 `--file` 옵션으로 지정한 경로는 설정과 관계없이 스캔합니다. 엔진이 읽을 수 없는 설정이 있으면 검사기는 그 설정을 짚는 오류를 내고 멈춥니다. 예를 들어 `!` 기호나 공백으로 시작하는 패턴, 프로젝트 밖으로 벗어나는 패턴, 대괄호가 닫히지 않은 패턴, 일치 여부를 판단하는 데 너무 오래 걸리는 패턴이 이에 해당합니다.

## 자주 묻는 질문

### Lagune이 이 설정을 알아서 해 주나요?

아니요. charter가 프로젝트를 읽어 방어할 코드가 아니라고 판단한 커밋된 폴더(취약해 보이도록 작성한 테스트 픽스처 등)를 나열하고, 사용자가 번호로 고른 폴더만 기록합니다.

### 검사기가 Git이 무시하는 항목까지 스캔해야 하는 경우는 언제인가요?

믿을 수 있는 저장소가 아닐 때입니다. 저장소에 포함된 .gitignore 파일이 코드를 숨길 수 있기 때문입니다. 빌드 시점에 인라인된 키가 빌드 폴더에 들어 있을 수 있을 때도 마찬가지입니다. 모든 검사기 또는 특정 검사기 하나에 gitignore를 false로 설정하세요.
