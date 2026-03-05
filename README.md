# @heal-dev/heal-cli

AI-powered self-healing for Playwright tests. Heal automatically fixes broken selectors and adapts your tests to UI changes — no manual maintenance required.

## Installation

```bash
npm install @heal-dev/heal-cli
npx playwright install
```

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

## CLI

Run your Playwright tests with Heal's self-healing layer:

```bash
# Run all tests
npx heal test

# Run specific tests
npx heal test "e2e/auth"
npx heal test "**/*login*.spec.ts"
npx heal test "tests/login.spec.ts"
```

### Options

| Option              | Description                           | Default |
| ------------------- | ------------------------------------- | ------- |
| `--headless <bool>` | Run in headless mode (`true`/`false`) | -       |
| `--timeout <ms>`    | Timeout per test in milliseconds      | `30000` |
| `--concurrency <n>` | Tests to run in parallel              | `1`     |
| `--retries <n>`     | Retry attempts on failure             | `2`     |

## SDK

Use the SDK to integrate Heal directly into your Playwright tests.

### Inline usage (without blocks)

All healing calls live directly in the test body (note that, 1 test <> 1 file):

```typescript
import { expect, test as base } from '@playwright/test';
import { Heal } from '@heal-dev/heal-cli/sdk';

type HealFixture = { heal: Heal };

const test = base.extend<HealFixture>({
  heal: async ({}, use) => {
    const heal = await Heal.init({ headless: false });
    await use(heal);
    await heal.close();
  },
});

test('login with valid credentials', async ({ heal }) => {
  const { agent, page } = await heal.getPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  await agent.healType('Username', 'tomsmith');
  await agent.healType('Password', 'SuperSecretPassword!');
  await agent.healClick('Login');

  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
```

### With reusable blocks

Extract common flows into block functions for reuse across tests.
Note that import of a block function must be done with `import * as blocks from '<path>/blocks';` in the test file.

```typescript
// blocks.ts
import type { Page } from '@playwright/test';
import type { Heal, HealPageAgent } from '@heal-dev/heal-cli/sdk';

export async function loginWithCredentials(
  _heal: Heal,
  _page: Page,
  agent: HealPageAgent,
  credentials: { username: string; password: string }[]
) {
  await agent.healType('Username', username);
  await agent.healType('Password', password);
  await agent.healClick('Login');
}
```

```typescript
// login.test.ts
import { expect, test as base } from '@playwright/test';
import { Heal } from '@heal-dev/heal-cli/sdk';
import * as blocks from './blocks';

type HealFixture = { heal: Heal };

const test = base.extend<HealFixture>({
  heal: async ({}, use) => {
    const heal = await Heal.init({ headless: false });
    await use(heal);
    await heal.close();
  },
});

test('login with multiple credentials via block', async ({ heal }) => {
  const { agent, page } = await heal.getPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  await blocks.loginWithCredentials(heal, page, agent, [
    { username: 'wronguser', password: 'wrongpass' },
    { username: 'tomsmith', password: 'SuperSecretPassword!' },
  ]);

  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});
```

### `Heal.init(options?)`

Creates a new Heal instance with an auto-healing browser context.

| Option             | Type                     | Description                                 |
| ------------------ | ------------------------ | ------------------------------------------- |
| `headless`         | `boolean`                | Run browser in headless mode                |
| `extensionPaths`   | `string[]`               | Browser extension paths to load             |
| `locale`           | `string`                 | Browser locale                              |
| `extraHttpHeaders` | `Record<string, string>` | Extra HTTP headers for all requests         |
| `storageStatePath` | `string`                 | Path to storage state JSON for auth/cookies |

### Instance methods

- **`getPage()`** — Returns `{ page, agent }` with Heal's self-healing proxy.
- **`newPage()`** — Opens a new page in the browser context.
- **`getBrowserContext()`** — Returns the underlying Playwright `BrowserContext`.
- **`waitForNewPage(action, timeoutMS?)`** — Waits for a new page to open as a result of an action.
- **`close()`** — Closes the browser and cleans up resources.

### HealPageAgent methods

- **`agent.healClick(description)`** — Click an element described in natural language.
- **`agent.healType(description, value)`** — Type into an element described in natural language.
- **`agent.healSelectOption(description, option)`** — Select an option from a dropdown described in natural language.
- **`agent.healHover(description)`** — Hover over an element described in natural language.
- **`agent.healLocator(description)`** — Returns a Playwright `Locator` for an element described in natural language.
- **`agent.healAssert(assertion)`** — Assert a condition on the page described in natural language.
- **`agent.healScreenshot()`** — Takes a screenshot of the current page and returns it as a base64 string.

## Supported Playwright Features

### Configuration (`playwright.config.ts`)

- **`testDir`** — root test directory
- **`projects`** — array of project configurations with `name`, `testMatch`, `testDir`, and `dependencies`
- Project dependency graph with cycle detection and topological ordering

### Test patterns

- `test()` and `it()` declarations
- `test.describe()` with nesting
- `test.afterEach()` (scope-aware)
- Custom fixtures via `base.extend()` — function-style, array-style with `{ auto: true }`, and `{ option: true }`
- Fixture teardown via `use()` boundary detection
- Fixture dependency resolution and topological sorting
- `test.use()` overrides (scope-aware within describe blocks)
- Built-in fixtures auto-provided when needed: `page`, `context`, `browser`, `request`

### Test file extensions

`*.spec.ts`, `*.spec.js`, `*.test.ts`, `*.test.js` (also `.tsx` and `.jsx`)

### Code patterns

- Control flow blocks (`if/else`, `for`, `while`, `try/catch`, `switch`) treated as atomic executable units
- File-level and describe-block-level variable declarations
- Import statements preserved for execution context

### Blocks (reusable helper functions)

- `import * as blocks from './blocks'` pattern
- Automatic inlining of `await blocks.functionName(...)` calls
- Parameter binding, return value capture, and setup/teardown support

### Current limitations

- `beforeEach` / `beforeAll` / `afterAll` hooks are not extracted
- `test.only()`, `test.skip()`, `test.slow()` not detected
- Tag-based filtering not supported
- `test.step()` treated as regular code
- Fixture `scope` option (`worker`, `module`) not parsed
- Only `import * as` block import pattern recognized (not default imports)

## License

Copyright (c) 2026 MYIA SAS

All rights reserved. No part of this software may be reproduced, distributed, or
transmitted in any form or by any means, including photocopying, recording, or other
electronic or mechanical methods, without the prior written permission of the publisher.
