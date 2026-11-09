# 定期監査：Lagune をスケジュールで自動実行する

> 自分のキーを使う GitHub Actions、または Claude Code、Codex、Cursor、Antigravity、OpenCode で Lagune の定期監査を設定します。新たなリスクを報告するだけにすることも、Blue Team フロー全体を実行することもできます。

正規 URL: https://lagune.ai/ja-JP/docs/examples/scheduled-audits
言語: ja-JP
原文: https://lagune.ai/docs/examples/scheduled-audits
最終更新日: 2026-11-09

**Lagune** がスケジュールに沿ってプロジェクトを自動で監査するように設定します。見つかった内容を報告するだけにすることも、Blue Team フロー全体を実行することもできます。

## スケジュールの設定

**Universal**

**GitHub Actions** は [**GitHub Agentic Workflows**](https://github.github.com/gh-aw/) を使ってクラウドで監査を実行します。**Copilot CLI** エンジンが、選んだモデルプロバイダーを自分のキーで呼び出すため、エージェントのサブスクリプションは不要です：

- `gh extension install github/gh-aw` で拡張機能をインストールします。
- `gh secret set PROVIDER_API_KEY` で、プロバイダーのキーをリポジトリのシークレットとして保存します。
- このワークフローを `.github/workflows/lagune-audit.md` として保存し、`<model>` をツール呼び出しに対応したプロバイダーのモデルに、`<your-prompt>` を [プロンプト例](#prompt-examples) のいずれかに置き換えます：

  ```md
  ---
  on:
    schedule:
      - cron: '0 9 * * 1'
  permissions:
    contents: read
  engine:
    id: copilot
    model: <model>
    env:
      COPILOT_PROVIDER_TYPE: <type>
      COPILOT_PROVIDER_BASE_URL: <url>
      COPILOT_PROVIDER_API_KEY: ${{ secrets.PROVIDER_API_KEY }}
  skills:
    - wellwelwel/lagune@v0.18.1
  network:
    allowed:
      - defaults
      - node
  tools:
    edit:
    bash: [npx]
  safe-outputs:
    create-pull-request:
  ---

  <your-prompt>

  そのあと、変更内容でプルリクエストを作成してください。
  ```

  | プロバイダー                                     | `<type>`    | `<url>`                                               |
  | ------------------------------------------------ | ----------- | ----------------------------------------------------- |
  | **OpenAI**                                       | `openai`    | `https://api.openai.com/v1`                           |
  | **Anthropic**                                    | `anthropic` | `https://api.anthropic.com`                           |
  | **OpenRouter** など、**OpenAI** 互換の任意の API | `openai`    | そのベース URL（`https://openrouter.ai/api/v1` など） |

- `gh aw compile` を実行し、生成された `.lock.yml` ファイルと一緒にワークフローをコミットします。

**クラウド**では、コンピューターの電源が切れていても監査が実行されます：

- プラグインではなく [汎用インストール](https://lagune.ai/ja-JP/docs/install/universal) で **Lagune** をリポジトリにコミットします。
- **Claude Code** のセッションで `/schedule` と入力して監査の内容を伝えるか、[claude.ai/code/routines](https://claude.ai/code/routines) で作成します。

**自分のコンピューター**では、自分用にインストールしたプラグインで監査します：

- デスクトップアプリの **Scheduled tasks** ページでローカルタスクを作成します。
- ツールを承認する人がその場にいないため、[インストールページ](https://lagune.ai/ja-JP/docs/install/claude-code) にあるとおり、あらかじめエンジンを許可しておきます。
- タスクは、アプリが開いていて、コンピューターがスリープしていない間だけ実行されます。

スケジュールされたタスクは **ChatGPT** デスクトップアプリで作成し（**Codex CLI** ではありません）、自分のコンピューターで実行されます：

- **Codex** のチャットで、監査の内容と実行タイミング、そして実行のたびに新しいチャットを始めることを伝えます。結果は **Scheduled** に表示されます。
- プロンプトでは各コマンドを `$` 付きで指定し（`$lagune:lagune-detect` など）、実行時に明示的に呼び出されるようにします。
- 新しい worktree ではなく、ローカルのプロジェクトを選びます。新しい worktree には、[プロジェクトにインストールした](https://lagune.ai/ja-JP/docs/install/codex) エンジンがないためです。
- タスクは、アプリが開いていて、コンピューターの電源が入っており、プロジェクトがディスク上にある間だけ実行されます。

**Cursor** の Automations はクラウドで実行され、コンピューターの電源が切れていても動きます：

- プラグインではなく [汎用インストール](https://lagune.ai/ja-JP/docs/install/universal) で **Lagune** をリポジトリにコミットします。
- [cursor.com/automations](https://cursor.com/automations) で automation を作成するか、エージェントのセッションで `/automate` を使って内容を伝え、スケジュールトリガーを設定します。
- スケジュールトリガーはリポジトリなしで始まるため、リポジトリを選択します。

**Antigravity** の Automations は自分のコンピューターで、毎回新しい会話として実行されます：

- **Antigravity** アプリで **Automations** タブを開き、プロジェクト用にスケジュール実行の automation を作成するか、エージェントに設定を頼みます。
- ツールを承認する人がその場にいないため、[インストールページ](https://lagune.ai/ja-JP/docs/install/antigravity-cli) にあるとおり、あらかじめエンジンを許可しておきます。
- `/schedule` はその会話が続く間しか有効でないため、代わりに automation を使います。
- automation は **Antigravity** が起動している間だけ実行されます。

**OpenCode** には独自のスケジューラーがないため、監査はクラウドの **GitHub Actions** から実行します：

- [インストールページ](https://lagune.ai/ja-JP/docs/install/opencode) にあるとおり、リポジトリの `opencode.json` で **Lagune** をコミットします。
- `opencode github install` を実行して **OpenCode** の GitHub アプリを接続し、モデルプロバイダーのキーを保存します。
- スケジュールに沿ってプロンプトを **OpenCode** に渡すワークフローを追加します（ここでは毎週月曜 09:00 UTC）。`<KEY>` と `<provider>/<model>` は `opencode github install` が作成したワークフローと同じ値にし、`<your-prompt>` は [プロンプト例](#prompt-examples) のいずれかに置き換えます：

  ```yaml
  name: Lagune Audit

  on:
    schedule:
      - cron: '0 9 * * 1'

  jobs:
    audit:
      runs-on: ubuntu-latest
      permissions:
        id-token: write
        contents: read
      steps:
        - uses: actions/checkout@v6
          with:
            persist-credentials: false

        - uses: anomalyco/opencode/github@latest
          env:
            <KEY>: ${{ secrets.<KEY> }}
          with:
            model: <provider>/<model>
            prompt: |
              <your-prompt>
  ```

### プロンプト例 \{#prompt-examples}

**💧 報告のみ**

コードは変更せずに、新たなリスクを洗い出し、その修正を計画し、適用済みの対策を再確認します：

```md
次のコマンドを 1 つずつ実行してください：`/lagune-detect`、`/lagune-plan`。プロジェクトに堅牢化の記録がある場合は、`/lagune-verify` も実行してください。

プロジェクトのコードは変更しないでください。最後に、新しい検出事項と、有効でなくなった適用済みの対策をまとめてください。
```

**🌊 フルサイクル**

計画した修正の適用と、それぞれが有効であることの証明まで行うため、変更がメインブランチに入る前にレビューしてください：

```md
次のコマンドを 1 つずつ実行してください：`/lagune-detect`、`/lagune-plan`、`/lagune-harden`、`/lagune-verify`。

最後に、適用した修正と、まだ解決していない検出事項をまとめてください。
```
