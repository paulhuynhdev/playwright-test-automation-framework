import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { HomePage } from '../pages/home/HomePage';
import { ProductDetailPage } from '../pages/product/ProductDetailPage';
import { FavoritesPage } from '../pages/account/FavoritesPage';

/**
 * Keep this fixture free of authentication or business logic; that belongs
 * in `auth.fixture.ts` and `lib/helpers/*` respectively.
 */
type BaseFixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
    productDetailPage: ProductDetailPage;
    favoritesPage: FavoritesPage;
};

export const test = base.extend<BaseFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },

    favoritesPage: async ({ page }, use) => {
        await use(new FavoritesPage(page));
    },
});

export { expect };
