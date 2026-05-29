/* -------------------------------------------------------
 * Logger Utility
 * -------------------------------------------------------
 * Purpose:
 * - Centralized logging for tests, pages, fixtures, utils
 * - Clear log levels for debugging & CI visibility
 * - No external dependencies
 * -------------------------------------------------------
 */

export class Logger {
    /* ---------------------------
       Core Helpers
    ---------------------------- */

    private static timestamp(): string {
        return new Date().toISOString();
    }

    private static format(level: string, message: string): string {
        return `[${this.timestamp()}] [${level}] ${message}`;
    }

    /* ---------------------------
       Log Levels
    ---------------------------- */

    static info(message: string): void {
        console.log(this.format('INFO', message));
    }

    // Gated on DEBUG env so detailed traces stay silent in CI by default.
    static debug(message: string): void {
        if (process.env.DEBUG === 'true') {
            console.debug(this.format('DEBUG', message));
        }
    }

    static warn(message: string): void {
        console.warn(this.format('WARN', message));
    }

    static error(message: string, error?: unknown): void {
        console.error(this.format('ERROR', message));

        if (error instanceof Error) {
            console.error(error.stack);
        }
    }

    static success(message: string): void {
        console.log(this.format('SUCCESS', message));
    }

    /* ---------------------------
       Test-Specific Helpers
    ---------------------------- */

    static step(message: string): void {
        console.log(this.format('STEP', message));
    }

    static assertion(message: string): void {
        console.log(this.format('ASSERT', message));
    }

    static api(message: string): void {
        console.log(this.format('API', message));
    }

    static navigation(message: string): void {
        console.log(this.format('NAV', message));
    }
}
