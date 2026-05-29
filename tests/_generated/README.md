# `tests/_generated/` — AI generator staging

Raw output from the Playwright **generator** agent lands here. It is **gitignored**
(this README is the only tracked file) and **not** collected by `playwright.config.ts`
(`testDir` is `./specs`).

## Why a staging area

Generated specs use raw, MCP-observed locators and do not yet follow this repo's
Page Object Model, fixtures, or tag conventions. Committing them directly would bypass
`lib/fixtures`, `BasePage`, and the role-based auth flow.

## Promotion flow

1. Generator writes `tests/_generated/<area>/<scenario>.spec.ts`.
2. Refactor into `specs/features/<area>/<scenario>.spec.ts`:
   - import `test` / `expect` from `lib/fixtures`
   - replace inline login with `loginAs` / `userPage` / `adminPage`
   - route interactions through Page Objects (`BasePage` primitives)
   - swap CSS for `getByRole` / `data-test`
   - add tags + `@ai-generated`
3. Run `npx playwright test --grep <scenario>` green, `npm run typecheck`.
4. Human review (edge cases, security, leftover CSS) → remove `@ai-generated` when trusted.
5. Delete the staged file.
