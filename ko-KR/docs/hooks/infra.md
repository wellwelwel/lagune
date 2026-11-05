# infra 훅: IaC 설정 오류 탐지하기

> 명령줄에서 Terraform, Dockerfile, GitHub Actions를 스캔해 설정 오류를 찾거나, 코드 조각 하나에 점수를 매길 수 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/hooks/infra
언어: ko-KR
원문: https://lagune.ai/docs/hooks/infra
마지막 업데이트: 2026-11-05

`infra` 훅은 파일만 보고 판단할 수 있는 **코드형 인프라(IaC) 설정 오류**를 잡아냅니다: 전 세계에 열린 네트워크, 와일드카드 권한, 매니페스트 안의 시크릿, root로 실행되는 컨테이너, CI 셸에 들어가는 신뢰할 수 없는 값이 여기에 해당합니다. 읽는 파일은 IaC 파일(`.tf`/`.tf.json`/`.hcl`, `Dockerfile*`, `.github/workflows/**`)뿐입니다. 또한 [`infra` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)을 뒷받침하는 결정론적 엔진이며, **scan** 모드나 **check** 모드로 동작합니다.

## 실행하기

**코드베이스 스캔**

```bash
npx lagune read infra                   # scans every IaC file
npx lagune read infra --dir infra       # scans a directory
npx lagune read infra --file Dockerfile # scans a single file
```

**코드 조각 검사**

코드 조각은 `--pattern` 옵션으로, 그 종류는 `--kind` 옵션(`terraform`, `dockerfile`, `github-actions` 중 하나)으로 전달하세요.

```bash
npx lagune read infra --kind terraform  --pattern 'actions = ["*"]' # => iam-wildcard
npx lagune read infra --kind dockerfile --pattern 'FROM node:20'    # => mutable-tag
```

스캔 결과는 최대 두 개의 섹션으로 출력됩니다. **Infrastructure risks found** 섹션에는 판단할 수 있는 결함(민감한 포트에 `0.0.0.0/0` 인바운드를 허용하는 규칙, 와일드카드 IAM 구문, 매니페스트 안의 시크릿, `encrypted = false` 설정, 버전이 고정되지 않은 git 모듈, 명시적으로 root로 실행되는 이미지, `curl | sh` 실행, CI 스크립트 인젝션, `permissions: write-all` 설정)이 담기며, 이 섹션이 나오면 0이 아닌 종료 코드를 반환합니다. **Infrastructure hardening advisories** 섹션은 종료 코드를 바꾸지 않습니다(내용이 바뀔 수 있는 베이스 이미지 태그, 태그로만 고정한 액션). 아무것도 발견되지 않으면 `no infrastructure risks found` 메시지를 출력합니다.

## 판정 해석하기

check 모드는 일치한 태그 중 심각도가 가장 높은 태그(예: `public-ingress`, `iam-wildcard`, `root-user`, `curl-pipe`, `script-injection`, `write-all`), 권고 태그(`mutable-tag`, `unpinned-action`), 또는 `safe` 판정을 출력합니다. 0이 아닌 종료 코드를 반환하는 것은 발견 사항 수준의 태그뿐입니다.

### CLI 옵션

| 옵션        | 값                                              | 설명                                                                        |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| `--pattern` | 코드 조각                                       | 코드 조각 하나 검사. `--kind` 옵션 필요. 반복해 지정하면 여러 개 검사       |
| `--kind`    | `terraform` \| `dockerfile` \| `github-actions` | 코드 조각을 어떤 종류로 판정할지 지정                                       |
| `--dir`     | 디렉터리                                        | 스캔 범위를 디렉터리로 한정. 반복 지정 가능, `--file` 옵션과 함께 사용 가능 |
| `--file`    | 파일                                            | 스캔 범위를 단일 파일로 한정. 반복 지정 가능, `--dir` 옵션과 함께 사용 가능 |

옵션을 지정하지 않으면 프로젝트의 모든 IaC 파일을 스캔합니다. `--pattern` 옵션은 `--dir` 또는 `--file` 옵션과 함께 쓸 수 없습니다.

### 스캔 대상 선택하기

**Git**이 무시하는 항목은 건너뜁니다. 더 많은 항목을 제외하거나 **Git**이 무시하는 항목도 스캔하려면 `infra` 훅에 전용 설정을 지정하세요:

```bash
npx lagune write add --ignore examples --checker infra
```

```json
{
  "checkers": {
    "infra": { "gitignore": false, "ignore": ["examples"] }
  }
}
```

모든 설정은 [훅 설정하기](https://lagune.ai/ko-KR/docs/hooks/configure)에서 설명합니다.

**팁**

훅은 명백하고 판단할 수 있는 경우만 잡아냅니다: 암호화 누락, `pull_request_target` 노출, 적절한 IAM 범위처럼 판단이 필요한 부분은 여전히 [`infra` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)이 다룹니다.

## 자주 묻는 질문

### infra 훅은 어떤 인프라 파일을 읽나요?

Terraform/HCL(.tf, .tf.json, .hcl), Dockerfile, 그리고 .github/ 아래에 있는 GitHub Actions 워크플로와 액션 YAML 파일을 읽습니다. 소스 코드 스캐너는 이런 파일을 건너뛰지만, infra 훅은 이 파일까지 읽습니다.
