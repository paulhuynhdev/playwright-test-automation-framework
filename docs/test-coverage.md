# 🧪 Test Coverage

This document catalogues every test case in the framework — including tags,
severity, and intent — so it stays readable as the suite grows.

> 🔁 When you add a new spec, please update this file in the same PR.

---

## At a glance

| Metric           | Value |
| ---------------- | ----- |
| Total test cases | **19**  |
| Smoke            | 8     |
| Regression       | 19    |
| Critical         | 4     |
| Negative         | 3     |
| Validation       | 3     |
| RBAC             | 2     |

Approximate execution time on a single worker against the Practice Software Testing demo:

| Suite            | Tests | Duration       |
| ---------------- | ----- | -------------- |
| `@smoke`         | 8     | ~2-3 min       |
| `@regression`    | 19    | ~8-10 min      |
| Full run (incl. setup) | 20+ | ~10-12 min  |

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
| `AUTH-101` | Login fails with invalid username                | `@regression @negative`    | Normal   |
| `AUTH-102` | Login fails with invalid password                | `@regression @negative`    | Normal   |
| `AUTH-103` | Login fails with both invalid credentials        | `@regression @negative`    | Normal   |

### Validation

| Test ID    | Title                                  | Tags                         | Severity |
| ---------- | -------------------------------------- | ---------------------------- | -------- |
| `AUTH-104` | Login fails with empty username        | `@regression @validation`    | Normal   |
| `AUTH-105` | Login fails with empty password        | `@regression @validation`    | Normal   |
| `AUTH-106` | Login fails with both fields empty     | `@regression @validation`    | Normal   |

### Role-based access (RBAC)

| Test ID    | Title                                                | Tags                  | Severity |
| ---------- | ---------------------------------------------------- | --------------------- | -------- |
| `ROLE-001` | User and Admin have different access levels          | `@regression @rbac`   | Normal   |
| `ROLE-002` | Admin has full system access                         | `@regression @rbac`   | Normal   |

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
npx playwright test specs/features/dashboard/dashboard.spec.ts

# Run by Test ID prefix (e.g. all AUTH-1xx negative tests)
npx playwright test --grep "AUTH-10"
```

---

## Adding new tests

Each new spec should:

1. Live under `specs/features/<module>/<feature>.spec.ts`.
2. Carry a Test ID prefix (e.g. `PIM-001`, `LEAVE-101`).
3. Use the role-based fixtures (`loginAs`, `userPage`, `adminPage`) — no manual login.
4. Use page objects for **all** locators; no inline selectors in specs.
5. Be added to the relevant table in this document.

See [CONTRIBUTING → Adding New Tests](../CONTRIBUTING.md#adding-new-tests).

---

## Roadmap

Planned expansion (contributions welcome):

- [ ] **PIM module** — employee CRUD coverage
- [ ] **Leave module** — apply / approve / cancel flows
- [ ] **Time module** — timesheet submission
- [ ] **API layer** — token-based authentication and request fixtures
- [ ] **Visual regression** — page-level screenshot diffs
- [ ] **Cross-browser** — Firefox + WebKit matrix in CI
- [ ] **Mobile viewport** — responsive checks for key flows
- [ ] **Accessibility** — automated WCAG audits via axe-core
