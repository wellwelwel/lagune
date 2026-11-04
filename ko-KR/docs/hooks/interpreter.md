# interpreter 훅: 동적 코드 실행 싱크 잡아내기

> 명령줄에서 코드베이스를 스캔해 여러 언어의 동적 코드 실행 싱크를 찾거나, 코드 조각 하나에 점수를 매길 수 있습니다.

표준 URL: https://lagune.ai/ko-KR/docs/hooks/interpreter
언어: ko-KR
원문: https://lagune.ai/docs/hooks/interpreter
마지막 업데이트: 2026-11-04

`interpreter` 훅은 데이터를 실행되는 코드로 바꾸거나 셸에 넘기는 구문, 즉 **동적 코드 실행 싱크**를 잡아냅니다. `eval` 호출부터 네이티브 역직렬화까지 모두 여기에 해당합니다. 언어를 인식해 파일마다 그 언어의 규칙으로 읽습니다. 또한 [`interpreter` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)을 뒷받침하는 결정론적 엔진이며, **scan** 모드나 **check** 모드로 직접 실행할 수도 있습니다.

## 실행하기

**코드베이스 스캔**

```bash
npx lagune read interpreter               # scans the whole project
npx lagune read interpreter --dir src     # scans a directory
npx lagune read interpreter --file app.py # scans a single file
```

**코드 조각 검사**

```bash
npx lagune read interpreter --lang javascript --pattern 'eval(x)'   # => careful
npx lagune read interpreter --lang python --pattern 'json.loads(x)' # => safe
```

이런 싱크는 정상적인 용도로도, 위험한 용도로도 쓰일 수 있습니다. 공격자가 영향을 줄 수 있는 입력이 싱크에 도달하는지는 정적 스캔으로 판단할 수 없으므로, 일치하는 항목은 모두 확정된 발견 사항이 아니라 **검토할 주의 사항**입니다. 스캔은 파일별로 묶은 **Dynamic-execution sinks to review** 섹션 하나를 출력합니다. 아무것도 발견되지 않으면 `no dynamic-execution sinks found` 메시지를 출력합니다.

**잡아낸 코드는 읽기만 하고, 절대 실행하지 마세요!**

신뢰할 수 없는 입력이 각 싱크에 도달하는지 추적하며 **정적으로** 분석하세요. 어떻게 동작하는지 "테스트"하겠다고 잡아낸 코드를 실행하거나 `eval` 함수에 넘기는 일은 절대 하지 마세요. 그 코드가 불러오는 원격 코드나 런타임에 가져오는 코드도 마찬가지입니다.

## 판정 해석하기

| 판정      | 의미                                                                        |
| --------- | --------------------------------------------------------------------------- |
| `careful` | 해당 언어의 동적 실행 싱크가 들어 있는 코드 조각. 실행하지 말고 읽어서 검토 |
| `safe`    | 지정한 언어의 동적 실행 싱크가 발견되지 않음                                |

### CLI 옵션

| 옵션        | 값        | 설명                                                                                                         |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `--pattern` | 코드 조각 | 코드 조각 하나 검사. 반복해 지정하면 여러 코드 조각을 검사해 한 줄에 판정 하나씩 출력                        |
| `--lang`    | 언어      | `--pattern` 옵션 사용 시 필수: javascript, python, php, ruby, java, kotlin, go, rust, c, cpp, csharp 중 하나 |
| `--dir`     | 디렉터리  | 스캔 범위를 디렉터리로 한정. 반복 지정 가능, `--file` 옵션과 함께 사용 가능                                  |
| `--file`    | 파일      | 스캔 범위를 단일 파일로 한정. 반복 지정 가능, `--dir` 옵션과 함께 사용 가능                                  |

옵션을 지정하지 않으면 프로젝트 전체를 스캔합니다. `--pattern` 옵션에는 `--lang` 옵션이 필요하며, `--dir` 또는 `--file` 옵션과 함께 쓸 수 없습니다.

### 스캔 대상 선택하기

**Git**이 무시하는 항목은 건너뜁니다. 더 많은 항목을 제외하거나 **Git**이 무시하는 항목도 스캔하려면 `interpreter` 훅에 전용 설정을 지정하세요:

```bash
npx lagune write add --ignore test/fixtures --checker interpreter
```

```json
{
  "checkers": {
    "interpreter": { "gitignore": false, "ignore": ["test/fixtures"] }
  }
}
```

