# 🛠️ Setup Guide

This guide is for engineers configuring the framework on a fresh machine or
adapting it to a different target environment. For a five-minute onboarding,
see [Quick Start](quick-start.md).

---

## 1. System prerequisites

| Tool       | Version  | Notes                                                            |
| ---------- | -------- | ---------------------------------------------------------------- |
| Node.js    | ≥ 20.x   | Required runtime; enforced via `engines` in `package.json`.      |
| npm        | ≥ 9.x    | Bundled with Node 20.                                            |
| Git        | latest   | Required to clone and for CI integration.                        |
| Java JRE   | ≥ 8      | Only required to render Allure reports locally.                  |
| Chromium   | latest   | Auto-installed via `npx playwright install`.                     |

> Windows users: PowerShell is supported. The repo ships `.gitattributes`
> enforcing LF line endings to avoid cross-OS diff noise.

---

## 2. Install

```bash
git clone https://github.com/paulhuynhdev/playwright-test-automation-framework.git
cd playwright-test-automation-framework
npm install
npx playwright install --with-deps chromium
```

`npm install` installs `node_modules` based on `package-lock.json`. The
follow-up `npx playwright install` downloads the Chromium binary plus any
required OS dependencies (`--with-deps` is recommended on Linux runners).

---

## 3. Configure `.env`

The framework refuses to start if any required variable is missing — this is
intentional and prevents silent misconfiguration.

### 3.1 Single-environment configuration

The loader uses a single `BASE_URL` and one set of credentials — no
`STAGING_*` / `PRODUCTION_*` prefixes. Override per-run via shell env vars or
CI secrets when targeting a different deployment.

### 3.2 Provide values

```env
BASE_URL=https://practicesoftwaretesting.com
USER_EMAIL=customer@practicesoftwaretesting.com
USER_PASSWORD=welcome01
ADMIN_EMAIL=admin@practicesoftwaretesting.com
ADMIN_PASSWORD=welcome01
```

> ⚠️ `.env` is git-ignored and **must not be committed**. Use GitHub Actions
> secrets for CI — see [§ 6 CI/CD secrets](#6-cicd-secrets).

### 3.3 Optional runtime flags

| Variable | Effect                                                                |
| -------- | --------------------------------------------------------------------- |
| `CI`     | Set automatically in CI; switches reporters to non-interactive output |
| `DEBUG`  | Enables verbose `Logger.debug` output during local runs               |

---

## 4. Verify your setup

```bash
npm run typecheck    # TypeScript compiles cleanly
npm run test:smoke   # quick functional sanity check
```

Both should complete green. If they don't, see [Troubleshooting](troubleshooting.md).

---

## 5. Pointing the framework at a different application

Swapping the target application is a four-step process:

| Step | File                                       | Action                                              |
| ---- | ------------------------------------------ | --------------------------------------------------- |
| 1    | `.env` / `.env.example`                    | Update `BASE_URL` and credential variables          |
| 2    | `config/urls.ts`                           | Replace route fragments (`LOGIN`, `HOME`, …)        |
| 3    | `lib/pages/**`                             | Update locators / extend page objects               |
| 4    | `specs/**`                                 | Update spec wording, tags, and test IDs             |

You shouldn't need to touch `playwright.config.ts` or the fixtures layer unless
you add new roles or projects.

---

## 6. CI/CD secrets

For private targets, configure these GitHub Actions secrets under
**Settings → Secrets and variables → Actions**:

| Secret                       | Notes                                                           |
| ---------------------------- | --------------------------------------------------------------- |
| `BASE_URL`       | Optional — defaults to `https://practicesoftwaretesting.com`            |
| `USER_EMAIL`     | Optional — defaults to `customer@practicesoftwaretesting.com`           |
| `USER_PASSWORD`  | Optional — defaults to `welcome01`                                      |
| `ADMIN_EMAIL`    | Optional — defaults to `admin@practicesoftwaretesting.com`              |
| `ADMIN_PASSWORD` | Optional — defaults to `welcome01`                                      |

All workflows fall back to the demo defaults when secrets are absent, so the
project works out-of-the-box on forks.

---

## 7. IDE recommendations

For the smoothest experience in VS Code, install the
[Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
extension. It lets you run, debug, and pick locators directly inside the editor.

---

## 8. Next

- [Architecture](architecture.md) — how the layers fit together
- [Runbook](runbook.md) — pick the right command for the scenario
- [Test Coverage](test-coverage.md) — which tests exist and why
