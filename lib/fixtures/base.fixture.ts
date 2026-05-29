import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/home/HomePage';

/**
 * Base Fixture
 * ------------
 * Provides ready-to-use Page Object instances for every test.
 *
 * Every test importing `test` from `lib/fixtures` automatically gets:
 *   - `loginPage` — `LoginPage` bound to the current `page`
 *   - `homePage`  — `HomePage` bound to the current `page`
 *
 * Keep this fixture free of authentication or business logic; that belongs
 * in `auth.fixture.ts` and `lib/helpers/*` respectively.
 */
type BaseFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
};

export const test = base.extend<BaseFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
});

export { expect };
