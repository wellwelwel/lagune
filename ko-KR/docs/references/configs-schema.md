# 설정 스키마

> Lagune 프로젝트 설정 파일의 JSON Schema입니다. 에디터에서 자동 완성과 유효성 검사를 제공하며, 최신 Lagune을 따르게 하거나 특정 버전에 고정할 수 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/references/configs-schema
언어: ko-KR
원문: https://lagune.ai/docs/references/configs-schema
마지막 업데이트: 2026-11-03

`.lagune/configs.json` 파일은 프로젝트가 사용하는 [**카테고리**](https://lagune.ai/ko-KR/docs/categories)를 기록하고, 프로젝트가 직접 만든 [**전문 지식**](https://lagune.ai/ko-KR/docs/catalog)의 색인을 담습니다. 이 파일의 JSON Schema를 사용하면 파일을 편집하는 동안 에디터가 각 필드를 자동 완성하고, 오타나 알 수 없는 카테고리를 잡아냅니다.

## 최신 스키마

**Lagune**은 이 파일을 기록할 때 `$schema` 필드가 없으면, 파일이 최신 스키마를 가리키도록 설정합니다:

```json
{
  "$schema": "https://lagune.ai/schemas/configs.json",
  "categories": ["owasp", "javascript"]
}
```

이 주소는 항상 최신 **Lagune**을 따릅니다. **Lagune** 0.16.0 이전에 작성된 파일은 다음에 변경될 때 이 주소를 받으며, 그전까지는 모든 단계가 이를 알려 줍니다.

## 버전 고정하기

0.16.0부터 나온 모든 **Lagune** 릴리스에는 그 버전 당시의 스키마가 들어 있으며, 이 스키마는 **npm**에 게시되고 **jsDelivr**를 통해 제공됩니다. 버전을 고정하려면 `lagune@` 뒤에 원하는 버전을 적어 `$schema` 주소를 지정하세요:

```json
{
  "$schema": "https://cdn.jsdelivr.net/npm/lagune@0.16.0/schemas/configs.json"
}
```

버전에는 어떤 semver 범위든 쓸 수 있습니다:

| 버전                 | 스키마                    |
| -------------------- | ------------------------- |
| `0.16.0`             | 0.16.0 버전의 스키마      |
| `0.16.x` 또는 `0.16` | 최신 0.16 릴리스의 스키마 |
| `0.x` 또는 `0`       | 최신 0.x 릴리스의 스키마  |
| `latest`             | 최신 릴리스의 스키마      |

## 자주 묻는 질문

### Lagune을 쓰려면 스키마가 꼭 필요한가요?

아니요. 스키마는 에디터를 돕기 위한 것일 뿐이며, Lagune은 $schema 필드가 있든 없든 파일을 똑같이 읽습니다.

### 고정해 둔 스키마를 Lagune이 덮어쓰나요?

아니요. Lagune은 파일에 $schema 필드가 없을 때만 기록하며, 직접 설정한 주소는 그대로 유지합니다.

### 언제 버전을 고정해야 하나요?

프로젝트에서 특정 버전의 Lagune을 사용할 때입니다. 그러면 에디터가 해당 버전이 허용하는 내용을 기준으로 파일을 검증합니다.
