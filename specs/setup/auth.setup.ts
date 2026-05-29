import path from 'node:path';
import fs from 'node:fs';
import { test } from '../../lib/fixtures';
import { USER_ROLES } from '../../lib/data/constants/roles';
import { HomePage } from '../../lib/pages/home/HomePage';
import { Logger } from '../../lib/utils/Logger';
import { APP_CONSTANTS } from '../../lib/data/constants/app-constants';

/**
 * Authentication Setup
 * --------------------
 * Runs once before any authenticated specs.
 *  1. Logs in as the default USER role using the shared `loginAs` fixture.
 *  2. Verifies that the toolshop home page loaded post-login.
 *  3. Persists the authenticated browser state to `APP_CONSTANTS.STORAGE_PATH`,
 *     which the `authenticated` Playwright project reuses to skip login.
 */
test('authenticate user', async ({ loginAs, page }, testInfo) => {
    Logger.info(`▶ Authenticating against: ${testInfo.project.use.baseURL}`);

    await loginAs(USER_ROLES.USER);

    const home = new HomePage(page);
    await home.verifyAuthenticated();

    const storagePath = path.resolve(process.cwd(), APP_CONSTANTS.STORAGE_PATH);
    fs.mkdirSync(path.dirname(storagePath), { recursive: true });

    await page.context().storageState({ path: storagePath });
    Logger.success(`Session persisted at ${storagePath}`);
});
