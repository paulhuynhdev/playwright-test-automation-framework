import { test as baseTest } from './base.fixture';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/home/HomePage';
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

            // Idempotent + race-free: decide by element state, not URL. A persisted
            // session client-redirects off /auth/login, and a point-in-time url() read
            // can win that race — then we'd fill a detaching form and flake.
            if (await loginPage.isLoginRequired()) {
                await loginPage.login(user.email, user.password);
            } else {
                Logger.info(`Existing session detected — skipping login as ${role}`);
            }
        });
    },

    userPage: async ({ page, loginAs }, use) => {
        await loginAs(USER_ROLES.USER);
        const home = new HomePage(page);
        // Post-condition: confirm the session is actually established before handing
        // the page object to the test — turns a silent auth race into a clear failure.
        await home.verifyAuthenticated();
        await use(home);
    },

    adminPage: async ({ page, loginAs }, use) => {
        await loginAs(USER_ROLES.ADMIN);
        const home = new HomePage(page);
        await home.verifyAuthenticated();
        await use(home);
    },
});

export { expect } from './base.fixture';
