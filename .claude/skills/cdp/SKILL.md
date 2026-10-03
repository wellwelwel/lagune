---
name: cdp
description: Visual verification of a running page through Chrome's DevTools Protocol, capturing screenshots and measuring the rendered DOM. Use when a frontend change can only be confirmed once rendered, for layout, spacing, alignment, overflow, or theme tokens.
user-invocable: true
metadata:
  author: Weslley Araújo
  version: '1.0.0'
  source: https://github.com/wellwelwel/skills
---

# Rendered result verification

This skill owns the verification of what the browser actually renders. It drives a running page through Chrome's built-in DevTools Protocol (CDP) to inspect the DOM, computed styles, and layout, and to capture screenshots. It works against any URL, whatever app or domain is serving it.

## Measure, never eyeball

For any spacing or alignment claim, measure the rendered DOM and report the numbers. Read geometry off the elements themselves, for example the box between an element and its container's edges, and state the values you found. A screenshot that looks aligned is not evidence.

## When to use it

Reach for it when a change is hard to verify from the source alone: layout, spacing, alignment, overflow, theme tokens, or anything that only shows up once rendered. Skip it for simple, self-evident edits, for example adding a shadow, where the result is obvious from the diff.

## Dependencies

The helper needs `playwright` and `tsx`. Check each with `npm ls <package>`, install whatever is missing as a development dependency with the package manager the root lockfile points to, then fetch the pinned browser with `npx playwright install chromium`.

## Running it

The helper ships with this skill, at [tools/cdp.ts](tools/cdp.ts) next to this file. Run it from the project root under `npx tsx`, pointing at wherever the skill is installed, and write the PNGs to a directory the project ignores in git.

```sh
npx tsx <path-to-this-skill>/tools/cdp.ts --out ./temp/shots --shot 'label|<url>'
```

| Flag                             | Purpose                                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| `--shot 'label\|url'`            | One capture, repeatable. The label names the PNG                    |
| `--measure <expr>`               | Expression evaluated on every shot, its value printed with the shot |
| `--out <dir>`                    | Where the PNGs are written                                          |
| `--attach <port>`                | Reuse a Chromium already exposing a CDP endpoint                    |
| `--width`, `--height`, `--scale` | Viewport and device pixel ratio                                     |
| `--settle <ms>`                  | Wait after load before measuring and capturing                      |

Put any query params the page supports, a forced theme, a route, or a flag, straight in the URL. Take the same shot before and after a change when the point is the difference between them.
