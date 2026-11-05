# ダッシュボード

> このページは英語版より古くなっています。[原文を読む](https://lagune.ai/docs/get-started/dashboard)。

> コマンド 1 つで開くローカルのライブビューで、プロジェクトのセキュリティ原則、検出事項、カタログを確認できます。

正規 URL: https://lagune.ai/ja-JP/docs/get-started/dashboard
言語: ja-JP
原文: https://lagune.ai/docs/get-started/dashboard
最終更新日: 2026-11-05

サブコマンドを付けずに **Lagune** を直接実行すると、`.lagune/` をインタラクティブなライブビューで確認できます。ランダムなポートでダッシュボードを起動して開きます：

```bash
npx lagune
```

- [x] **ライブリロード**
- [x] **プライベート**かつ**ローカル**
- [x] 最初の charter から、`.lagune/` の内容をすべて表示
- [x] ブラウザから直接プロジェクトのカテゴリを**管理**できる
- [x] `node_modules` も `package.json` も不要 📦

![Lagune ダッシュボードのセキュリティ原則画面](https://lagune.ai/img/dashboard/02.webp)

![Lagune ダッシュボードの検出事項画面](https://lagune.ai/img/dashboard/03.webp)

![Lagune ダッシュボードの Side Quests 画面](https://lagune.ai/img/dashboard/04.webp)

![Lagune ダッシュボードの検出事項の詳細画面](https://lagune.ai/img/dashboard/05.webp)

![Lagune ダッシュボードのカタログ画面](https://lagune.ai/img/dashboard/06.webp)

**ヒント**

- 🚪 任意のポートを指定するには `--port` を使います。
- ⏏️ 停止するには `Ctrl+C` を押します。

## よくある質問

### Lagune のダッシュボードはどうやって開きますか？

プロジェクトのルートで、サブコマンドを付けずに npx lagune を実行します。ランダムなポートで .lagune/ のライブビューを起動し、ブラウザで開きます。

### ダッシュボードはプライベートですか？

はい。自分のマシン上だけで動作し、ほかのコンピューターからはアクセスできないローカルアドレスを使います。

### ダッシュボードからプロジェクトを変更できますか？

ブラウザから変更できるのはカテゴリだけです。それ以外にダッシュボードに表示される内容は、すべて読み取り専用です。
