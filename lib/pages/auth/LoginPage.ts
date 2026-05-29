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

    constructor(page: Page) {
        super(page);
        this.emailInput = page.locator('[data-test="email"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginSubmit = page.locator('[data-test="login-submit"]');
        this.errorAlert = page.locator('[data-test="login-error"]');
    }

    /* ---------------------------
       Actions
    ---------------------------- */

    async openLoginPage() {
        await this.goto(`${ENV.BASE_URL}${URLS.LOGIN}`);
    }

    async login(email: string, password: string) {
        await this.stableFill(this.emailInput, email);
        await this.stableFill(this.passwordInput, password);
        await this.click(this.loginSubmit);
    }

    /* ---------------------------
       Assertions
    ---------------------------- */

    async verifyErrorMessage(expectedMessage: string) {
        await this.expectVisible(this.errorAlert);
        await this.expectText(this.errorAlert, expectedMessage);
    }
}