모든 설정은 [훅 설정하기](https://lagune.ai/ko-KR/docs/hooks/configure)에서 설명합니다.

### 지원 언어

스캔은 파일 확장자로 다음 언어를 구분해 읽고, 언어마다 고유한 동적 실행 싱크 목록과 대조해 검사합니다.

| #   | 언어                        | 확장자                                                                                                       | 잡아내는 싱크                                                                                                                                                                                                  |
| --- | --------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **JavaScript / TypeScript** | `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts`, `.cts`, `.astro`, `.vue`, `.svelte`, `.marko`, `.riot` | `eval()`, Function 생성자, 문자열 본문을 받는 `setTimeout`/`setInterval`, `vm` 모듈, `child_process` exec, 동적 `require()`, 동적 `import()`                                                                   |
| 2   | **Python**                  | `.py`, `.pyi`                                                                                                | `eval`/`exec`, `__import__()`, `os.system`/`os.popen`, `subprocess` `shell=True`, `pickle.load`/`loads`, `yaml.load`(안전하지 않은 사용)                                                                       |
| 3   | **Ruby**                    | `.rb`                                                                                                        | eval 계열(`instance_eval`/`class_eval`/`module_eval`/`eval`), `system`/`exec`, 백틱 또는 `%x`, `Kernel#open` / `IO.popen`/`read`/`binread` / `Open3`, `Process.spawn`, `Marshal.load`                          |
| 4   | **Go**                      | `.go`                                                                                                        | `exec.Command`/`exec.CommandContext`, `plugin.Open`                                                                                                                                                            |
| 5   | **PHP**                     | `.php`                                                                                                       | `eval()`, 문자열을 넘긴 `assert()`, `create_function()`, 셸 실행(`system`/`exec`/`shell_exec`/`passthru`/`popen`/`proc_open`), `call_user_func`/`call_user_func_array`, 런타임 경로를 쓰는 `include`/`require` |
| 6   | **Rust**                    | `.rs`                                                                                                        | `Command::new`, `process::Command`                                                                                                                                                                             |
| 7   | **Java**                    | `.java`                                                                                                      | `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                               |
| 8   | **Kotlin**                  | `.kt`, `.kts`                                                                                                | JVM 싱크: `Runtime.exec`, `ProcessBuilder`, `ScriptEngine`, `ObjectInputStream.readObject`                                                                                                                     |
| 9   | **C#**                      | `.cs`                                                                                                        | `Process.Start` / `new Process`, `BinaryFormatter`, `Assembly.Load`                                                                                                                                            |
| 10  | **C**                       | `.c`, `.h`                                                                                                   | `system()`, `popen()`, `exec*` 계열(`execl`, `execve`, `execvp`, …)                                                                                                                                            |
| 11  | **C++**                     | `.cc`, `.cpp`, `.cxx`, `.hpp`, `.hh`, `.hxx`                                                                 | `system()`, `popen()`, `exec*` 계열(`execl`, `execve`, `execvp`, …)                                                                                                                                            |

**전수 검사가 아닌 최선의 탐지**

소스 코드를 텍스트로 읽으므로, 런타임에 조합되거나 별칭 뒤에 숨겨졌거나 인식하지 못하는 형태로 작성된 싱크는 놓칠 수 있습니다. 이 표를 완전한 목록이 아니라 든든한 출발점으로 활용하세요.

**팁**

훅이 보장하는 것은 최소 기준(이런 싱크가 존재한다는 사실과 그 위치)입니다. 신뢰할 수 없는 값이 실제로 싱크에 도달하는지는 [`interpreter` 전문 지식](https://lagune.ai/ko-KR/docs/catalog)이 다루는 판단입니다.

## 자주 묻는 질문

### interpreter 훅으로 취약점을 확정할 수 있나요?

아니요. 동적 실행 싱크를 확정된 발견 사항이 아니라 검토할 주의 사항으로 잡아냅니다. 공격자가 영향을 줄 수 있는 입력이 싱크에 도달하는지는 정적 스캔으로 판단할 수 없기 때문입니다.

### interpreter 훅은 어떤 언어를 지원하나요?

지원 언어 표에 있는 언어를 파일 확장자로 구분해 읽고, 언어마다 고유한 싱크 목록과 대조해 검사합니다. 그 밖의 언어에서는 싱크를 보고하지 않습니다.
