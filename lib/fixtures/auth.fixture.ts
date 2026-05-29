import { test as baseTest } from './base.fixture';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/home/HomePage';
import { URLS } from '../../config/urls';
import { USERS } from '../data/users';
import { USER_ROLES, type UserRole } from '../data/constants/roles';
import { Logger } from '../utils/Logger';

/**
 * Auth Fixture
 * ------------
 * Adds authentication-related fixtures on top of the base fixture:
 *
 *   - `loginAs(role)` — Programmatic login action for any supported role.
 *   - `userPage`      — `HomePage` pre-authenticated as USER (customer).
 *   - `adminPage`     — `HomePage` pre-authenticated as ADMIN.
 *
 * Specs should prefer these fixtures over manually instantiating page
 * objects, so that login flows live in exactly one place.
 */
type AuthFixtures = {
    loginAs: (role: UserRole) => Promise<void>;
    userPage: HomePage;
    adminPage: HomePage;
};

export const test = baseTest.extend<AuthFixtures>({
    loginAs: async ({ page }, use) => {
        await use(async (role: UserRole) => {
            const loginPage = new LoginPage(page);
            const user = USERS[role];
            Logger.step(`Logging in as ${role}`);
            await loginPage.openLoginPage();

            // Idempotent: if a persisted session already redirected us past
            // the login form, skip the credential flow.
            if (page.url().includes(URLS.LOGIN)) {
                await loginPage.login(user.email, user.password);
            } else {
                Logger.info(`Existing session detected — skipping login as ${role}`);
            }
        });
    },

    userPage: async ({ page, loginAs }, use) => {
        await loginAs(USER_ROLES.USER);
        await use(new HomePage(page));
    },

    adminPage: async ({ page, loginAs }, use) => {
        await loginAs(USER_ROLES.ADMIN);
        await use(new HomePage(page));
    },
});

export { expect } from './base.fixture';
