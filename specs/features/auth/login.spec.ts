import { test } from '../../../lib/fixtures';
import { USER_ROLES } from '../../../lib/data/constants/roles';
import { HomePage } from '../../../lib/pages/home/HomePage';
import { Logger } from '../../../lib/utils/Logger';
import { MESSAGES } from '../../../lib/data/constants/messages';
import { USERS } from '../../../lib/data/users';

/**
 * Login Test Suite — Practice Software Testing toolshop
 *
 * Covers:
 * - Successful login for Customer (User) and Admin roles
 * - Invalid credentials handling
 * - Role-based session smoke
 */

test.describe('Login Tests - Positive Scenarios', () => {
    test(
        'USER-001: Customer can login successfully with valid credentials',
        { tag: ['@smoke', '@regression', '@critical'] },
        async ({ loginAs, page }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Authentication' },
                { type: 'story', description: 'USER-001: Customer Login' }
            );

            Logger.step('Step 1: Login as customer role');
            await loginAs(USER_ROLES.USER);

            Logger.step('Step 2: Verify authenticated home page');
            const home = new HomePage(page);
            await home.verifyAuthenticated();

            Logger.info('✅ Customer login successful');
        }
    );

    test(
        'ADMIN-001: Admin can login successfully with valid credentials',
        { tag: ['@smoke', '@regression', '@critical'] },
        async ({ loginAs, page }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Authentication' },
                { type: 'story', description: 'ADMIN-001: Admin Login' }
            );

            Logger.step('Step 1: Login as admin role');
            await loginAs(USER_ROLES.ADMIN);

            Logger.step('Step 2: Verify authenticated session');
            const home = new HomePage(page);
            await home.verifyAuthenticated();

            Logger.info('✅ Admin login successful');
        }
    );

    test(
        'AUTH-003: User can login directly via login page',
        { tag: ['@regression'] },
        async ({ loginPage, page }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Authentication' }
            );

            Logger.step('Step 1: Open login page');
            await loginPage.openLoginPage();

            Logger.step('Step 2: Submit valid credentials');
            const user = USERS[USER_ROLES.USER];
            await loginPage.login(user.email, user.password);

            Logger.step('Step 3: Verify post-login state');
            const home = new HomePage(page);
            await home.verifyAuthenticated();

            Logger.info('✅ Direct login through LoginPage works');
        }
    );
});

test.describe('Login Tests - Negative Scenarios', () => {
    test(
        'AUTH-101: Login fails with invalid email',
        { tag: ['@regression', '@negative'] },
        async ({ loginPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Authentication' },
                { type: 'story', description: 'AUTH-101: Invalid Email' }
            );

            Logger.step('Step 1: Open login page');
            await loginPage.openLoginPage();

            Logger.step('Step 2: Submit unknown email');
            await loginPage.login('nobody@example.com', 'welcome01');

            Logger.step('Step 3: Verify error');
            await loginPage.verifyErrorMessage(MESSAGES.LOGIN_FAILED);

            Logger.info('✅ Invalid email rejected');
        }
    );

    test(
        'AUTH-102: Login fails with invalid password',
        { tag: ['@regression', '@negative'] },
        async ({ loginPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Authentication' },
                { type: 'story', description: 'AUTH-102: Invalid Password' }
            );

            Logger.step('Step 1: Open login page');
            await loginPage.openLoginPage();

            Logger.step('Step 2: Submit known email with wrong password');
            await loginPage.login('customer@practicesoftwaretesting.com', 'WrongPassword123!');

            Logger.step('Step 3: Verify error');
            await loginPage.verifyErrorMessage(MESSAGES.LOGIN_FAILED);

            Logger.info('✅ Invalid password rejected');
        }
    );

    test(
        'AUTH-103: Login fails with both credentials invalid',
        { tag: ['@regression', '@negative'] },
        async ({ loginPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Authentication' }
            );

            Logger.step('Step 1: Open login page');
            await loginPage.openLoginPage();

            Logger.step('Step 2: Submit invalid email and password');
            await loginPage.login('nobody@example.com', 'WrongPassword123!');

            Logger.step('Step 3: Verify error');
            await loginPage.verifyErrorMessage(MESSAGES.LOGIN_FAILED);

            Logger.info('✅ Invalid credentials rejected');
        }
    );
});

test.describe('Login Tests - Role-Based Access', () => {
    test(
        'ROLE-001: Customer session loads home',
        { tag: ['@regression', '@rbac'] },
        async ({ loginAs, page }) => {
            Logger.step('Step 1: Login as customer');
            await loginAs(USER_ROLES.USER);

            const home = new HomePage(page);
            await home.verifyAuthenticated();

            Logger.info('✅ Customer role session verified');
        }
    );

    test(
        'ROLE-002: Admin session loads home',
        { tag: ['@regression', '@rbac'] },
        async ({ loginAs, page }) => {
            Logger.step('Step 1: Login as admin');
            await loginAs(USER_ROLES.ADMIN);

            const home = new HomePage(page);
            await home.verifyAuthenticated();

            Logger.info('✅ Admin role session verified');
        }
    );
});
