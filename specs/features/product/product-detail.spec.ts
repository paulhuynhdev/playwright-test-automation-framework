import { test, expect } from '../../../lib/fixtures';
import { ProductDetailPage } from '../../../lib/pages/product/ProductDetailPage';
import { Logger } from '../../../lib/utils/Logger';

/**
 * Product Detail (PROD-001..005) — funnel entry: cart/checkout depend on these.
 * `@ai-generated` until human-reviewed; see docs/test-coverage.md.
 */

const PRODUCT_COMBINATION_PLIERS = '01KST408Y53SANVB9RHWK8221K';
const PRODUCT_THOR_HAMMER = '01KST408YNXNY444KZEREY1K6N';
const THOR_HAMMER_NAME = 'Thor Hammer';

test.describe('Product Detail', () => {
    test(
        'PROD-001: Product detail opens from grid; name + price + specs render',
        { tag: ['@smoke', '@regression', '@ai-generated'] },
        async ({ homePage, productDetailPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Product Detail' },
                { type: 'story', description: 'PROD-001: Detail opens from grid' }
            );

            Logger.step('Step 1: Open home and confirm the product grid');
            await homePage.open();
            await homePage.verifyHomeLoaded();

            Logger.step('Step 2: Open the first product from the grid');
            await homePage.openFirstProduct();
            await productDetailPage.verifyOnProductRoute();
            await productDetailPage.waitForLoaded();

            Logger.step('Step 3: Verify product info, specs, and action buttons');
            await productDetailPage.verifyProductInfoRendered();
            await productDetailPage.verifySpecsRendered();
            await productDetailPage.verifyActionButtonsVisible();

            Logger.info('✅ Product detail renders core content');
        }
    );

    test(
        'PROD-002: Add to cart increments the nav-cart badge',
        { tag: ['@smoke', '@regression', '@critical', '@ai-generated'] },
        async ({ userPage, productDetailPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'critical' },
                { type: 'feature', description: 'Product Detail' },
                { type: 'story', description: 'PROD-002: Add to cart' }
            );
            void userPage; // activates the authenticated customer session

            Logger.step('Step 1: Open the product detail page');
            await productDetailPage.open(PRODUCT_COMBINATION_PLIERS);

            Logger.step('Step 2: Capture the current cart badge count');
            // Assert increment vs baseline, not a hard "1" — the reused session may carry a cart.
            const before = await productDetailPage.getCartBadgeCount();

            Logger.step('Step 3: Add to cart and verify the badge incremented');
            await productDetailPage.addToCart();
            await productDetailPage.expectCartBadgeCount(before + 1);

            Logger.info('✅ Cart badge incremented after add-to-cart');
        }
    );

    test(
        'PROD-003: Increase/decrease quantity adjusts qty before add',
        { tag: ['@regression', '@ai-generated'] },
        async ({ productDetailPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Product Detail' },
                { type: 'story', description: 'PROD-003: Quantity controls' }
            );

            Logger.step('Step 1: Open the product detail page');
            await productDetailPage.open(PRODUCT_COMBINATION_PLIERS);
            await productDetailPage.expectQuantity('1');

            Logger.step('Step 2: Increase quantity twice → 3');
            await productDetailPage.increaseQuantity(2);
            await productDetailPage.expectQuantity('3');

            Logger.step('Step 3: Decrease quantity twice → 1');
            await productDetailPage.decreaseQuantity(2);
            await productDetailPage.expectQuantity('1');

            Logger.step('Step 4: Decrease at the lower bound stays at 1');
            await productDetailPage.decreaseQuantity(1);
            await productDetailPage.expectQuantity('1');

            Logger.info('✅ Quantity controls behave within bounds');
        }
    );

    test(
        'PROD-004: Add to favorites (authenticated) persists to account',
        { tag: ['@regression', '@ai-generated'] },
        async ({ userPage, productDetailPage, favoritesPage }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Product Detail' },
                { type: 'story', description: 'PROD-004: Add to favorites' }
            );
            void userPage;

            Logger.step('Step 1: Open the product detail page');
            await productDetailPage.open(PRODUCT_THOR_HAMMER);
            await productDetailPage.verifyAddToFavoritesVisible();

            Logger.step('Step 2: Add to favorites and verify the API succeeded');
            const res = await productDetailPage.addToFavoritesAndWait();
            // 201 first add, 409 if already favorited — both leave it persisted (Step 3 verifies).
            expect([200, 201, 409]).toContain(res.status());
            await productDetailPage.verifyFavoriteToast();

            Logger.step('Step 3: Verify the product persists on the favorites page');
            await favoritesPage.open();
            await favoritesPage.verifyProductListed(THOR_HAMMER_NAME);

            Logger.info('✅ Favorite persisted to the account');
        }
    );

    test(
        'PROD-005: Add to favorites while anonymous is rejected',
        { tag: ['@regression', '@negative', '@ai-generated'] },
        async ({ browser }, testInfo) => {
            testInfo.annotations.push(
                { type: 'severity', description: 'normal' },
                { type: 'feature', description: 'Product Detail' },
                { type: 'story', description: 'PROD-005: Anonymous favorites gate' }
            );

            // This spec runs in the authenticated project — spin up a storage-less context for anon.
            const context = await browser.newContext({ storageState: undefined });
            const page = await context.newPage();
            try {
                const productDetailPage = new ProductDetailPage(page);

                Logger.step('Step 1: Open the product detail page anonymously');
                await productDetailPage.open(PRODUCT_COMBINATION_PLIERS);
                await productDetailPage.verifyAddToFavoritesVisible();

                Logger.step('Step 2: Add to favorites → server rejects with 401');
                const res = await productDetailPage.clickAddToFavoritesAndWait();
                expect(res.status()).toBe(401);

                Logger.step('Step 3: Verify the unauthorized toast, staying on the product');
                await productDetailPage.verifyUnauthorizedFavoriteToast();

                Logger.info('✅ Anonymous favorites action rejected with an error toast');
            } finally {
                await context.close();
            }
        }
    );
});
