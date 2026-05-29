import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { URLS } from '../../../config/urls';
import { AssertionHelper } from '../../helpers/AssertionHelper';
import { Logger } from '../../utils/Logger';
import { MESSAGES } from '../../data/constants/messages';

/**
 * HomePage — Practice Software Testing toolshop
 * Catalog landing page at `/`. Displays the product grid plus a
 * search box and the top-nav sign-in entry point.
 */
export class HomePage extends BasePage {
    private readonly productGrid: Locator;
    private readonly searchInput: Locator;
    private readonly searchSubmit: Locator;
    private readonly navMenu: Locator;
    private readonly signInLink: Locator;

    constructor(page: Page) {
        super(page);
        this.productGrid = page.locator('[data-test="product-name"]');
        this.searchInput = page.locator('[data-test="search-query"]');
        this.searchSubmit = page.locator('[data-test="search-submit"]');
        this.navMenu = page.locator('[data-test="nav-menu"]');
        this.signInLink = page.locator('[data-test="nav-sign-in"]');
    }

    /* ---------------------------
       Actions
    ---------------------------- */

    async open() {
        await this.goto(URLS.HOME);
    }

    async search(term: string) {
        await this.stableFill(this.searchInput, term);
        await this.click(this.searchSubmit);
    }

    /**
     * Open the first product in the grid and wait for its detail data to load.
     * @remarks Register the `GET /products/:id` wait BEFORE the click so the detail fetch
     * can't resolve between click and listener (web-first; no fixed timeout).
     */
    async openFirstProduct() {
        const detailLoaded = this.page.waitForResponse(
            (r) => /\/products\/[^/?]+/.test(r.url()) && r.request().method() === 'GET'
        );
        await this.click(this.productGrid.first());
        await detailLoaded;
    }

    /* ---------------------------
       Assertions
    ---------------------------- */

    async verifyHomeLoaded() {
        await AssertionHelper.urlContains(this.page, URLS.HOME);
        await this.expectVisible(this.productGrid.first());
        Logger.success(MESSAGES.HOME_LOADED);
    }

    /**
     * Assert an authenticated session is active.
     * @remarks Post-login the SPA redirects client-side and the top-nav swaps the sign-in
     * link for the user menu (`[data-test="nav-menu"]`). Assert on that element, not on the
     * URL — navigation may not have settled when the assertion runs.
     */
    async verifyAuthenticated() {
        await this.expectVisible(this.navMenu);
    }
}
