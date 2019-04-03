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


