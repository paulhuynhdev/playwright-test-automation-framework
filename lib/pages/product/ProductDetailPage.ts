import { Page, Locator, expect, Response } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { URLS } from '../../../config/urls';
import { MESSAGES } from '../../data/constants/messages';

/**
 * ProductDetailPage — product detail at `/product/:id` on the toolshop demo.
 *
 * App quirks: `unit-price` is the number only (currency symbol lives elsewhere); `nav-cart` /
 * `cart-quantity` are absent until the cart holds ≥1 item; anonymous add-to-favorites gets a
 * 401 with an inline toast (no redirect to login).
 */
export class ProductDetailPage extends BasePage {
    private readonly productName: Locator;
    private readonly unitPrice: Locator;
    private readonly description: Locator;
    private readonly co2Badge: Locator;
    private readonly specsTable: Locator;
    private readonly specRows: Locator;
    private readonly specName: Locator;
    private readonly specValue: Locator;
    private readonly quantityInput: Locator;
    private readonly increaseQtyBtn: Locator;
    private readonly decreaseQtyBtn: Locator;
    private readonly addToCartBtn: Locator;
    private readonly addToFavoritesBtn: Locator;
    private readonly addToCompareBtn: Locator;
    private readonly navCart: Locator;
    private readonly cartQuantity: Locator;
    private readonly toast: Locator;

    constructor(page: Page) {
        super(page);
        this.productName = page.locator('[data-test="product-name"]');
        this.unitPrice = page.locator('[data-test="unit-price"]');
        this.description = page.locator('[data-test="product-description"]');
        this.co2Badge = page.locator('[data-test="co2-rating-badge"]');
        this.specsTable = page.locator('[data-test="product-specs"]');
        this.specRows = page.locator('[data-test="spec-row"]');
        this.specName = page.locator('[data-test="spec-name"]');
        this.specValue = page.locator('[data-test="spec-value"]');
        this.quantityInput = page.locator('[data-test="quantity"]');
        this.increaseQtyBtn = page.locator('[data-test="increase-quantity"]');
        this.decreaseQtyBtn = page.locator('[data-test="decrease-quantity"]');
        this.addToCartBtn = page.locator('[data-test="add-to-cart"]');
        this.addToFavoritesBtn = page.locator('[data-test="add-to-favorites"]');
        this.addToCompareBtn = page.locator('[data-test="add-to-compare"]');
        this.navCart = page.locator('[data-test="nav-cart"]');
        this.cartQuantity = page.locator('[data-test="cart-quantity"]');
        // No data-test on the toast; the app renders it with role="alert".
        this.toast = page.getByRole('alert');
    }

    /* ---------------------------
       Actions
    ---------------------------- */

    async open(productId: string) {
        await this.goto(URLS.product(productId));
        await this.waitForLoaded();
    }

    async waitForLoaded() {
        await this.expectVisible(this.productName);
    }

    async getProductName(): Promise<string> {
        return (await this.productName.textContent())?.trim() ?? '';
    }

    async increaseQuantity(times = 1) {
        for (let i = 0; i < times; i++) await this.click(this.increaseQtyBtn);
    }

    async decreaseQuantity(times = 1) {
        for (let i = 0; i < times; i++) await this.click(this.decreaseQtyBtn);
    }

    async addToCart(): Promise<void> {
        // Wait registered before the click (web-first); cart API on the api subdomain
        // answers POST /carts (create) or /carts/:id (add line).
        const posted = this.page.waitForResponse(
            (r) => /\/carts(\/|$)/.test(r.url()) && r.request().method() === 'POST'
        );
        await this.click(this.addToCartBtn);
        const res = await posted;
        expect([200, 201]).toContain(res.status());
    }

    /** Returns the POST /favorites response so callers branch on 201 (added) vs 409 (duplicate). */
    async addToFavoritesAndWait(): Promise<Response> {
        const posted = this.page.waitForResponse(
            (r) => r.url().includes('/favorites') && r.request().method() === 'POST'
        );
        await this.click(this.addToFavoritesBtn);
        return posted;
    }

    async clickAddToFavoritesAndWait(): Promise<Response> {
        return this.addToFavoritesAndWait();
    }

    /** Badge count; 0 when absent, since the app omits nav-cart entirely for an empty cart. */
    async getCartBadgeCount(): Promise<number> {
        if ((await this.cartQuantity.count()) === 0) return 0;
        const text = (await this.cartQuantity.textContent())?.trim() ?? '0';
        const parsed = parseInt(text, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    /* ---------------------------
       Assertions
    ---------------------------- */

    async verifyProductInfoRendered() {
        await this.expectVisible(this.productName);
        await expect(this.productName).not.toBeEmpty();
        await this.expectVisible(this.unitPrice);
        await expect(this.unitPrice).toHaveText(/^\d+\.\d{2}$/);
        await this.expectVisible(this.description);
        await expect(this.description).not.toBeEmpty();
        await this.expectVisible(this.co2Badge);
    }

    async verifySpecsRendered() {
        await this.expectVisible(this.specsTable);
        await this.expectVisible(this.specRows.first());
        await this.expectVisible(this.specName.first());
        await this.expectVisible(this.specValue.first());
    }

    async verifyActionButtonsVisible() {
        await this.expectVisible(this.addToCartBtn);
        await this.expectVisible(this.addToFavoritesBtn);
        await this.expectVisible(this.addToCompareBtn);
    }

    async verifyOnProductRoute() {
        await expect(this.page).toHaveURL(/\/product\//);
    }

    async expectQuantity(value: string) {
        await expect(this.quantityInput).toHaveValue(value);
    }

    async expectCartBadgeCount(expected: number) {
        await this.expectVisible(this.navCart);
        await expect(this.cartQuantity).toHaveText(String(expected));
    }

    async verifyFavoriteToast() {
        await this.expectVisible(this.toast);
        const added = MESSAGES.FAVORITE_ADDED.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exists = MESSAGES.FAVORITE_EXISTS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(this.toast).toHaveText(new RegExp(`${added}|${exists}`));
    }

    async verifyAddToFavoritesVisible() {
        await this.expectVisible(this.addToFavoritesBtn);
    }

    async verifyUnauthorizedFavoriteToast() {
        await this.expectVisible(this.toast);
        await this.expectText(this.toast.first(), MESSAGES.FAVORITE_UNAUTHORIZED);
        await this.verifyOnProductRoute();
    }
}
