import { test } from '../../../lib/fixtures';
import { URLS } from '../../../config/urls';
import { Logger } from '../../../lib/utils/Logger';

/**
 * Home (Catalog) Test Suite — Practice Software Testing toolshop
 *
 * Covers:
 * - Anonymous landing visibility (product grid renders)
 * - Authenticated landing visibility (customer + admin)
 * - Basic search smoke
 */

test.describe('Home Page - Common', () => {
    test(
        'HOME-001: Home page loads and displays product grid',
        { tag: ['@smoke', '@regression'] },
        async ({ homePage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Catalog' },
                { type: 'story', description: 'HOME-001: Anonymous landing' }
            );

            Logger.step('Step 1: Navigate to home');
            await homePage.open();

            Logger.step('Step 2: Verify product grid');
            await homePage.verifyHomeLoaded();

            Logger.info('✅ Home page renders products');
        }
    );

    test(
        'HOME-002: Product search returns results',
        { tag: ['@regression'] },
        async ({ homePage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Catalog Search' }
            );

            Logger.step('Step 1: Open home');
            await homePage.open();

            Logger.step('Step 2: Search for "pliers"');
            await homePage.search('pliers');

            Logger.step('Step 3: Verify grid still renders results');
            await homePage.verifyHomeLoaded();

            Logger.info('✅ Search returned a non-empty product grid');
        }
    );
});

test.describe('Home Page - Authenticated', () => {
    test(
        'HOME-101: Customer sees authenticated nav on home',
        { tag: ['@smoke', '@regression'] },
        async ({ userPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Catalog' },
                { type: 'story', description: 'HOME-101: Customer landing' }
            );

            Logger.step('Step 1: Navigate to home (already authenticated)');
            await userPage.goto(URLS.HOME);

            Logger.step('Step 2: Verify customer-authenticated nav');
            await userPage.verifyAuthenticated();

            Logger.info('✅ Customer landing verified');
        }
    );

    test(
        'HOME-102: Admin sees authenticated nav on home',
        { tag: ['@smoke', '@regression'] },
        async ({ adminPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Catalog' },
                { type: 'story', description: 'HOME-102: Admin landing' }
            );

            Logger.step('Step 1: Navigate to home (already authenticated)');
            await adminPage.goto(URLS.HOME);

            Logger.step('Step 2: Verify admin-authenticated nav');
            await adminPage.verifyAuthenticated();

            Logger.info('✅ Admin landing verified');
        }
    );
});
