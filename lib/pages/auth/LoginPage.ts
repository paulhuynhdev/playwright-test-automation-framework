import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { ENV } from '../../../config/env';
import { URLS } from '../../../config/urls';

/**
 * LoginPage — Practice Software Testing toolshop
 * Login form at `/auth/login`. Uses Playwright-friendly `data-test`
 * selectors exposed by the application.
 */
export class LoginPage extends BasePage {
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginSubmit: Locator;
    private readonly errorAlert: Locator;
    private readonly authedNav: Locator;

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginSubmit = page.locator('[data-test="login-submit"]');
        this.errorAlert = page.locator('[data-test="login-error"]');
        // Top-nav menu shown only when authenticated — the "already logged in" marker.
        this.authedNav = page.locator('[data-test="nav-menu"]');
    }

    /* ---------------------------
       Actions
    ---------------------------- */

    async openLoginPage() {
        await this.goto(`${ENV.BASE_URL}${URLS.LOGIN}`);
    }

    /**
     * Whether a credential login is still required after landing on `/auth/login`.
     * @remarks Decides by racing the two possible outcomes instead of reading `page.url()`
     * (which races the SPA's client redirect) or guessing a fixed timeout (which false-skips
     * on a slow fresh load). A `storageState` session redirects to the authed nav; a fresh
     * visitor sees the email field — whichever appears first wins, so this is fast and
     * correct in both cases.
     */
    async isLoginRequired(): Promise<boolean> {
        const formShown = this.emailInput
            .waitFor({ state: 'visible' })
            .then(() => 'login')
            .catch(() => 'timeout');
        const authedShown = this.authedNav
            .waitFor({ state: 'visible' })
            .then(() => 'authed')
            .catch(() => 'timeout');
        const winner = await Promise.race([formShown, authedShown]);
        return winner === 'login';
    }

    /**
     * Submit the login form.
     * @remarks Uses `stableFill` (clear → type char-by-char → assert value) because the
     * Angular form re-renders on input and a plain `fill` can drop characters. The error
     * banner (`[data-test="login-error"]`) only appears AFTER a failed submit — assert on it
     * via {@link verifyErrorMessage}, never on URL.
     */
    async login(email: string, password: string) {
        await this.stableFill(this.emailInput, email);
        await this.stableFill(this.passwordInput, password);
        await this.click(this.loginSubmit);
    }

    /**
     * Attempt a login with possibly-empty fields (for required-field validation tests).
     * Empty strings are intentionally left unfilled so the app's client-side validation
     * triggers. Tolerates a disabled submit button — some forms disable until valid;
     * either way the form must reject and keep us on the login page.
     */
    async attemptLogin(email: string, password: string) {
        await this.openLoginPage();
        if (email) await this.stableFill(this.emailInput, email);
        if (password) await this.stableFill(this.passwordInput, password);
        await this.loginSubmit.click({ timeout: 5000 }).catch(() => undefined);
    }

    /* ---------------------------
       Assertions
    ---------------------------- */

    async verifyErrorMessage(expectedMessage: string) {
        await this.expectVisible(this.errorAlert);
        await this.expectText(this.errorAlert, expectedMessage);
    }

    /** Assert the login form is still shown — i.e. submission was rejected. */
    async verifyStillOnLoginForm() {
        await this.expectVisible(this.emailInput);
    }
}
