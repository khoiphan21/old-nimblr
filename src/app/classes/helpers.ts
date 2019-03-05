import { fail } from 'assert';

export function isUuid(value: string): boolean {
    const expression = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return expression.exec(value) === null ? false : true;
}

/**
 * Process an error during an asynchronous test
 *
 * @param message The message to fail the test with
 * @param error the error object to log to console
 * @param done the 'done' object to mark the test as done
 */
export function processTestError(message: string, error: any, done: any) {
    fail(message);
    console.error(error);
    done();
}
