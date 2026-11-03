# Dashboard

> See your project's charter, findings, and catalog in a live, local view that opens with one command.

Canonical: https://lagune.ai/docs/get-started/dashboard
Last updated: 2026-10-25

Run **Lagune** directly with no subcommand for an interactive live view of `.lagune/`. It serves a dashboard and opens it on a random port:

```bash
npx lagune
```

- [x] **Live Reload**
- [x] **Private** and **Local**
- [x] Shows whatever `.lagune/` holds, from the first charter on
- [x] **Manage** the project's categories directly from your browser
- [x] No `node_modules` or `package.json` is needed 📦

![Lagune dashboard charter](https://lagune.ai/img/dashboard/02.webp)

![Lagune dashboard findings](https://lagune.ai/img/dashboard/03.webp)

![Lagune dashboard side quests](https://lagune.ai/img/dashboard/04.webp)

![Lagune dashboard finding detail](https://lagune.ai/img/dashboard/05.webp)

![Lagune dashboard catalog](https://lagune.ai/img/dashboard/06.webp)

**Tip**

- 🚪 Use `--port` to specify a custom port.
- ⏏️ Press `Ctrl+C` to stop.

## Frequently Asked Questions

### How do I open the Lagune dashboard?

Run npx lagune with no subcommand at your project's root. It serves a live view of .lagune/ on a random port and opens it in your browser.

### Is the dashboard private?

Yes. It runs only on your own machine, at a local address no other computer can reach.

### Can I change my project from the dashboard?

Only its categories, from your browser. Everything else the dashboard shows is read-only.
