import type { LanguageId } from '../../types/hooks/regex.js';
import type { LineRule } from '../../types/scan.js';

const REVIEW = 'review statically, never run it';

const C_FAMILY: LineRule[] = [
  {
    regex: /\bsystem\s{0,16}\(/,
    detail: `system() runs a shell command (C/C++): ${REVIEW}`,
  },
  {
    regex: /\bpopen\s{0,16}\(/,
    detail: `popen() runs a shell command (C/C++): ${REVIEW}`,
  },
  {
    regex: /\bf?exec(?:l|lp|le|v|vp|vpe|ve)\s{0,16}\(/,
    detail: `exec* replaces the process image with another program (C/C++): ${REVIEW}`,
  },
];

const JVM_FAMILY: LineRule[] = [
  {
    regex: /\.exec\s{0,16}\(/,
    detail: `Runtime.exec spawns a system process (JVM): ${REVIEW}`,
  },
  {
    regex: /\bnew\s{1,16}ProcessBuilder\s{0,16}\(/,
    detail: `ProcessBuilder runs a system process (JVM): ${REVIEW}`,
  },
  {
    regex: /\bScriptEngine\b/,
    detail: `ScriptEngine.eval runs a script string (JVM): ${REVIEW}`,
  },
  {
    regex: /\bObjectInputStream\b|\.readObject\s{0,16}\(/,
    detail: `ObjectInputStream.readObject can run gadget code on load (JVM): ${REVIEW}`,
  },
];

const SINK_RULES: Partial<Record<LanguageId, LineRule[]>> = {
  javascript: [
    {
      regex:
        /(?<![.\w])eval\s{0,16}\(|(?<![.\w])eval\s{0,16}\?\.\s{0,16}\(|\(\s{0,8}0\s{0,8},\s{0,8}eval\s{0,8}\)|(?:globalThis|window|self)\s{0,16}\[\s{0,16}['"`]eval['"`]\s{0,16}\]/,
      detail: `eval() (incl. indirect / optional-call forms) runs a string as code: ${REVIEW}`,
    },
    {
      regex: /(?<![.\w])Function\s{0,16}\(/,
      detail: `Function constructor (with or without new) compiles a string into code: ${REVIEW}`,
    },
    {
      regex: /\b(?:setTimeout|setInterval)\s{0,16}\(\s{0,16}['"`]/,
      detail: `setTimeout/setInterval with a string body evaluates code: ${REVIEW}`,
    },
    {
      regex:
        /\bvm\.(?:runInNewContext|runInThisContext|runInContext|compileFunction)\s{0,16}\(|\bnew\s{1,16}vm\.Script\s{0,16}\(/,
      detail: `vm module executes a string as code: ${REVIEW}`,
    },
    {
      regex:
        /\bchild_process\b|\bexecSync\s{0,16}\(|\bexec\s{0,16}\(\s{0,16}['"`]/,
      detail: `child_process exec spawns a shell command: ${REVIEW}`,
    },
    {
      regex:
        /\brequire\s{0,16}\(\s{0,16}(?:[^\s'"`)/]|['"`][^)]{0,200}(?:\+|\$\{))/,
      detail: `require() with a non-literal or interpolated specifier loads code at runtime: ${REVIEW}`,
    },
    {
      regex:
        /\bimport\s{0,16}\(\s{0,16}(?:[^\s'"`)/]|['"`][^)]{0,200}(?:\+|\$\{))/,
      detail: `import() with a non-literal or interpolated specifier loads code at runtime: ${REVIEW}`,
    },
  ],
  python: [
    {
      regex: /(?<![.\w])(?:eval|exec)\s{0,16}\(/,
      detail: `eval/exec run a string as code: ${REVIEW}`,
    },
    {
      regex: /\b__import__\s{0,16}\(/,
      detail: `__import__() loads a module named at runtime: ${REVIEW}`,
    },
    {
      regex:
        /\bos\.(?:system|popen|exec[lv]\w{0,16}|spawn[lv]\w{0,16})\s{0,16}\(|\bsubprocess\.getoutput\s{0,16}\(/,
      detail: `os / subprocess process launcher runs a command: ${REVIEW}`,
    },
    {
      regex: /\bshell\s{0,16}=\s{0,16}True\b/,
      detail: `subprocess with shell=True runs a shell command: ${REVIEW}`,
    },
    {
      regex: /\b(?:pickle|cPickle)\.loads?\s{0,16}\(/,
      detail: `pickle.load/loads can run arbitrary objects on load: ${REVIEW}`,
    },
    {
      regex: /\byaml\.(?:unsafe_load|load)\s{0,16}\(/,
      detail: `yaml.load without SafeLoader can instantiate arbitrary objects: ${REVIEW}`,
    },
  ],
  php: [
    {
      regex: /\beval\s{0,16}\(/,
      detail: `eval() runs a string as code: ${REVIEW}`,
    },
    {
      regex: /\bassert\s{0,16}\(\s{0,16}['"]/,
      detail: `assert() on a string evaluates it as code (PHP): ${REVIEW}`,
    },
    {
      regex: /\bcreate_function\s{0,16}\(/,
      detail: `create_function() compiles a string into a function (PHP): ${REVIEW}`,
    },
    {
      regex:
        /(?<![>:$\w])(?:system|exec|shell_exec|passthru|popen|proc_open)\s{0,16}\(/,
      detail: `shell exec function runs a system command (PHP): ${REVIEW}`,
    },
    {
      regex: /`[^`\n]{1,400}`/,
      detail: `backtick operator runs a shell command (PHP): ${REVIEW}`,
    },
    {
      regex: /\bcall_user_func(?:_array)?\s{0,16}\(/,
      detail: `call_user_func dispatches a function named at runtime (PHP): ${REVIEW}`,
    },
    {
      regex: /\b(?:include|include_once|require|require_once)\b[^\n;]{0,40}\$/,
      detail: `include/require with a runtime path loads code (PHP): ${REVIEW}`,
    },
  ],
  ruby: [
    {
      regex: /\b(?:instance_eval|class_eval|module_eval|eval)\b/,
      detail: `eval family runs a string as code (Ruby): ${REVIEW}`,
    },
    {
      regex: /\b(?:system|exec)\b\s{0,16}(?:\(|['"])/,
      detail: `system/exec run a shell command (Ruby): ${REVIEW}`,
    },
    {
      regex: /\bProcess\.spawn\s{0,16}\(|(?<![.\w])spawn\s{0,16}\(/,
      detail: `Process.spawn / Kernel#spawn launch a process (Ruby): ${REVIEW}`,
    },
    {
      regex: /`[^`\n]{1,400}`|%x[^\w\s]/,
      detail: `backticks or %x run a shell command (Ruby): ${REVIEW}`,
    },
    {
      regex:
        /(?<![.\w])open\s{0,16}\(|\bIO\.(?:popen|read|binread)\s{0,16}\(|\bOpen3\b/,
      detail: `Kernel#open / IO can run a command via a leading pipe (Ruby): ${REVIEW}`,
    },
    {
      regex: /\bMarshal\.load\s{0,16}\(/,
      detail: `Marshal.load reconstructs and can run arbitrary objects (Ruby): ${REVIEW}`,
    },
  ],
  java: JVM_FAMILY,
  kotlin: JVM_FAMILY,
  go: [
    {
      regex: /\bexec\.Command(?:Context)?\s{0,16}\(/,
      detail: `exec.Command runs a system process (Go): ${REVIEW}`,
    },
    {
      regex: /\bplugin\.Open\s{0,16}\(/,
      detail: `plugin.Open loads and runs a shared object (Go): ${REVIEW}`,
    },
  ],
  rust: [
    {
      regex: /\bCommand::new\s{0,16}\(/,
      detail: `Command::new runs a system process (Rust): ${REVIEW}`,
    },
    {
      regex: /\bprocess::Command\b/,
      detail: `process::Command runs a system process (Rust): ${REVIEW}`,
    },
  ],
  c: C_FAMILY,
  cpp: C_FAMILY,
  csharp: [
    {
      regex: /\bProcess\.Start\s{0,16}\(|\bnew\s{1,16}Process\s{0,16}\(/,
      detail: `Process.Start runs a system process (.NET): ${REVIEW}`,
    },
    {
      regex: /\bBinaryFormatter\b/,
      detail: `BinaryFormatter can run gadget code on load (.NET): ${REVIEW}`,
    },
    {
      regex: /\bAssembly\.Load\w{0,20}\s{0,16}\(/,
      detail: `Assembly.Load loads and runs code at runtime (.NET): ${REVIEW}`,
    },
  ],
};

export const SUPPORTED_LANGUAGES: readonly LanguageId[] = Object.keys(
  SINK_RULES
) as LanguageId[];

export const rulesOf = (language: LanguageId): LineRule[] =>
  SINK_RULES[language] ?? [];

export const isSupportedLanguage = (value: string): value is LanguageId =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
