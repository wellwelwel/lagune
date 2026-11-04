# 仪表盘

> 一条命令就能打开本地实时视图，查看项目的安全原则、发现项和目录。

规范链接: https://lagune.ai/zh-CN/docs/get-started/dashboard
语言: zh-CN
原文: https://lagune.ai/docs/get-started/dashboard
最后更新: 2026-11-04

不带子命令直接运行 **Lagune**，就能获得 `.lagune/` 的交互式实时视图。它会在一个随机端口上启动仪表盘并打开它：

```bash
npx lagune
```

- [x] **实时刷新**
- [x] **私密**且**本地**
- [x] 从首次运行 charter 起，展示 `.lagune/` 中的全部内容
- [x] 直接在浏览器中**管理**项目的类别
- [x] 无需 `node_modules` 或 `package.json` 📦

![Lagune 仪表盘的安全原则页面](https://lagune.ai/img/dashboard/02.webp)

![Lagune 仪表盘的发现项页面](https://lagune.ai/img/dashboard/03.webp)

![Lagune 仪表盘的 Side Quests 页面](https://lagune.ai/img/dashboard/04.webp)

![Lagune 仪表盘的发现项详情](https://lagune.ai/img/dashboard/05.webp)

![Lagune 仪表盘的目录页面](https://lagune.ai/img/dashboard/06.webp)

**提示**

- 🚪 用 `--port` 指定自定义端口。
- ⏏️ 按 `Ctrl+C` 停止。

## 常见问题

### 怎么打开 Lagune 仪表盘？

在项目根目录下不带子命令运行 npx lagune。它会在随机端口上提供 .lagune/ 的实时视图，并在浏览器中打开。

### 仪表盘是私密的吗？

是的。它只在你自己的电脑上运行，使用的是其他电脑都无法访问的本地地址。

### 可以在仪表盘里修改项目吗？

只能在浏览器中修改项目的类别。仪表盘展示的其他内容都是只读的。
