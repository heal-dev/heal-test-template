# @heal-dev/heal-cli

AI-powered self-healing for Playwright tests. Heal automatically fixes broken selectors and adapts your tests to UI changes — no manual maintenance required.

## Installation

1. Clone this repo
1. Download the heal CLI tarball from [here](https://drive.google.com/drive/u/0/folders/19a5n6SDKkbHVHiW_SAOqiPtnxFZ_fZAG)
1. Move it to the root of the repo
1. Run `npm i`

**Peer dependencies:** `@playwright/test@1.58.1` and `playwright@1.58.1`.

## Autopilot

Heal Autopilot is an AI agent that can read, write, and execute code in your project. It can write and run Playwright tests, fix broken tests, and perform general coding tasks — all from a single natural-language prompt.

```bash
# Run with a prompt
npx heal autopilot "Write a login test for https://the-internet.herokuapp.com/login"

# Interactive mode
npx heal autopilot
```

### Options

| Option                 | Description              | Default           |
| ---------------------- | ------------------------ | ----------------- |
| `--dir <path>`         | Working directory        | current directory |
| `--max-iterations <n>` | Maximum agent iterations | `500`             |

Autopilot reads your project files, generates or edits test code, and executes it — iterating until the task is complete. Press **Escape** to stop at any time.

## Heal Playwright Tracer

This template wires in [`@heal-dev/heal-playwright-tracer`](https://github.com/heal-dev/heal-playwright-tracer) — a statement-level Playwright tracer that emits the rich, per-statement diagnostics Autopilot relies on to understand test runs.

It's already configured in `playwright.config.ts`: the Babel plugin instruments every statement under `tests/`, and the reporter writes NDJSON traces (plus screenshots and videos) to `heal-traces/` on each run. Autopilot reads those traces to diagnose failures and iterate on fixes.

You generally don't need to touch this — `npx heal autopilot` picks it up automatically. See the [tracer README](https://github.com/heal-dev/heal-playwright-tracer#readme) for the output layout and schema details.
