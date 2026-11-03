# agent hook'u: sınırsız ajan döngülerini tespit edin

> Kod tabanını adım veya süre sınırı olmayan ajan ve LLM çağrılarına karşı tarayın ya da tek bir çağrıyı doğrudan komut satırından değerlendirin.

Kanonik URL: https://lagune.ai/tr-TR/docs/hooks/agent
Dil: tr-TR
Orijinal: https://lagune.ai/docs/hooks/agent
Son güncelleme: 2026-11-03

`agent` hook'u, **tur, bütçe veya süre sınırı olmadan döngüye giren ajan çalışma ortamlarını** işaretler. Bu, özel hazırlanmış bir girdiyi sınırsız maliyete ya da prompt injection yoluyla yetki yükseltmeye dönüştüren, kontrolden çıkmış özerklik açığıdır. Hook **dile duyarlıdır** ve iki ajan çatısı ekosistemini kapsar: **JavaScript** (**Claude** ajan SDK'sının `query` çalışma ortamı) ve **Python** (**LangChain**, **LangGraph**, **CrewAI**, **OpenAI Agents**). [`llm` uzmanlığının](https://lagune.ai/tr-TR/docs/catalog) arkasındaki deterministik motordur ve onu **scan** veya **check** modunda kendiniz çalıştırabilirsiniz.

## Çalıştırma

**Kod tabanını tara**

```bash
npx lagune read agent                # scans the whole project
npx lagune read agent --dir src/ai   # scans a directory
npx lagune read agent --file chat.ts # scans a single file
```

**Bir çağrıyı kontrol et**

```bash
npx lagune read agent --lang javascript --pattern 'query({ prompt })'                           # => uncapped
npx lagune read agent --lang javascript --pattern 'query({ prompt, options: { maxTurns: 5 } })' # => safe
npx lagune read agent --lang python --pattern 'AgentExecutor(agent=a, max_iterations=None)'     # => uncapped
```

**Uncapped agent loops found** altındaki her satır, bir ajan SDK'sını içe aktaran bir dosyada şu ikisinden biridir: tur, bütçe veya süre sınırı olmadan çağrılan Claude ajan SDK'sının `query` çalışma ortamı (JavaScript, varsayılan olarak sınırsız) ya da bir çatının varsayılan sınırının `max_iterations=None` / `max_turns=None` gibi açıkça kaldırılması (Python, varsayılan olarak sınırlı). Her iki durumda da hook sıfırdan farklı bir kodla çıkar. Vercel AI SDK'sının `generateText`/`streamText` fonksiyonları varsayılan olarak tek adım çalışır (`stopWhen: stepCountIs(1)`), bu yüzden oradaki yalın bir çağrı döngüye giremez ve işaretlenmez. Sıradan bir `db.query(...)` da asla ajan çağrısıyla karıştırılmaz. Temiz bir çalıştırma `no uncapped agent loops found` çıktısını verir.

## Kararı nasıl okumalı

| Karar      | Anlamı                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| `uncapped` | Sınır koymayan bir `query` çalışma ortamı çağrısı (JS) ya da sınırın açıkça kaldırılması (`=None`, Py).  |
| `safe`     | Sınır koyan bir `query` çağrısı, tek adımlı bir üretim ya da varsayılan olarak sınırlı bir çatı çağrısı. |
| `invalid`  | Kod parçası, değerlendirilebilecek tanınır bir ajan çağrısı içermiyor.                                   |

### CLI seçenekleri

| Seçenek     | Değer           | Açıklama                                                                                            |
| ----------- | --------------- | --------------------------------------------------------------------------------------------------- |
| `--pattern` | bir kod parçası | Tek bir çağrıyı kontrol eder. Birkaçını kontrol etmek için tekrarlayın, her satıra bir karar düşer. |
| `--lang`    | bir dil         | `--pattern` ile zorunludur: `javascript` veya `python`.                                             |
| `--dir`     | bir dizin       | Taramayı bir dizinle sınırlar. Tekrarlanabilir ve `--file` ile birleştirilebilir.                   |
| `--file`    | bir dosya       | Taramayı tek bir dosyayla sınırlar. Tekrarlanabilir ve `--dir` ile birleştirilebilir.               |

Seçenek verilmezse tüm proje taranır. `--pattern`, `--lang` gerektirir ve `--dir` ya da `--file` ile birleştirilemez.

**Elden gelenin en iyisi, ama eksiksiz değil**

Herhangi bir dilde elle yazılmış bir ajan döngüsü, statik bir taramanın erişebileceği şey değildir. Bunu eksiksiz bir envanter olarak değil, sağlam bir taban olarak görün.

**İpucu**

Hook yalnızca sınırın varlığına karar verir: yetenek kapsamını daraltma, güven düzeylerinin karışması ve yetkilendirme, değerlendirme gerektiren konulardır ve onları [`llm` uzmanlığı](https://lagune.ai/tr-TR/docs/catalog) kapsamaya devam eder.

## Sıkça sorulan sorular

### Bir ajan döngüsüne neden sınır koymalıyım?

Sınırsız bir ajan, sonsuz özyinelemeye, sınırsız maliyete ya da prompt injection yoluyla yetki yükseltmeye sürüklenebilir. maxTurns, maxBudgetUsd, stopWhen veya signal ayarlamak onu sınırlar. agent hook'u ise bunların hiçbirini ayarlamayan bir query çalışma ortamı çağrısını işaretler.
