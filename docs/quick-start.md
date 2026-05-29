# ⚡ Quick Start

Get up and running in **under five minutes** against the Practice Software Testing (toolshop) demo.

> 💡 If you need deeper environment configuration, jump to the [Setup Guide](setup-guide.md).

---

## Prerequisites

| Requirement | Why                                                           |
| ----------- | ------------------------------------------------------------- |
| Node.js 20+ | Runtime                                                       |
| npm 9+      | Bundled with Node 20                                          |
| Git         | Cloning the repo                                              |
| Chromium    | Auto-installed by `npx playwright install`                    |

---

## Step-by-step

### 1. Clone the repository

```bash
git clone https://github.com/paulhuynhdev/playwright-test-automation-framework.git
cd playwright-test-automation-framework
```

### 2. Install Node.js 20+

Install from <https://nodejs.org> if you don't already have it. Verify:

```bash
node -v        # should print v20.x or higher
```

### 3. Install dependencies

```bash
npm install
npx playwright install --with-deps chromium
```

### 4. Configure environment

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Defaults already point to the public Practice Software Testing demo:

```env
BASE_URL=https://practicesoftwaretesting.com
USER_EMAIL=customer@practicesoftwaretesting.com
USER_PASSWORD=welcome01
ADMIN_EMAIL=admin@practicesoftwaretesting.com
ADMIN_PASSWORD=welcome01
```

Demo credentials are public and reset nightly by the toolshop project.

### 5. Run your first tests

```bash
# Fast feedback — ~2-3 min
npm run test:smoke

# Full suite — ~8-10 min
npm test

# Watch tests run in Playwright's UI
npm run test:ui
```

### 6. View the report

```bash
npm run report             # Playwright HTML
npm run allure:report      # Allure (generate + open)
```

---

## Common commands

```bash
# Tag-based suites
npx playwright test --grep @critical
npx playwright test --grep @negative
npx playwright test --grep @validation
npx playwright test --grep @rbac

# Single spec
npx playwright test specs/features/auth/login.spec.ts

# Specific Playwright project
npx playwright test --project=authenticated

# Headed / debug
npm run test:headed
npm run test:debug
```

Full command catalogue → [docs/runbook.md](runbook.md).

---

## Project layout (at a glance)

```text
config/        env loader, viewport/timeouts, route constants
lib/
  data/        users + constants (roles, messages, ui, app)
  fixtures/    base + auth fixtures (loginAs, userPage, adminPage)
  helpers/     business-level assertions
  pages/       Page Objects (Base, Login, Home)
  utils/       Logger, Wait, DataGenerator
specs/
  setup/       auth.setup.ts — captures storage state once
  features/    business-readable specs (auth, home, …)
```

Deep dive → [docs/architecture.md](architecture.md).

---

## Troubleshooting

| Symptom                                         | Fix                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| `browser not found` / `Failed to launch`        | `npx playwright install --with-deps chromium`                      |
| `Missing required environment variable: …`      | Copy `.env.example` to `.env` and fill in the value                |
| Tests time out connecting to Practice Software Testing          | Verify you have internet access; the demo target is hosted publicly |
| Allure CLI says `Java not found`                | Install Java 8+ (Allure requires a JRE)                            |

More detail in [docs/troubleshooting.md](troubleshooting.md).

---

## Next steps

1. **Explore a real spec** — open [`specs/features/auth/login.spec.ts`](../specs/features/auth/login.spec.ts).
2. **Learn the architecture** — [docs/architecture.md](architecture.md).
3. **Understand test coverage** — [docs/test-coverage.md](test-coverage.md).
4. **Add your first test** — see [CONTRIBUTING → Adding New Tests](../CONTRIBUTING.md#adding-new-tests).
5. **Push and watch CI** — open a PR to trigger the smoke workflow.

Happy testing 🎭
