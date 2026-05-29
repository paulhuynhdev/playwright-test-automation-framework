import { Page, Locator, expect } from '@playwright/test';

/* -------------------------------------------------------
 * Wait Utility
 * -------------------------------------------------------
 * Purpose:
 * - Centralized waiting mechanisms
 * - Helps stabilize tests by avoiding fixed sleeps
 * -------------------------------------------------------
 */

export class Wait {

    /* ---------------------------
       Page / Navigation
    ---------------------------- */

    static async forNetworkIdle(page: Page, timeout = 10_000): Promise<void> {
        await page.waitForLoadState('networkidle', { timeout });
    }

    static async forDomContentLoaded(page: Page, timeout = 10_000): Promise<void> {
        await page.waitForLoadState('domcontentloaded', { timeout });
    }

    static async forPageLoad(page: Page, timeout = 10_000): Promise<void> {
        await page.waitForLoadState('load', { timeout });
    }

    static async forURL(
        page: Page,
        urlPart: string | RegExp,
        timeout = 10_000
    ): Promise<void> {
        await page.waitForURL(urlPart, { timeout });
    }

    /* ---------------------------
       Locator / Element
    ---------------------------- */

    static async forVisible(
        locator: Locator,
        timeout = 10_000
    ): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    static async forHidden(
        locator: Locator,
        timeout = 10_000
    ): Promise<void> {
        await locator.waitFor({ state: 'hidden', timeout });
    }


    static async forDetached(
        locator: Locator,
        timeout = 10_000
    ): Promise<void> {
        await locator.waitFor({ state: 'detached', timeout });
    }

    static async forEnabled(
        locator: Locator,
        timeout = 10_000
    ): Promise<void> {
        await expect(locator).toBeEnabled({ timeout });
    }

    static async forDisabled(
        locator: Locator,
        timeout = 10_000
    ): Promise<void> {
        await expect(locator).toBeDisabled({ timeout });
    }

    /* ---------------------------
       Assertions (Wait + Verify)
    ---------------------------- */

    static async forText(
        locator: Locator,
        text: string | RegExp,
        timeout = 10_000
    ): Promise<void> {
        await expect(locator).toHaveText(text, { timeout });
    }

    static async forCount(
        locator: Locator,
        count: number,
        timeout = 10_000
    ): Promise<void> {
        await expect(locator).toHaveCount(count, { timeout });
    }

    /* ---------------------------
       Utility / Debug
    ---------------------------- */

    /**
     * Waits until condition function returns true
     * Use sparingly for edge cases
     */
    static async until(
        page: Page,
        condition: () => Promise<boolean>,
        timeout = 10_000,
        interval = 500
    ): Promise<void> {
        const start = Date.now();

        while (Date.now() - start < timeout) {
            if (await condition()) return;
            await page.waitForTimeout(interval);
        }

        throw new Error('Wait.until: condition not met within timeout');
    }

    /**
     * ⏸ Visual-only pause for LOCAL debugging.
     * ❗ Never use this for assertions or synchronization.
     * ❗ Skipped automatically in CI.
     */
    static async pause(
        page: Page,
        ms: number = 3_000
    ): Promise<void> {
        if (process.env.CI) return;

        await page.waitForTimeout(ms);
    }
}
