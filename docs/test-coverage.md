# 🧪 Test Coverage

This document catalogues every test case in the framework — including tags,
severity, and intent — so it stays readable as the suite grows.

> 🔁 When you add a new spec, please update this file in the same PR.

---

## At a glance

| Metric           | Value |
| ---------------- | ----- |
| Total test cases | **20**  |
| Smoke            | 7     |
| Regression       | 20    |
| Critical         | 3     |
| Negative         | 4     |
| Validation       | 3     |
| RBAC             | 2     |
| AI-generated     | 5     |

Approximate execution time on a single worker against the Practice Software Testing demo:

| Suite            | Tests | Duration       |
| ---------------- | ----- | -------------- |
| `@smoke`         | 5     | ~1-2 min       |
| `@regression`    | 15    | ~5-7 min       |
| Full run (incl. setup) | 16  | ~6-8 min    |

CI shards regression across two runners, cutting wall-clock time roughly in half.

---

## Tag legend

| Tag           | Meaning                                                             |
| ------------- | ------------------------------------------------------------------- |
| `@smoke`      | Fast, high-value happy paths — runs on every PR                      |
| `@regression` | Broader coverage — runs on `master` and nightly                       |
| `@critical`   | Business-critical scenarios                                          |
| `@negative`   | Negative paths (invalid credentials, error responses)                 |
| `@validation` | Form / input validation                                              |
| `@rbac`       | Role-based access control                                            |
| `@ai-generated` | Authored by the Playwright AI agents, **not yet human-reviewed**. Excluded from the trusted smoke gate; runs in a non-blocking CI lane. Removed once reviewed. |

---

## Authentication (`specs/features/auth/login.spec.ts`)

### Positive

| Test ID    | Title                                                  | Tags                              | Severity |
| ---------- | ------------------------------------------------------ | --------------------------------- | -------- |
| `USER-001` | User can login successfully with valid credentials     | `@smoke @regression @critical`    | Critical |
| `ADMIN-001`| Admin can login successfully with valid credentials    | `@smoke @regression @critical`    | Critical |
| `AUTH-003` | User can login directly using login page               | `@regression`                     | Normal   |

### Negative

| Test ID    | Title                                            | Tags                       | Severity |
| ---------- | ------------------------------------------------ | -------------------------- | -------- |
| `AUTH-101` | Login fails with invalid email                   | `@regression @negative`    | Normal   |
| `AUTH-102` | Login fails with invalid password                | `@regression @negative`    | Normal   |
| `AUTH-103` | Login fails with both invalid credentials        | `@regression @negative`    | Normal   |

### Validation

| Test ID    | Title                                  | Tags                         | Severity |
| ---------- | -------------------------------------- | ---------------------------- | -------- |
| `AUTH-104` | Login is rejected with empty email     | `@regression @validation`    | Normal   |
| `AUTH-105` | Login is rejected with empty password  | `@regression @validation`    | Normal   |
| `AUTH-106` | Login is rejected with both fields empty | `@regression @validation`  | Normal   |

### Role-based access (RBAC)

| Test ID    | Title                                                | Tags                  | Severity |
| ---------- | ---------------------------------------------------- | --------------------- | -------- |
| `ROLE-001` | Customer session loads home                          | `@regression @rbac`   | Normal   |
| `ROLE-002` | Admin session loads home                             | `@regression @rbac`   | Normal   |

---

## Home — catalog landing (`specs/features/home/home.spec.ts`)

### Common (anonymous)

| Test ID    | Title                                                | Tags                  | Severity |
| ---------- | ---------------------------------------------------- | --------------------- | -------- |
| `HOME-001` | Home page loads and displays product grid            | `@smoke @regression`  | Critical |
| `HOME-002` | Product search returns results                        | `@regression`         | Normal   |

### Authenticated

| Test ID    | Title                                                | Tags                  | Severity |
| ---------- | ---------------------------------------------------- | --------------------- | -------- |
| `HOME-101` | Customer sees authenticated nav on home              | `@smoke @regression`  | Critical |
| `HOME-102` | Admin sees authenticated nav on home                 | `@smoke @regression`  | Critical |

---

## Product detail (`specs/features/product/product-detail.spec.ts`)

> `@ai-generated` — authored by the Playwright agents (planner → generator → POM refactor),
> pending final human review. Runs in the non-blocking AI lane until the tag is removed.

| Test ID    | Title                                                       | Tags                                   | Severity |
| ---------- | ----------------------------------------------------------- | -------------------------------------- | -------- |
| `PROD-001` | Product detail opens from grid; name + price + specs render | `@smoke @regression @ai-generated`     | Critical |
| `PROD-002` | Add to cart increments the nav-cart badge                   | `@smoke @regression @critical @ai-generated` | Critical |
| `PROD-003` | Increase/decrease quantity adjusts qty before add           | `@regression @ai-generated`            | Normal   |
| `PROD-004` | Add to favorites (authenticated) persists to account        | `@regression @ai-generated`            | Normal   |
| `PROD-005` | Add to favorites while anonymous is rejected (401 + toast)  | `@regression @negative @ai-generated`  | Normal   |

---

## Execution recipes

```bash
# Tag-based slices
npm run test:smoke
npm run test:regression
npm run test:critical
npm run test:negative
npm run test:rbac

# Run a single feature
npx playwright test specs/features/auth/login.spec.ts
npx playwright test specs/features/home/home.spec.ts

# Run by Test ID prefix (e.g. all AUTH-1xx negative + validation tests)
npx playwright test --grep "AUTH-10"
```

---

## Adding new tests

Each new spec should:

1. Live under `specs/features/<module>/<feature>.spec.ts`.
2. Carry a Test ID prefix (e.g. `CART-001`, `CHECKOUT-101`).
3. Use the role-based fixtures (`loginAs`, `userPage`, `adminPage`) — no manual login.
4. Use page objects for **all** locators; no inline selectors in specs.
5. Be added to the relevant table in this document.

See [CONTRIBUTING → Adding New Tests](../CONTRIBUTING.md#adding-new-tests).

---

## AI-generated tests

Tests authored by the Playwright agents (planner → generator → healer) carry
`@ai-generated` until a human reviews them. The AI agent config and workflow guide are
local-only (regenerate with `npx playwright init-agents --loop=claude`); the lanes below
are the part that ships.

| Lane | Command | Gate |
| ---- | ------- | ---- |
| Trusted smoke (PR) | `npx playwright test --grep @smoke --grep-invert @ai-generated` | **Blocking** — 100% green required |
| AI signal (regression) | `npm run test:ai` | **Non-blocking** — reliability signal only |
| Trusted full | `npm run test:trusted` | excludes all unreviewed AI tests |

**Promotion:** review the test (edge cases, security, leftover CSS selectors) → it passes
locally + `npm run typecheck` → remove `@ai-generated` → add its row to the tables above.
**SLA:** keep `@ai-generated` flakiness < 15%; a retry-to-pass ratio > 5% is a real-flake
signal to investigate (do not raise retries to hide it).

---

## Roadmap

Planned expansion (contributions welcome):

- [ ] **Cart module** — add / update / remove line items
- [ ] **Checkout module** — address, payment, order confirmation flows
- [x] **Product detail** — product page, specs, quantity, add-to-cart, favorites *(PROD-001..005, `@ai-generated`)*
- [ ] **API layer** — token-based authentication and request fixtures
- [ ] **Visual regression** — page-level screenshot diffs
- [ ] **Cross-browser** — Firefox + WebKit matrix in CI
- [ ] **Mobile viewport** — responsive checks for key flows
- [ ] **Accessibility** — automated WCAG audits via axe-core
