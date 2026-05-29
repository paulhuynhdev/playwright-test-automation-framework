import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { URLS } from '../../../config/urls';

/**
 * FavoritesPage — authenticated favorites list at `/account/favorites`. Saved items reuse the
 * catalog `[data-test="product-name"]` card, so presence is checked by product name.
 */
export class FavoritesPage extends BasePage {
    private readonly productNames: Locator;

    constructor(page: Page) {
        super(page);
        this.productNames = page.locator('[data-test="product-name"]');
    }

    async open() {
        await this.goto(URLS.ACCOUNT_FAVORITES);
    }

    async verifyProductListed(name: string) {
        await this.expectVisible(this.productNames.filter({ hasText: name }).first());
    }
}
