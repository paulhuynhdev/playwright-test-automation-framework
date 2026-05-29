/**
 * Environment Configuration Loader
 * --------------------------------
 * Loads `.env` once and centralizes all environment-specific values.
 * Fails fast if a required variable is missing.
 *
 * Any code that needs an environment value must import from this module — never
 * read from `process.env` directly elsewhere in the project.
 */

import * as dotenv from 'dotenv';

dotenv.config();

function getRequiredVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
}

function getBoolFlag(key: string, defaultValue = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
}

const BASE_URL = getRequiredVar('BASE_URL');
const USER_EMAIL = getRequiredVar('USER_EMAIL');
const USER_PASSWORD = getRequiredVar('USER_PASSWORD');
const ADMIN_EMAIL = getRequiredVar('ADMIN_EMAIL');
const ADMIN_PASSWORD = getRequiredVar('ADMIN_PASSWORD');

export const ENV = {
    BASE_URL,

    USER_EMAIL,
    USER_PASSWORD,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,

    // Runtime flags
    IS_CI: getBoolFlag('CI') || getBoolFlag('GITHUB_ACTIONS'),
    DEBUG: getBoolFlag('DEBUG'),

    // Nested access by role
    USERS: {
        USER: { email: USER_EMAIL, password: USER_PASSWORD },
        ADMIN: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    },
} as const;
